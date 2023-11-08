import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Custom components
import CategoryCard from "./CategoryCard";

// Icons
import MenuIcon from "../../assets/images/menu-icon.svg";
import EditIcon from "../../assets/images/edit-icon-red-filled.svg";
import DeleteIcon from "../../assets/images/delete-icon-red-filled.svg";
import PlusIcon from "../../assets/images/plus-outline-white.svg";

// Constants
import { APIS, ROUTES } from "../../constants/routes";

const CategoryFolder = ({ className, menu, updateMenus }) => {
  // Hooks
  const navigate = useNavigate();

  const handleDeleteCategoryFolder = async () => {
    const isConfirmed = window.confirm(
      "Do you really want to delete this category folder?"
    );

    if (isConfirmed) {
      try {
        const response = await axios.delete(
          `${APIS.categoryFolder}/${menu.id}`
        );

        if (response.status === 200) {
          updateMenus();
          toast.success("Category folder has been successfully deleted!");
        }
      } catch (error) {
        const errorDetail = error?.response?.data?.errors?.length
          ? error?.response?.data?.errors[0]
          : {};
        toast.error(errorDetail.detail || "Unable to delete Category folder");
      }
    }
  };

  return (
    <div
      className={`d-flex flex-column gap-3 category-folder px-2 py-3 ${
        className || ""
      }`}
    >
      <div className="d-flex align-items-center justify-content-between">
        <span className="d-inline-flex align-items-center gap-2">
          <img src={MenuIcon} alt="menu" width={19} height={10} />
          <h5 className="name font-family-roboto"> {menu.attributes.name} </h5>
        </span>
        <span className="d-inline-flex align-items-center gap-2">
          <img
            src={PlusIcon}
            alt="delete"
            width={28}
            height={28}
            onClick={() =>
              navigate(ROUTES.createCategory, {
                state: { categoryFolderId: menu.id },
              })
            }
          />
          <img
            src={EditIcon}
            alt="edit"
            width={28}
            height={28}
            onClick={() => navigate(`${ROUTES.editCategoryFolder}/${menu.id}`)}
          />
          <img
            src={DeleteIcon}
            alt="delete"
            width={28}
            height={28}
            onClick={handleDeleteCategoryFolder}
          />
        </span>
      </div>

      {menu.attributes.categories.data.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          updateMenus={updateMenus}
        />
      ))}
    </div>
  );
};

export default CategoryFolder;
