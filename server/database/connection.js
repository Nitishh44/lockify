const mongoose = require('mongoose'); // MongoDB se connect karne ke liye mongoose import kiya gaya hai

const connectDB = async() => {
    // Database connection ke liye async function banaya gaya hai
    try{
        // mongodb connection string
        const con = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
            // Environment file se MongoDB URI leke database connect kiya ja raha hai
        })

        console.log(`MongoDB connected: ${con.connection.host}`); // Database successfully connect hone par message print hota hai
    }catch(err){
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
        // Agar database connect nahi hota to server band kar diya jata hai
    }
}

module.exports = connectDB // connectDB function ko server.js ke liye export kiya gaya hai
