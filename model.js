const mongoose = require('mongoose');

const MushroomDataSchema = new mongoose.Schema({
    sciName: {
        type: String,
    },
    engName:  {
        type: String,
    },
    thName:  {
        type: String,
    },
    foundAt:  {
        type: String,
    },
    canEat:  {
        type: String,
    },
    reasonToNotEat:  {
        type: String,
    },
    preparation:  {
        type: String,
    },
    benefit:  {
        type: String,
    },
},{ timestamps: true }); 

const MushroomModel = mongoose.model('mushroomData', MushroomDataSchema);
module.exports = MushroomModel;