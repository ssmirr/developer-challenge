const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;


const UserSchema = new Schema({
    publicKey: {
        type: String,
        required: true
    },
    following: {
        type: [ObjectId],
        default: []
    },
    followers: {
        type: [ObjectId],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
