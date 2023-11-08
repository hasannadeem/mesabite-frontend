import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Custom Components
import NewCategoryForm from "../components/Menu/NewCategoryForm";

// Constants
import { APIS } from "../constants/routes";

const EditCategory = () => {
  const [category, setCategory] = useState({});

  // Hooks
  let { id } = useParams();

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${APIS.category}/${id}`, {
        signal: controller.signal,
      })
      .then((response) => setCategory(response.data.data))
      .catch(
        () =>
          !controller?.signal?.aborted &&
          toast.error("Unable to fetch category")
      );

    return () => controller.abort();
  }, [id]);

  return <NewCategoryForm data={category} isEditView={true} />;
};

export default EditCategory;
