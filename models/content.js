const mongoose = require('mongoose');
const {Schema} = mongoose;

const contentSchema = new Schema({
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

module.exports = mongoose.model('Content', contentSchema);