const User = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  console.log('Register request received')
  const { username, email, password } = req.body;

  try {

    // Check if user already exists
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(400).send({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    console.log('User Registered successfully')
    res.send({ message: 'User registered successfully' });
  }

  catch (error) {
    console.log(error)
    res.send({ error })
  }
};

const login = async (req, res) => {
  console.log('Login request received')
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send({ message: 'Invalid email or password' });
  }

  // Check if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(400).send({ message: 'Invalid email or password' });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, 'mysecretkey');

  console.log('Logged in successfully')
  res.send({ token });
};

const passwordreset = async (req, res) => {
  console.log('Password-Reset request received')

  const { email, oldPassword, newPassword } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send({ message: 'User not found' });
  }

  // Check if old password is correct
  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordCorrect) {
    console.log('old password incorrect')
    return res.status(400).send({ message: 'Invalid old password' });
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user's password
  user.password = hashedPassword;
  await user.save();

  console.log('Password reset successfully')
  res.send({ message: 'Password reset successfully' });
};

const nodemailer = require('nodemailer');


// POST route for the "Forgot Password" functionality
const forgot = async (req, res) => {
  console.log('Forgot password request received')
  const { email } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a unique verification code for password reset
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the verification code in the user's document in the database
    user.resetPasswordCode = verificationCode;
    user.resetPasswordCodeExpires = Date.now() + 600000; // Code expiration time (10 minutes)
    await user.save();

    require('dotenv').config();

    // Create a nodemailer transporter for sending emails
    const transporter = nodemailer.createTransport({
      // configure your email provider here
      service: 'gmail',
      auth: {
        user: process.env.SMTP,
        pass: process.env.CODE
      }
    });


    // Compose the email message
    const mailOptions = {
      from: 'your-email',
      to: email,
      subject: 'Password Reset Verification Code',
      text: `Please use the following verification code to reset your password: ${verificationCode}`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to send password reset verification code' });
      }
      console.log('Password reset verification code sent:', info.response);
      res.json({ message: 'Password reset verification code sent' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const forgotreset = async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;
  console.log('forgot reset request received')

  try {
    // Find the user by email and verification code
    const user = await User.findOne({
      email,
      resetPasswordCode: verificationCode,
      resetPasswordCodeExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Update the user's password
    user.password = newPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordCodeExpires = undefined;
    await user.save();

    console.log('Password changed suscessfully')
    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = { register, login, passwordreset, forgot, forgotreset };