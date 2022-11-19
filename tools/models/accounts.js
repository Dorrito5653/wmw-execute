const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const AccountSchema = new mongoose.Schema({
    username: mongoose.Schema.Types.String,
    password: mongoose.Schema.Types.String,
    email: mongoose.Schema.Types.String,
    VIP: mongoose.Schema.Types.String,
    token: mongoose.Schema.Types.String,
    created_date: mongoose.Schema.Types.Date,
    updated_date: mongoose.Schema.Types.Date,
    xp: mongoose.Schema.Types.Number,
    level: mongoose.Schema.Types.Number,
    country: {
        name: mongoose.Schema.Types.String,
        territory: mongoose.Schema.Types.Number,
        // flag: mongoose.Schema.Types.Buffer,
        terrain: [{
            area: mongoose.Schema.Types.Number,
            type: mongoose.Schema.Types.String,
            //Items can be placed on these places manually when the game starts. 
        }]
    },
    resources: [{
        id: mongoose.Schema.Types.String,
        amount: mongoose.Schema.Types.Number
    }],
    commanders: [{
        id: mongoose.Schema.Types.String,
        level: mongoose.Schema.Types.Number,
        equipped: mongoose.Schema.Types.Boolean
    }],
    weapons: [{
        id: mongoose.Schema.Types.String,
        level: mongoose.Schema.Types.Number,
        amount: mongoose.Schema.Types.Number
    }],
    buildings: [{
        id: mongoose.Schema.Types.String,
        level: mongoose.Schema.Types.Number,
        amount: mongoose.Schema.Types.Number
    }],
    recruits: [{
        id: mongoose.Schema.Types.String,
        level: mongoose.Schema.Types.Number,
        amount: mongoose.Schema.Types.Number
    }],
    friends: [{
        username: mongoose.Schema.Types.String,
        xp: mongoose.Schema.Types.Number,
        level: mongoose.Schema.Types.Number,
    }]
})

AccountSchema.pre('save', async function(next){
    //Check if username already exists
    
    if (!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

module.exports = mongoose.model('accounts', AccountSchema)