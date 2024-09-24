import { MongoClient, ServerApiVersion } from 'mongodb';
import 'dotenv/config';
import { nanoid } from 'nanoid';

if (process.env.DATABASE_CONNECTION_STRING == null) {
  throw new Error('Connection string is not defined');
} else if (process.env.DATABASE_NAME == null) {
  throw new Error('Database name is not defined');
}

const TOPICS = [
  {
    id: nanoid(),
    name: 'Document Databases',
    description:
      'A document database (also known as a document-oriented database or a document store) is a database that stores information in documents',
  },
  {
    id: nanoid(),
    name: 'Normalization',
    description:
      'Database normalization is the process of organizing data into tables in such a way that the results of using the database are always unambiguous and as intended. Such normalization is intrinsic to relational database theory.',
  },
  {
    id: nanoid(),
    name: 'ER Diagrams',
    description:
      'An entity-relationship model describes interrelated things of interest in a specific domain of knowledge. A basic ER model is composed of entity types and specifies relationships that can exist between entities.',
  },
  {
    id: nanoid(),
    name: 'Document Databases CRUD methods',
    description: 'Create, Read, Update, Delete',
  },
  {
    id: nanoid(),
    name: 'Database Connection to Frontend',
    description: 'How to connect a document database to a web front-end page',
  },
];

const client = new MongoClient(process.env.DATABASE_CONNECTION_STRING, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function createIndexes(database) {
  await database.collection('student_activity_join').createIndex({ student_id: 1, activity_id: 1 });
  await database.collection('activity').createIndex({ topic_id: 1 });
  await database.collection('topic').createIndex({ name: 1 });
  console.log('Indexes created successfully');
}

async function initializeDatabase() {
  try {
    await client.connect();

    const database = client.db(process.env.DATABASE_NAME);

    await database.createCollection('topic', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          title: 'Topic Object Validation',
          required: ['id', 'name', 'description'],
          properties: {
            id: {
              bsonType: 'string',
              description: "'id' must be a string and is required",
            },
            name: {
              bsonType: 'string',
              description: "'name' must be a string and is required",
            },
            description: {
              bsonType: 'string',
              description: "'description' must be a string and is required",
            },
          },
        },
      },
    });

    await database.collection('topic').insertMany(TOPICS);

    await database.createCollection('activity', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          title: 'Activity Object Validation',
          required: ['id', 'topic_id', 'name', 'type'],
          properties: {
            id: {
              bsonType: 'string',
              description: "'id' must be a string and is required",
            },
            topic_id: {
              bsonType: 'string',
              description: "'topic_id' must be a string and is required",
            },
            name: {
              bsonType: 'string',
              description: "'name' must be a string and is required",
            },
            type: {
              bsonType: 'string',
              description: "'type' must be a string and is required",
            },
          },
        },
      },
    });

    await database.createCollection('student', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          title: 'Student Object Validation',
          required: ['id', 'name', 'email', 'password'],
          properties: {
            id: {
              bsonType: 'string',
              description: "'id' must be a string and is required",
            },
            name: {
              bsonType: 'string',
              description: "'name' must be a string and is required",
            },
            email: {
              bsonType: 'string',
              description: "'email' must be a string and is required",
            },
            password: {
              bsonType: 'string',
              description: "'password' must be a string and is required",
            },
          },
        },
      },
    });

    await database.createCollection('student_activity_join', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          title: 'Student Activity Join Object Validation',
          required: ['student_id', 'activity_id', 'is_completed'],
          properties: {
            student_id: {
              bsonType: 'string',
              description: "'student_id' must be a string and is required",
            },
            activity_id: {
              bsonType: 'string',
              description: "'activity_id' must be a string and is required",
            },
            is_completed: {
              bsonType: 'bool',
              description: "'is_completed' must be a boolean and is required",
            },
          },
        },
      },
    });

    // Indexes
    await createIndexes(database);

    // Dummy data for ERD (should be called before dummy data for front-end connection)
    await insertERDiagramsData(database);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

initializeDatabase();
