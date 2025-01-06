const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const axios = require('axios');
const roleMiddleware = require('../middleware/roleMiddleware');
const Employee = require('../models/Employee');
const multer = require('multer');
const Cloudinary = require('../Cloudinary.js');
const upload = multer({ dest: 'uploads/' }); 
const { addEventToCalendar } = require('../services/calendarService');
const { sendEmail } = require('../services/emailService');

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  console.log("call");
  
  try {
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Create new user
    const user = new User({ username, password, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during registration:', err.message); // Log the error
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Set token in httpOnly cookie
    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000, // 1 hour
      })
      .json({ message: 'Login successful', role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

// Protected Route Example
router.post('/upload', upload.single('profilePicture'), async (req, res) => {
  try {
    const result = await Cloudinary.uploader.upload(req.file.path, {
      folder: 'profiles',
    });
    res.json({
      success: true,
      url: result.secure_url, 
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ success: false, error: 'Upload failed' });
  }
});


// Logout User
router.post('/logout', (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out successfully' });
});

router.post('/add', async (req, res) => {
  const { name, department, status, profilePicture,dateOfJoining, probationEndDate } = req.body;
  const newEmployee = new Employee({
    name,
    department,
    status,
    profilePicture,
    dateOfJoining,
    probationEndDate,
    createdBy: req.name,
  });

  try {
    await newEmployee.save();
    // Call webhook for new employee added
    // sendWebhookNotification('New Employee Added', newEmployee);

       // Add review reminder to Google Calendar
      //  await addEventToCalendar({
      //   summary: `Employee Review for ${newEmployee.name}`,
      //   description: `Review probation end for ${newEmployee.name}`,
      //   start: new Date(newEmployee.probationEndDate),
      //   end: new Date(new Date(newEmployee.probationEndDate).setHours(1)),
      //   attendees: [{ email: newEmployee.email }],
      // });
  

    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/employees', async (req, res) => {
  const { page = 1, limit = 10, search = '', department = '', status = '' } = req.query;

  try {
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' }; // Case-insensitive search by name
    if (department) query.department = department; // Filter by department
    if (status) query.status = status; // Filter by status

    const employees = await Employee.find(query)
      .skip((page - 1) * limit) // Skip for pagination
      .limit(Number(limit)); // Limit the number of results per page
    
    const totalCount = await Employee.countDocuments(query); // Get total count of employees for pagination

    res.status(200).json({ employees, totalCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// router.put('/edit/:id', [verifyToken, roleMiddleware('Admin')], async (req, res) => {
  router.put('/edit', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.body.id, req.body, { new: true });
    employee.modifiedBy = req.name;
    await employee.save();
    
    // Call webhook for employee status updated
    // sendWebhookNotification('Employee Status Updated', employee);
    
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete('/delete', async (req, res) => {
  // router.delete('/delete/:id', [verifyToken, roleMiddleware('Admin')], async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.body.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    
    // Call webhook for employee deleted
    // sendWebhookNotification('Employee Deleted', employee);
    
    res.status(200).json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const sendWebhookNotification = (event, employee) => {
  const payload = {
    event,
    employeeId: employee._id,
    employeeName: employee.name,
    timestamp: new Date(),
  };
  
  // Example Slack webhook integration
  axios.post(process.env.SLACK_WEBHOOK_URL, payload)
    .then(() => console.log(`Notification sent: ${event}`))
    .catch((err) => console.error('Webhook error:', err.message));
};



module.exports = router;
