import { Router } from 'express';
import bcrypt from 'bcrypt';
import { database } from '../database/connection.js';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';

const router = Router();

// Create the student collection with validation and a unique index
async function setupStudentCollection() {
  const studentCollection = database.collection('student');

  // Create a unique index on the email field
  await studentCollection.createIndex({ email: 1 }, { unique: true });
}

// Call the setup function to ensure the collection is configured correctly
setupStudentCollection().catch(console.error);

// POST route for student login/signup
router.post('/api/v1/student', async (req, res) => {
  console.log('Request received:', req.body);
  try {
    const { action, name, email, password } = req.body;

    // Check if action is provided
    if (!action || !email || !password) {
      return res.status(400).json({ error: 'Action, email, and password are required' });
    }

    const studentCollection = database.collection('student');

    if (action === 'login') {
      // Login logic
      const student = await studentCollection.findOne({ email });
      if (!student) {
        return res.status(404).json('No student found with this email');
      }

      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(401).json('Incorrect password');
      }

      const token = jwt.sign({ email: student.email, id: student.id }, process.env.SECRET_KEY, {
        expiresIn: '1h',
      });
      return res.status(200).json({ message: 'Login successful', token });
    } else if (action === 'signup') {
      // Signup logic
      if (!name) {
        return res.status(400).json('Name is required for signup');
      }

      // Check if email already exists in the database
      const existingStudent = await studentCollection.findOne({ email });
      if (existingStudent) {
        return res.status(400).json('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newStudent = {
        id: nanoid(),
        name,
        email,
        password: hashedPassword,
      };

      try {
        await studentCollection.insertOne(newStudent);
        // Generate JWT after signup
        const token = jwt.sign(
          { email: newStudent.email, id: newStudent.id },
          process.env.SECRET_KEY,
          { expiresIn: '1h' },
        );
        return res.status(201).json({ message: 'Signup successful', token });
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate key error code
          return res.status(400).json('Email already in use');
        }
        console.error('Error during signup:', error);
        return res.status(500).json('Internal server error');
      }
    } else {
      return res.status(400).json('Invalid action specified');
    }
  } catch (error) {
    console.error('Error during login/signup:', error);
    return res.status(500).json('Internal server error');
  }
});

export default router;
