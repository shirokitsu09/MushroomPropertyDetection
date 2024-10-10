const mongoose = require('mongoose');

const connectDB = async (req, res, next) => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/examples');
        console.log('DB connection established')
    } catch (err) {
        console.log(err);
    }
}

module.exports = connectDB