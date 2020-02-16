const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {session: false, usernameField: 'email'},
    async function(email, password, done) {
      try {
        const user = await User.findOne({email});

        if (!user) return done(null, false, 'Нет такого пользователя');

        const isPasswordCorrect = await user.checkPassword(password);

        if (isPasswordCorrect) {
          return done(null, user);
        }

        return done(null, false, 'Неверный пароль');
      } catch (err) {
        done(err);
      }
    }
);
