const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/loginsignup")
    .then(() => console.log('MongoDB connected'))
    .catch((e) => console.log('Failed to connect to MongoDB:', e));

// Define schema
const logInSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
});

// Create and export model
const collection = mongoose.model('logincollections', logInSchema);
module.exports = collection;
