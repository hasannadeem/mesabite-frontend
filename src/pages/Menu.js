import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";
import { debounce } from "lodash";
import "../styles/Menu.scss";

// Custom components
import CategoryCard from "../components/Menu/CategoryCard";
import CategoryFolder from "../components/Menu/CategoryFolder";
import Layout from "../components/Layout";
import Spinner from "../components/Layout/Spinner";

// Icons
import PlusOutline from "../assets/images/plus-outline.svg";
import PlusIcon from "../assets/images/plus-outline-lg.svg";
import SearchIcon from "../assets/images/search-icon.svg";

// Store
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMenus,
  selectMenus,
  setActivePage,
} from "../store/slices/menuSlice";

// Constants
import { ROUTES } from "../constants/routes";

const Menu = () => {
  const [search, setSearch] = useState("");

  // Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loading,
    data: menus,
    totalPages,
    activePage,
  } = useSelector(selectMenus);

  // Vars
  const paginationItems = Array.from({ length: totalPages }, (_, i) => i + 1);

  const debouncedSearch = useCallback(
    debounce((query) => {
      dispatch(setActivePage(1));
      dispatch(
        fetchMenus({
          search: query,
          page: 1,
        })
      );
    }, 500),
    [fetchMenus]
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handlePageChange = (page) => {
    dispatch(setActivePage(page));
    dispatch(
      fetchMenus({
        search,
        page,
      })
    );
    window.scrollTo(0, 0);
  };

  return (
    <Layout>
      <div className="menu-page-container">
        <h1 className="heading"> Your Menu </h1>

        <div className="my-3 search-input">
          <img src={SearchIcon} alt="search" />
          <input
            type="text"
            value={search}
            placeholder="Search Menu"
            onChange={handleSearch}
            className="default-input-field font-family-montserra"
          />
        </div>

        {activePage === 1 && (
          <button
            className="d-flex align-items-center create-category-folder-button"
            onClick={() => navigate(ROUTES.createCategoryFolder)}
          >
            <img
              src={PlusOutline}
              height={15}
              width={15}
              alt="create-category"
            />
            <span className="ms-2 font-family-roboto fw-semi-bold">
              Create Category Folder
            </span>
          </button>
        )}

        {menus.map((menu) =>
          menu.type === "category_folder" ? (
            <CategoryFolder key={menu.id} className="mt-3" menu={menu} />
          ) : (
            <CategoryCard key={menu.id} className="w-94 mt-3" category={menu} />
          )
        )}

        {activePage === 1 && (
          <div
            className="d-flex flex-column align-items-center justify-content-center gap-3 new-category-button mt-3"
            onClick={() => navigate(ROUTES.createCategory)}
          >
            <img src={PlusIcon} alt="upload-img" width={78} height={78} />
            <div className="mt-4 font-family-montserrat text-center">
              Add new category to your menu
            </div>
          </div>
        )}
      </div>

      <div className="custom-pagination">
        {paginationItems.length > 1 ? (
          <Pagination size="sm" className="d-flex justify-content-center pb-3">
            {paginationItems.map((item) => (
              <Pagination.Item
                key={item}
                active={item === activePage}
                onClick={() => handlePageChange(item)}
              >
                {item}
              </Pagination.Item>
            ))}
          </Pagination>
        ) : null}
      </div>

      {loading && <Spinner />}
    </Layout>
  );
};

export default Menu;
