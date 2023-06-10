require('dotenv').config();
const express = require('express');
const app = express();

const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const connect = require("./db/connect")
const errorHandler = require("./middleware/errorHandler")
const notFound = require("./middleware/notFound")
const { ConfigRegister, ConfigLogin } = require("./config/passport")

ConfigRegister(passport)
ConfigLogin(passport)

const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api');
const mainRouter = require('./routes/main');

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(expressLayouts)

app.set("layout", "layouts/layout")
app.set("view engine", "ejs")

app.use('/logout', (req, res, next) => {
    console.log("app js")
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

app.use('/', authRouter);
app.use('/', mainRouter);
app.use('/api/v1', apiRouter);

app.use(errorHandler);
app.use(notFound);

const start = async () => {
    await connect(process.env.MONGO_URI)
    app.listen(process.env.PORT, () => {
        console.log(`Server is pm ${process.env.PORT}`)
    })
}
start()
