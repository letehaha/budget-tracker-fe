export const getRawCategories = (categories) => {
  const subs = [];
  categories.forEach(category => {
    if (category.subCategories?.length) {
      subs.push(...getRawCategories(category.subCategories));
    }
    subs.push({ ...category, subCategories: [] });
  });
  return subs;
};
