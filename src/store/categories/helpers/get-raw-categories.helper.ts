import { CategoryModel } from 'shared-types';

export const getRawCategories = (
  categories: CategoryModel[],
): CategoryModel[] => {
  const subs = [];
  categories.forEach(category => {
    if (category.subCategories?.length) {
      subs.push(...getRawCategories(category.subCategories));
    }
    subs.push({ ...category, subCategories: [] });
  });

  return subs;
};
