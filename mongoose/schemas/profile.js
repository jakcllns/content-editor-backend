const mongoose = require('mongoose');
const { Schema } = mongoose;

const profileSchema = new Schema ({
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        index: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    totalPosts: {
        type: Number,
        required: true,
        default: 0
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
},
{
    timestamps: {
        createdAt: true,
        updatedAt: false
    },
    autoIndex: false
});

module.exports = profileSchema;
