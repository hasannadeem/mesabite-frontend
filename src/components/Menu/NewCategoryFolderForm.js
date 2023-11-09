import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../../styles/NewCategoryFolder.scss";

// Icons
import CloseIcon from "../../assets/images/close-icon.svg";
import UploadIcon from "../../assets/images/upload-icon.svg";

// Constants
import { APIS } from "../../constants/routes";
import { getImageUrl } from "../../utils";

const NewCategoryFolderForm = ({ data, isEditView }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [creatingCategoryFolder, setCreatingCategoryFolder] = useState(false);

  // Hooks
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage([...e.target.files][0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreatingCategoryFolder(true);

    try {
      const formdata = new FormData();
      formdata.append("name", name);
      if (image instanceof File) {
        formdata.append("image", image);
      }

      const response = await axios({
        method: isEditView ? "PATCH" : "POST",
        url: isEditView
          ? `${APIS.categoryFolder}/${data.id}`
          : APIS.categoryFolder,
        data: formdata,
      });

      if (response.status === 200) {
        toast.success(
          isEditView
            ? "Category Folder has been successfully updated"
            : "Category Folder has been successfully added to your menu!"
        );
        navigateBack();
      }
    } catch (error) {
      const defaultMessage = isEditView
        ? "Unable to update category folder"
        : "Unable to create category folder";
      const errorDetail = error?.response?.data?.errors?.length
        ? error?.response?.data?.errors[0]
        : {};
      const errorMessage =
        errorDetail?.title && `${errorDetail.title} ${errorDetail.detail}`;
      toast.error(errorMessage || defaultMessage);
    }

    setCreatingCategoryFolder(false);
  };

  const navigateBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (data?.attributes) {
      setName(data.attributes.name);
      setImage({ name: getImageUrl(data.attributes.image) });
    }
  }, [data]);

  return (
    <div className="new-category-folder d-flex flex-column">
      <header className="d-flex justify-content-between mb-3">
        <h1 className="heading">
          {isEditView ? "Update category folder" : "Create new category folder"}
        </h1>
        <img
          src={CloseIcon}
          alt="close"
          width={20}
          height={20}
          onClick={navigateBack}
        />
      </header>

      {!isEditView && (
        <div className="paragraph font-family-montserrat">
          Here you can create Category Folder that <br />
          <b>includes other categories under it. </b>
        </div>
      )}

      <form
        className="d-flex flex-column flex-grow-1 mt-2"
        onSubmit={handleSubmit}
      >
        <label htmlFor="name" className="font-family-montserrat label">
          Name
        </label>
        <input
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

        <div className="font-family-montserrat label mt-5">
          Image (Optional)
        </div>
        <label
          htmlFor="upload-photo"
          className="input-file d-flex flex-column align-items-center justify-content-center mt-1"
        >
          <img src={UploadIcon} alt="upload-img" width={80} height={80} />
          <div className="mt-4 font-family-montserrat image-name">
            {image?.name || "Click here to upload an image"}
          </div>
        </label>
        <input
          hidden
          type="file"
          id="upload-photo"
          accept=".jpg, .jpeg, .gif, .png, .svg"
          onChange={handleImageChange}
        />

        <div className="d-flex align-items-center justify-content-center gap-3 button-group mt-auto">
          <button
            className="button cancel-button"
            disabled={creatingCategoryFolder}
            type="button"
            onClick={navigateBack}
          >
            Cancel
          </button>
          <button
            className="button save-button"
            disabled={creatingCategoryFolder}
            type="submit"
          >
            {isEditView ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewCategoryFolderForm;
