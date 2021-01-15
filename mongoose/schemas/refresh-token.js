const mongoose = require('mongoose');
const { Schema } = mongoose;

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true,
    },
    expiration: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, 
{
    timestamps: {
        createdAt: true, 
        updatedAt: true
    }
});

module.exports = tokenSchema;