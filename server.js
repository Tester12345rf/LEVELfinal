// const express = require('express');
// const bodyParser = require('body-parser');
// const { MongoClient } = require('mongodb');

// const app = express();
// const port = 3000; // Change to your desired port

// app.use(bodyParser.json());

// // MongoDB Atlas connection URL
// const url =
//   'mongodb+srv://UserCRUD:eLvfBXntwQRFQyZn@cluster0.jy9rhsv.mongodb.net/LMSLevel?retryWrites=true&w=majority';

// app.get('/', (req, res) => {
//   res.send('Hello World');
// });

// app.post('/updateMongoDB', async (req, res) => {
//   try {
//     const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
//     await client.connect();
//     console.log('Connected to MongoDB');

//     const db = client.db();
//     const collection = db.collection('Level');

//     // Search for a document with the specified email
//     const email = req.body.email; // Assuming the email is sent in the request body
//     const existingDocument = await collection.findOne({ email });

//     if (existingDocument) {
//       // Email found, update the 'level' field
//       const newLevel = req.body.level;
//       await collection.updateOne({ email }, { $set: { level: newLevel } });
//       client.close();
//       res.status(200).send('Update successful');
//     } else {
//       // Email not found
//       client.close();
//       res.status(404).send('Email not found');
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal server error');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// import express from 'express';
// import { MongoClient } from 'mongodb';

// const app = express();
// const port = 3000;

// app.use(express.json());

// // MongoDB Atlas connection URL
// const url = `mongodb+srv://UserCRUD:eLvfBXntwQRFQyZn@cluster0.jy9rhsv.mongodb.net/LMSLevel?retryWrites=true&w=majority`;

// app.get('/', (req, res) => res.send('Hello World!'));

// app.post('/updateMongoDB', async (req, res) => {
//   try {
//     const client = new MongoClient(url);
//     await client.connect();
//     console.log('Connected to MongoDB');

//     const db = client.db();
//     const collection = db.collection('Level');

//     const { email, level } = req.body; // Destructuring request body

//     const existingDocument = await collection.findOne({ email });

//     if (existingDocument) {
//       await collection.updateOne({ email }, { $set: { level } });
//       client.close();
//       res.status(200).send('Update successful');
//     } else {
//       client.close();
//       res.status(404).send('Email not found');
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal server error');
//   }
// });

// app.listen(port, () => console.log(`Server is running on port ${port}`));


import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = 3000;

// MongoDB Atlas connection string (replace with your actual connection string)
const mongoUrl = 'mongodb+srv://UserCRUD:eLvfBXntwQRFQyZn@cluster0.jy9rhsv.mongodb.net/LMSLevel?retryWrites=true&w=majority';

// Define a Mongoose schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  level: String,
});

// Create a Mongoose model
const UserModel = mongoose.model('User', userSchema);

// Express middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect(mongoUrl);

// API endpoint to handle updates from Google Sheets
app.post('/update-mongodb', async (req, res) => {
  const { userEmail, newLevel } = req.body;

  try {
    // Update the MongoDB field for the user using Mongoose
    const result = await UserModel.updateOne(
      { email: userEmail },
      { $set: { level: newLevel } }
    );

    if (result.nModified > 0) {
      res.status(200).json({ success: true, message: 'MongoDB field updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});