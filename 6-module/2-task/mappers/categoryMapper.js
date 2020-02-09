module.exports = function categoryMapper(category) {
  const result = {
    id: category['_id'],
    title: category.title,
  };

  if (category.subcategories) {
    const subcategory = category.subcategories;
    result.subcategories = subcategory.map(categoryMapper);
  }

  return result;
};
