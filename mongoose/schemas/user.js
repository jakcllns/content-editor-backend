const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
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
    },
    posts: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    totalPosts: {
        type: Number,
        required: true,
        default: 0
    }
}, 
{
    timestamps: {
        createdAt: true, 
        updatedAt: false
    }
});

module.exports = userSchema;