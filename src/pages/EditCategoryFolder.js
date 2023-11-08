import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Custom components
import NewCategoryFolderForm from "../components/Menu/NewCategoryFolderForm";

// Constants
import { APIS } from "../constants/routes";

const EditCategoryFolder = () => {
  const [categoryFolder, setCategoryFolder] = useState({});

  // Hooks
  let { id } = useParams();

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${APIS.categoryFolder}/${id}`, {
        signal: controller.signal,
      })
      .then((response) => setCategoryFolder(response.data.data))
      .catch(
        () =>
          !controller?.signal?.aborted &&
          toast.error("Unable to fetch category folder")
      );

    return () => controller.abort();
  }, [id]);

  return <NewCategoryFolderForm data={categoryFolder} isEditView={true} />;
};

export default EditCategoryFolder;
