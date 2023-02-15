const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const PostSchema = new Schema({
    author: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        required: true
    },
    signature: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', PostSchema);
