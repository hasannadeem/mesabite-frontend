import { useRef } from "react";

// Store
import { useDispatch, useSelector } from "react-redux";
import { selectMenus, setMenus } from "../store/slices/menuSlice";

const useUpdateMenus = () => {
  // Hooks
  const dispatch = useDispatch();
  const { data: menus } = useSelector(selectMenus);
  const menusRef = useRef([]);

  // Vars
  menusRef.current = menus;

  const updateCategory = ({ action, category }) => {
    if (action === "create") {
      let updatedMenus = [];

      if (category.data.attributes.category_folder_id) {
        updatedMenus = menusRef.current.map((menu) =>
          menu.id == category.data.attributes.category_folder_id
            ? {
                ...menu,
                attributes: {
                  ...menu.attributes,
                  categories: {
                    data: [
                      ...(menu.attributes.categories?.data || []),
                      category.data,
                    ],
                  },
                },
              }
            : menu
        );
      } else {
        updatedMenus = [category.data, ...menusRef.current];
      }

      dispatch(setMenus(updatedMenus));
      return;
    }

    if (action === "update") {
      const updatedMenus = menusRef.current.map((menu) => {
        if (menu.id == category.data.id && menu.type === "category") {
          return category.data;
        }

        if (menu.type === "category_folder") {
          return {
            ...menu,
            attributes: {
              ...menu.attributes,
              categories: {
                data: menu.attributes.categories?.data?.map((item) =>
                  item.id == category.data.id ? category.data : item
                ),
              },
            },
          };
        }

        return menu;
      });

      dispatch(setMenus(updatedMenus));
      return;
    }

    if (action === "delete") {
      let updatedMenus = JSON.parse(JSON.stringify(menusRef.current));
      updatedMenus = updatedMenus.filter((menu) => {
        if (menu.id == category.id) {
          return false;
        }

        if (menu.type === "category_folder") {
          menu.attributes.categories.data =
            menu.attributes.categories?.data?.filter(
              (item) => item.id != category.id
            );
        }
        return true;
      });

      dispatch(setMenus(updatedMenus));
      return;
    }
  };

  const updateCategoryFolders = ({ action, category_folder }) => {
    if (action === "create") {
      dispatch(setMenus([category_folder.data, ...menusRef.current]));
      return;
    }

    if (action === "update") {
      const updatedMenus = menusRef.current.map((menu) =>
        menu.id == category_folder.data.id
          ? {
              ...menu,
              attributes: {
                ...menu.attributes,
                name: category_folder.data.attributes.name,
                image: category_folder.data.attributes.image,
              },
            }
          : menu
      );

      dispatch(setMenus(updatedMenus));
      return;
    }

    if (action === "delete") {
      const updatedMenus = menusRef.current
        .map((menu) => {
          if (menu.id == category_folder.id) {
            if (menu.attributes.categories?.data?.length)
              return menu.attributes.categories.data;

            return null;
          }

          return menu;
        })
        .filter((menu) => menu)
        .flat();

      dispatch(setMenus(updatedMenus));
      return;
    }
  };

  return { updateCategory, updateCategoryFolders };
};

export default useUpdateMenus;
