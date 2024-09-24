import { MongoClient, ServerApiVersion } from 'mongodb';
import 'dotenv/config';
import { nanoid } from 'nanoid';

const client = new MongoClient(process.env.DATABASE_CONNECTION_STRING, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

async function insertERDiagramsData() {
  try {
    await client.connect();
    const database = client.db(process.env.DATABASE_NAME);

    const topicCollection = database.collection('topic');
    const activityCollection = database.collection('activity');
    const studentCollection = database.collection('student');
    const studentActivityJoinCollection = database.collection('student_activity_join');

    const erDiagramTopic = await topicCollection.findOne({ name: 'ER Diagrams' });

    if (!erDiagramTopic) {
      throw new Error('ER Diagrams topic not found');
    }

    const student = {
      id: nanoid(),
      name: 'John',
      email: 'john@example.com',
      password: 'hashed_password',
    };
    await studentCollection.insertOne(student);
    console.log('Inserted student:', student);

    const activities = [
      { id: nanoid(), topic_id: erDiagramTopic.id, name: 'ER Diagrams Quiz 1', type: 'quiz' },
      { id: nanoid(), topic_id: erDiagramTopic.id, name: 'ER Diagrams Quiz 2', type: 'quiz' },
      { id: nanoid(), topic_id: erDiagramTopic.id, name: 'ER Diagrams Tutorial', type: 'tutorial' },
    ];

    const activityResult = await activityCollection.insertMany(activities);
    console.log('Inserted activities:', activityResult.insertedIds);

    const studentActivities = [
      { student_id: student.id, activity_id: activities[0].id, is_completed: false },
      { student_id: student.id, activity_id: activities[1].id, is_completed: true },
      { student_id: student.id, activity_id: activities[2].id, is_completed: false },
    ];

    const joinResult = await studentActivityJoinCollection.insertMany(studentActivities);
    console.log('Inserted student activities:', joinResult.insertedIds);
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    await client.close();
  }
}

insertERDiagramsData();
