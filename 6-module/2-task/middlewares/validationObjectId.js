const mongoose = require('mongoose');

module.exports = function validationObjectId(ctx, next) {
  const valid = mongoose.isValidObjectId(ctx.params.id);

  if (valid) {
    return next();
  }

  ctx.throw(400, 'Invalid ObjectId');
};
