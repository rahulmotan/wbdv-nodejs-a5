module.exports = function (app) {
    app.get('/api/user', findAllUsers);
    app.get('/api/user/:userId', findUserById);
    app.post('/api/user', createUser);
    app.get('/api/profile', profile);
    app.post('/api/logout', logout);
    app.post('/api/login', login);
    app.put('/api/user/update', update);
    app.get('/api/user/auth', authenticate);

    var userModel = require('../models/user/user.model.server');

    function authenticate(req, res) {
        var currentUser = req.session.currentUser;
        if (currentUser !== undefined) {
            res.json({username: currentUser.username});
        } else {
            res.json({username: ''});
        }
    }


    function update(req, res) {
        var user = req.body;
        var currentUser = req.session.currentUser;
        if (currentUser._id !== undefined) {
            userModel.updateUser(currentUser, user)
                .then(function (obj) {
                    if (obj.nModified > 0)
                        req.session['currentUser'] = user;
                    res.json(user);
                })
        }
    }

    function login(req, res) {
        var credentials = req.body;
        userModel
            .findUserByCredentials(credentials)
            .then(function (user) {
                if (user === null) {
                    res.send({errorMsg: "Sorry, you haven't made it into the gang yet. Let's get you hooked up."});
                } else {
                    req.session['currentUser'] = user;
                    res.json(user);
                }
            })
    }

    function logout(req, res) {
        req.session.destroy();
        res.send(200);
    }

    function findUserById(req, res) {
        var id = req.params['userId'];
        userModel.findUserById(id)
            .then(function (user) {
                res.json(user);
            })
    }

    function profile(req, res) {
        res.send(req.session['currentUser']);
    }

    function createUser(req, res) {
        var user = req.body;
        userModel.findUserByUsername(user.username)
            .then(function (response) {
                if (response === 0) {
                    userModel.createUser(user)
                        .then(function (user) {
                            req.session['currentUser'] = user._doc;
                            req.session.cookie._expires = new Date(Date.now() + (30 * 60 * 1000));
                            res.json(user._doc);
                        })
                } else {
                    res.send({message: "User Already Exists"});
                }
            });

    }

    function findAllUsers(req, res) {
        userModel.findAllUsers()
            .then(function (users) {
                res.send(users);
            })
    }
};
