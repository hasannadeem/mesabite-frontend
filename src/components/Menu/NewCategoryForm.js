import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "../../styles/NewCategory.scss";

// Icons
import CloseIcon from "../../assets/images/close-icon.svg";
import UploadIcon from "../../assets/images/upload-icon.svg";

// Constants
import { APIS, ROUTES } from "../../constants/routes";
import { getImageUrl } from "../../utils";

const NewCategoryForm = ({ data, categoryFolderId, isEditView }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Hooks
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage([...e.target.files][0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreatingCategory(true);

    try {
      const formdata = new FormData();
      formdata.append("name", name);
      formdata.append("description", description);
      if (image instanceof File) {
        formdata.append("image", image);
      }
      categoryFolderId &&
        formdata.append("category_folder_id", categoryFolderId);

      const response = await axios({
        method: isEditView ? "PATCH" : "POST",
        url: isEditView ? `${APIS.category}/${data.id}` : APIS.category,
        data: formdata,
      });

      if (response.status === 200) {
        toast.success(
          isEditView
            ? "Category has been successfully updated"
            : "Category has been successfully added to your menu!"
        );
        navigate(ROUTES.menu);
      }
    } catch (error) {
      const defaultMessage = isEditView
        ? "Unable to update category"
        : "Unable to create category";
      const errorDetail = error?.response?.data?.errors?.length
        ? error?.response?.data?.errors[0]
        : {};
      const errorMessage =
        errorDetail?.title && `${errorDetail.title} ${errorDetail.detail}`;
      toast.error(errorMessage || defaultMessage);
    }

    setCreatingCategory(false);
  };

  const navigateBack = () => {
    navigate(ROUTES.menu);
  };

  useEffect(() => {
    if (data?.attributes) {
      setName(data.attributes.name);
      setDescription(data.attributes.description);
      setImage({ name: getImageUrl(data.attributes.image) });
    }
  }, [data]);

  return (
    <div className="new-category d-flex flex-column">
      <header className="d-flex justify-content-between">
        <h1 className="heading">
          {isEditView ? "Update Category" : "Add New Category"}
        </h1>
        <img
          src={CloseIcon}
          alt="close"
          width={20}
          height={20}
          onClick={navigateBack}
        />
      </header>

      <form
        className="d-flex flex-column flex-grow-1 mt-4"
        onSubmit={handleSubmit}
      >
        <div className="font-family-montserrat label">Image (Optional)</div>
        <label
          htmlFor="upload-photo"
          className="input-file d-flex flex-column align-items-center justify-content-center mt-1"
        >
          <img src={UploadIcon} alt="upload-img" width={58} height={58} />
          <div className="mt-4 font-family-montserrat image-name">
            {image?.name || "Click here to upload an image"}
          </div>
        </label>
        <input
          hidden
          type="file"
          id="upload-photo"
          accept=".jpg, .jpeg, .gif, .png"
          onChange={handleImageChange}
        />

        <label htmlFor="name" className="font-family-montserrat label mt-4">
          Name
        </label>
        <input
          required
          type="text"
          name="name"
          value={name}
          maxLength={50}
          onChange={(e) => setName(e.target.value)}
          className="default-input-field font-family-montserrat mt-1"
        />
        <div className="name-characters-count font-family-montserrat text-end mt-1">
          {name.length}/50
        </div>

        <label
          htmlFor="description"
          className="font-family-montserrat label mt-4"
        >
          Description (Optional)
        </label>
        <textarea
          name="description"
          rows="5"
          value={description}
          className="textarea font-family-montserrat mt-1"
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="d-flex align-items-center justify-content-center gap-3 button-group mt-auto">
          <button
            className="button cancel-button"
            disabled={creatingCategory}
            type="button"
            onClick={navigateBack}
          >
            Cancel
          </button>
          <button
            className="button save-button"
            disabled={creatingCategory}
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewCategoryForm;
