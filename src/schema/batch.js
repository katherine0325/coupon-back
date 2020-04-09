const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    fileName: String,
    status: String,
    summary: Object,
    errorDesc: String,
    createdAt: Date,
    createdBy: String,
})

module.exports = mongoose.model('batch', schema);
