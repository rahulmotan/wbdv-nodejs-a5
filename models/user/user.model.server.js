var mongoose = require('mongoose');
var userSchema = require('./user.schema.server');
var userModel = mongoose.model('UserModel', userSchema);

function updateUser(currentUser, user) {
    return userModel.updateOne({
        _id: currentUser._id
    }, {
        $set: {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            address: user.address,
            email: user.email
        }
    })

}

function findUserByCredentials(credentials) {
    return userModel.findOne(credentials, {username: 1});
}

function findUserById(userId) {
    return userModel.findById(userId);
}

function createUser(user) {
    return userModel.create(user);
}

function findAllUsers() {
    return userModel.find();
}

function validateUsername(username) {
    return userModel.find({username: username}).count();
}

function findUserByUsername(username) {
    return userModel.find({username: username});
}

var api = {
    createUser: createUser,
    findAllUsers: findAllUsers,
    findUserById: findUserById,
    findUserByCredentials: findUserByCredentials,
    validateUsername: validateUsername,
    updateUser: updateUser,
    findUserByUsername: findUserByUsername
};

module.exports = api;