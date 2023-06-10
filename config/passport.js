const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const Users = require("../model/Users")
const bcrypt = require('bcryptjs')

const ConfigRegister = (passport) => {
    passport.use('register', new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, username, password, done) => {
            try {
                if (password !== req.body.confirmPassword) {
                    return done(null, false, { message: 'Passwords do not match.' });
                }

                if (password.length < 6) {
                    return done(null, false, { message: 'Password must be at least 6 characters long.' });
                }

                const existingUser = await Users.findOne({
                    $or: [{ username: username }, { email: req.body.email }]
                });

                if (existingUser) {

                    return done(null, false, { message: 'Username or email already exists.' });
                }
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = new Users({
                    username: username,
                    password: hashedPassword,
                    email: req.body.email
                });
                await newUser.save();
                return done(null, newUser);
            } catch (err) {
                return done(err);
            }
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        Users.findById(id)
            .exec()
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err);
            });
    })
};


const ConfigLogin = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
            Users.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        done(null, false, { msg: "There is no user like this" })
                    }
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Password incorrect' });
                        }
                    });
                })
        })
    )
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        Users.findById(id)
            .exec()
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err);
            });
    });;
}
module.exports = { ConfigRegister, ConfigLogin }