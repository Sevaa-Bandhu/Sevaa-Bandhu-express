// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const staticRoutes = require('./routes/static');
const helpRoutes = require('./routes/help');
const registerRouter = require('./routes/register');


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI,)
.then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Static files
app.use('/auth', authRoutes);
app.use('/', staticRoutes);
app.use('/', helpRoutes);
app.use('/', registerRouter);

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


// load dynamic data from MongoDB
app.get('/', async (req, res) => {
  const user = req.session.user || null;
  res.render('index', { user });
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
