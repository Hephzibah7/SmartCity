// server.js (or index.js)
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Server } from 'socket.io';
import http from 'http';
import axios from 'axios';
// Custom authentication middleware

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(express.json());
app.use(cors()); // Use the cors middleware
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection using MongoDB Atlas connection string
const mongoURI = "mongodb+srv://heph:heph@cluster0.pmjyzdh.mongodb.net/smartcity"; // Replace 'your_mongodb_atlas_connection_string' with your actual MongoDB Atlas connection string
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Secret key (this should be stored securely and not hard-coded in real applications)
const secretKey = 'your_secret_key';

// const server = http.createServer(app);

 const server = http.createServer(app).listen(9003, function(){
  console.log("Express server listening on port " + 9003);
});
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"] // Adjust this to your frontend's URL in a production environment
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', async (data) => {
    const { sender, receiver, message } = data;
    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();
    io.emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


// User schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    state: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Mock data for storing OTPs temporarily
let otpData;

// POST endpoint to send OTP
app.post('/sendOTP', (req, res) => {
  console.log("hello");
    const { email } = req.body;
    if (email) {
        const randomOTP = Math.floor(1000 + Math.random() * 9000);
        console.log('Generated OTP:', randomOTP);

        // Configure nodemailer with your email service
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hephzibahranjan@gmail.com', // Replace with your email address
                pass: 'arbmustjhkuvyryr', // Replace with your email password or an app-specific password
            },
        });

        const mailOptions = {
            from: 'hephzibahranjan@gmail.com', // Sender email address
            to: email, // Receiver email address
            subject: 'Your OTP for SignUp',
            text: `Your OTP is: ${randomOTP}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).send('Error sending the required OTP.');
            } else {
                console.log('Email sent:', info.response);
                // Mocking the email sending process
                console.log(`Sending OTP ${randomOTP} to ${email}`);
                otpData= randomOTP;
                res.status(200).json({ message: 'OTP sent successfully.' });
            }
        });
    } else {
        res.status(400).send('Invalid request.');
    }
});


// POST endpoint to verify OTP and signup
app.post('/verifyOTP', (req, res) => {
    const { email, otp } = req.body;
    if (email && otp) {
        if (otp == otpData) {
            // Clear OTP data after successful verification
            console.log("hurray");
            res.status(200).send('OTP verified successfully');
        } else {
            res.status(400).send('Invalid OTP');
        }
    } else {
        res.status(400).send('Invalid request.');
    }
});


// Register endpoint
app.post('/register', async (req, res) => {
    try {
        const { email, password, role, state } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword , role, state});
        await newUser.save();
        const savedUser = await newUser.save(); // Save the new user to the database
        const userId = savedUser._id; // Get the user ID from the saved user object
        // res.status(201).send('User registered successfully.');
        res.status(201).json({ message: 'User Registered Successfully successfully.', userId:userId});
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user. Please try again later.');
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found.');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Invalid credentials.');
        }
        const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '7d' });
        console.log(token);
        console.log(req.body);
        res.json({ userId: user._id, token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in. Please try again later.');
    }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401); // Unauthorized if no token provided
    }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.sendStatus(403); // Forbidden if token is invalid or expired
        }
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    });
};

// Replace with your News API key
const NEWS_API_KEY = '0b96109ea2f94ba1927d7127662ba036';
// url = f'https://newsapi.org/v2/top-headlines/data?apiKey={NEWS_API_KEY';

// Endpoint to fetch news based on state
app.get('/news', authenticateToken, async (req, res) => {
    const state = req.query.state;
  
    if (!state) {
      return res.status(400).json({ error: 'State parameter is required' });
    }
  
    try {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(state)}&apiKey=0b96109ea2f94ba1927d7127662ba036`;
  
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Error fetching news: ${response.statusText}`);
      }
  
      const articles = await response.json();
      res.json(articles);
    } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({ error: 'Error fetching news' });
    }
  });


  app.get('/places', authenticateToken, async (req, res) => {
    const { state, type } = req.query;
  
    try {
      // Step 1: Fetch location from OpenStreetMap
      const locationResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: state,
          format: 'json',
          addressdetails: 1,
        }
      });
  
      if (locationResponse.data.length === 0) {
        return res.status(404).json({ message: 'Location not found' });
      }
      
      const location = locationResponse.data[0];
      const lat = location.lat;
      const lon = location.lon;
  
      // Step 2: Fetch places from Foursquare
      const placesResponse = await axios.get('https://api.foursquare.com/v3/places/search', {
        headers: {
          "Accept": "application/json",
          "Authorization": "fsq3I4lvJrsVeui6BcyB1AWce/bzF+vYiI/QUG0ybiBLia0="
        },
        params: {
          ll: `${lat},${lon}`, // Use latitude and longitude
          query:type

        }
      });
   
      const places = placesResponse.data.results;
      if (places.length === 0) {
        return res.status(404).json({ message: 'No places found' });
      }
  
      // Step 3: Fetch details for each place
      const placeDetailsPromises = places.map(async (place) => {
        const placeDetailsResponse = await axios.get(`https://api.foursquare.com/v3/places/${place.fsq_id}`, {
          headers: {
            "Accept": "application/json",
            "Authorization": "fsq3I4lvJrsVeui6BcyB1AWce/bzF+vYiI/QUG0ybiBLia0="
          }
        });
        return placeDetailsResponse.data;
      });
  
      const detailedPlaces = await Promise.all(placeDetailsPromises);
  
      // Step 4: Return detailed place information
      res.json(detailedPlaces);
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.error(error.message);
    }
  });
  
  const issueSchema = new mongoose.Schema({
    name: String,
    email: String,
    issueType: String,
    description: String,
  });
  
  const Issue = mongoose.model('Issue', issueSchema);
  
  // Routes
  app.post('/report-issue', authenticateToken, async (req, res) => {
    const { name, email, issueType, description } = req.body;
  
    const newIssue = new Issue({
      name,
      email,
      issueType,
      description,
    });
  
    try {
      await newIssue.save();
      res.status(201).send('Issue reported successfully');
    } catch (error) {
      res.status(400).send('Error reporting issue');
    }
  });

// Start the server
const port = 9002;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});