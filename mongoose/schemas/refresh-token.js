const mongoose = require('mongoose');
const { Schema } = mongoose;

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true,
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

tokenSchema.indexes({createdAt: 1}, {expires: '60m'})
module.exports = tokenSchema;