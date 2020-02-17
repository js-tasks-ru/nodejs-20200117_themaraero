const uuid = require("uuid/v4");
const User = require("../models/User");
const sendMail = require("../libs/sendMail");

module.exports.register = async (ctx, next) => {
  const verificationToken = uuid();
  const user = new User({
    email: ctx.request.body.email,
    displayName: ctx.request.body.displayName,
    verificationToken
  });

  await user.setPassword(ctx.request.body.password);
  await user.save();

  sendMail({
    template: "confirmation",
    locals: { token: verificationToken },
    to: user.email,
    subject: "Подтвердите почту"
  });

  ctx.body = { status: "ok" };
};

module.exports.confirm = async (ctx, next) => {
  const user = await User.findOne({
    verificationToken: ctx.request.body.verificationToken
  });

  if (!user) {
    ctx.throw(400, "Ссылка подтверждения недействительна или устарела");
  }

  user.verificationToken = undefined;
  await user.save();

  const token = uuid();

  ctx.body = { token };
};
