const ProductModel = require('../models/Product');
const productMapper = require('../mappers/productMapper');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategoryId = ctx.request.query.subcategory;

  if (!subcategoryId) {
    return next();
  }

  const products = await ProductModel.find({subcategory: subcategoryId});

  ctx.body = {
    products: products.map(productMapper),
  };
};

module.exports.productList = async function productList(ctx, next) {
  const products = await ProductModel.find();

  ctx.body = {products: products.map(productMapper)};
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;

  const product = await ProductModel.findById(id);

  if (product) {
    ctx.body = {
      product: productMapper(product),
    };
  } else {
    ctx.throw(404, 'Product Not Found');
  }
};
