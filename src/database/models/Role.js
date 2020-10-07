const mongoose = require('mongoose')

const roleModel = mongoose.model('roles', mongoose.Schema({
    roleid: String,
    allowed: Array,
    rolename: String
}))

module.exports = roleModel;

