const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const token = uuid();

  try {
    let user = await User.findOne({email: ctx.request.body.email});

    if (user) {
      ctx.throw(400, 'Такой email уже существует');
    } else {
      user = new User({
        email: ctx.request.body.email,
        displayName: ctx.request.body.displayName,
        verificationToken: token,
      });
      await user.setPassword(ctx.request.body.password);
      await user.save({validateBeforeSave: true});

      await sendMail({
        template: 'confirmation',
        locals: {token},
        to: ctx.request.body.email,
        subject: 'Подтвердите почту',
      });

      ctx.body = {status: 'ok'};
    }
  } catch (err) {
    if (err.message === 'Такой email уже существует') {
      ctx.status = 400;
      ctx.body = {errors: {email: 'Такой email уже существует'}};
    } else {
      ctx.throw(500, 'Внутреняя ошибка');
    }
  }
};

module.exports.confirm = async (ctx, next) => {
  try {
    const user = await User.findOne({
      verificationToken: ctx.request.body.verificationToken,
    });

    if (user) {
      user.verificationToken = undefined;
      await user.save();
      const tokenSession = ctx.login(user);
      ctx.body = {token: tokenSession};
    } else {
      ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
    }
  } catch (err) {
    if (err.message === 'Ссылка подтверждения недействительна или устарела') {
      ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
    }

    ctx.throw(500, 'Внутренняя ошибка');
  }
};
