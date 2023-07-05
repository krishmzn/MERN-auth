const User = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    console.log('Register request received')
    const { username, email, password } = req.body;

    try {

        // Check if user already exists
        const userExists = await User.findOne({ email : email });
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
        res.send({error})
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

const passwordreset =  async (req, res) => {
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

module.exports = {register, login, passwordreset};