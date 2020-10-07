const mongoose = require('mongoose')

const requestModel = mongoose.model('requests', mongoose.Schema({
    messageid: String,
    requestedid: String,
    roleid: String,
    requestedbyid: String,
    type: String
}))

module.exports = requestModel;

