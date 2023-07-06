const mongoose = require('mongoose');


// Connect to MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true })
.then( () => console.log('conection is suscessful...'))
.catch( (err) => console.log(err));


// Define User schema
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});
const User = mongoose.model('User', UserSchema);

module.exports = User;