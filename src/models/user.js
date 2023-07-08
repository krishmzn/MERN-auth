const mongoose = require('mongoose');


// Connect to MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true })
.then( () => console.log('conection is suscessful...'))
.catch( (err) => console.log(err));


// Define User schema
const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verificationCode: {
      type: String,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordCode: String,
    resetPasswordCodeExpires: Date
});

const User = mongoose.model('User', UserSchema);

module.exports = User;