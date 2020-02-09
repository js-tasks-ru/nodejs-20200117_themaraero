const CategoryModel = require('../models/Category');
const categoryMapper = require('../mappers/categoryMapper');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await CategoryModel.find();

  ctx.body = {categories: categories.map(categoryMapper)};
};
