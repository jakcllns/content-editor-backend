const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
    },
    twoFactor: {
        type: Boolean,
        required: true,
        default: false
    }
}, 
{
    timestamps: {
        createdAt: true, 
        updatedAt: false
    }
});

module.exports = userSchema;