import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Icons
import SettingsIcon from "../../assets/images/settings-icon-white-filled.svg";
import EditIcon from "../../assets/images/edit-icon-white-filled.svg";
import DeleteIcon from "../../assets/images/delete-icon-white-filled.svg";

// Utils
import { getImageUrl } from "../../utils";

// Constants
import { APIS, ROUTES } from "../../constants/routes";
import { TEST_IDS } from "../../constants";

const CategoryCard = ({ className, category, updateMenus }) => {
  const navigate = useNavigate();

  const handleDeleteCategoryFolder = async () => {
    const isConfirmed = window.confirm(
      "Do you really want to delete this category?"
    );

    if (isConfirmed) {
      try {
        const response = await axios.delete(`${APIS.category}/${category.id}`);

        if (response.status === 200) {
          updateMenus();
          toast.success("Category has been successfully deleted!");
        }
      } catch (error) {
        const errorDetail = error?.response?.data?.errors?.length
          ? error?.response?.data?.errors[0]
          : {};
        toast.error(errorDetail.detail || "Unable to delete Category");
      }
    }
  };

  return (
    <div
      data-testid={`${category.id}-${TEST_IDS.CATEGORY_CARD_PARENT}`}
      style={{
        backgroundImage: `linear-gradient(180deg,rgba(0, 0, 0, 0) 0%,rgba(133, 46, 44, 0.97) 74.48%), url('${getImageUrl(
          category.attributes.image
        )}')`,
      }}
      className={`category-card d-flex flex-column justify-content-end p-2 pe-3 ${
        className || ""
      }`}
    >
      <div className="d-flex align-items-center justify-content-between">
        <span className="chip font-family-montserrat"> 5 items </span>
        <span className="d-inline-flex align-items-center gap-2">
          <img src={SettingsIcon} alt="settings" width={28} height={28} />
          <img
            src={EditIcon}
            alt="edit"
            width={28}
            height={28}
            onClick={() => navigate(`${ROUTES.editCategory}/${category.id}`)}
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
      <div className="font-family-montserrat name">
        {category.attributes.name}
      </div>
      <div className="font-family-montserrat description">
        {category.attributes.description}
      </div>
    </div>
  );
};

export default CategoryCard;
