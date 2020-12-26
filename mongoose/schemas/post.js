const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageUrls : [
        {
            type: String
        }
    ],
    content: [
        {
            type: String,
            require: true
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{timestamps: true}
);

module.exports = postSchema;