import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { createConsumer } from "@rails/actioncable";
import "../src/styles/App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

// Custom components
import Menu from "./pages/Menu";
import NewCategoryFolder from "./pages/NewCategoryFolder";
import EditCategoryFolder from "./pages/EditCategoryFolder";
import NewCategory from "./pages/NewCategory";
import EditCategory from "./pages/EditCategory";
import NotFound from "./pages/NotFound";

// Store
import { useDispatch } from "react-redux";
import { fetchMenus } from "./store/slices/menuSlice";

// Constants
import { WEBSOCKET_URL } from "./constants";
import { ROUTES } from "./constants/routes";

// Hooks
import useUpdateMenus from "./hooks/useUpdateMenus";

const consumer = createConsumer(WEBSOCKET_URL);

function App() {
  // Hooks
  const dispatch = useDispatch();
  const { updateCategory, updateCategoryFolders } = useUpdateMenus();

  useEffect(() => {
    const controller = new AbortController();
    dispatch(
      fetchMenus({
        search: "",
        page: 1,
        signal: controller.signal,
      })
    );

    consumer.subscriptions.create("CategoryChannel", {
      received(data) {
        updateCategory(data);
      },
    });

    consumer.subscriptions.create("CategoryFolderChannel", {
      received(data) {
        updateCategoryFolders(data);
      },
    });

    return () => {
      controller.abort();
      consumer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path={ROUTES.menu} element={<Menu />} />
          <Route
            path={ROUTES.createCategoryFolder}
            element={<NewCategoryFolder />}
          />
          <Route
            path={`${ROUTES.editCategoryFolder}/:id`}
            element={<EditCategoryFolder />}
          />
          <Route path={ROUTES.createCategory} element={<NewCategory />} />
          <Route
            path={`${ROUTES.editCategory}/:id`}
            element={<EditCategory />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;
