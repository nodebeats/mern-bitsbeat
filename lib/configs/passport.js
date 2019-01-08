const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
var bcrypttHelper = require('../helpers/bcrypt.helper');



//Local authentication mechanism using Passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {


    try {
        let collection = global.db.collection("User");
        let emailChk = await collection.findOne({ 'email': req.body.email });
        if (!emailChk) {
            return done(null, false, { message: 'Incorrect email.' });
        }

        let result = await bcrypttHelper.comparePwd(req.body.password, emailChk.password);
        if (result == true) {

            return done(null, emailChk);
        } else {
            return done(null, false, { message: 'Incorrect password.' });

        }


    } catch (error) {
        return done(error);


    }

}

));




