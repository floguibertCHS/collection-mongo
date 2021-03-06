const mongoose = require('mongoose');

const coinsSchema = new mongoose.Schema({
    name: String,
    year: Number,
    location: [{
        city:String,
        state:String,
    }],
    color:Array
});

const Coin = mongoose.model('Coin', coinsSchema);

module.exports = Coin;