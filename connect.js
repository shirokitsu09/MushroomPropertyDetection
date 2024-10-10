const mongoose = require('mongoose');

const connectDB = async (req, res, next) => {
    try {
        await mongoose.connect(
            'mongodb+srv://scoldevmongodemo:scoldevmongodemo@officescoldev.3hgugns.mongodb.net/mushroomMl?retryWrites=true&w=majority&appName=OfficeSCOLDEV',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log('DB connection established')
    } catch (err) {
        console.log(err);
    }
}

module.exports = connectDB