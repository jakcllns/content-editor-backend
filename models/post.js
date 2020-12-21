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
        type: String,
        required: true
    }
},{timestamps: true}
);

module.exports = mongoose.model('Post', postSchema);