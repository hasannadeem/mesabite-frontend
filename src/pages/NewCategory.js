import React from "react";
import { useLocation } from "react-router-dom";

// Custom Components
import NewCategoryForm from "../components/Menu/NewCategoryForm";

const NewCategory = () => {
  const { state } = useLocation();

  return <NewCategoryForm categoryFolderId={state?.categoryFolderId} />;
};

export default NewCategory;
