import { BACKEND_URL } from ".";

export const ROUTES = {
  menu: "/",
  createCategoryFolder: "/create-folder",
  editCategoryFolder: "/edit-folder",
  createCategory: "/create-category",
  editCategory: "/edit-category",
};

export const APIS = {
  menusList: `${BACKEND_URL}/api/v1/menus`,
  category: `${BACKEND_URL}/api/v1/categories`,
  categoryFolder: `${BACKEND_URL}/api/v1/category_folders`,
};
