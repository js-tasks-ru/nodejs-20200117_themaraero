const ProductModel = require('../models/Product');
const productMapper = require('../mappers/productMapper');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const query = ctx.query.query;

  const products = await ProductModel.find(
      {$text: {$search: query}},
      {score: {$meta: 'textScore'}}).sort({score: {$meta: 'textScore'}}
  );

  ctx.body = {products: products.map(productMapper)};
};
