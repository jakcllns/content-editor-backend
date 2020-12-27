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
        ref: 'Profile'
    }
},{
    timestamps: true,
    autoIndex: false
}
);

module.exports = postSchema;