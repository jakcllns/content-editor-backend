const mongoose = require('mongoose');
const { Schema } = mongoose;

const profileSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
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

module.exports = profileSchema;
