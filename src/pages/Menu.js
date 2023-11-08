import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";
import { debounce } from "lodash";
import "../styles/Menu.scss";

// Custom components
import CategoryCard from "../components/Menu/CategoryCard";
import CategoryFolder from "../components/Menu/CategoryFolder";
import Layout from "../components/Layout";

// Icons
import PlusOutline from "../assets/images/plus-outline.svg";
import PlusIcon from "../assets/images/plus-outline-lg.svg";
import SearchIcon from "../assets/images/search-icon.svg";

// Store
import { useDispatch, useSelector } from "react-redux";
import { fetchMenus, selectMenus } from "../store/slices/menuSlice";

// Constants
import { ROUTES } from "../constants/routes";

const Menu = () => {
  const [activePage, setActivePage] = useState(1);
  const [search, setSearch] = useState("");
  const [triggerUpdateMenus, setTriggerUpdateMenus] = useState(Date.now());

  // Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: menus, totalPages } = useSelector(selectMenus);

  // Vars
  const paginationItems = Array.from({ length: totalPages }, (_, i) => i + 1);

  const debouncedSearch = useCallback(
    debounce(
      (query) =>
        dispatch(
          fetchMenus({
            search: query,
            page: 1,
          })
        ),
      500
    ),
    [fetchMenus]
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setActivePage(1);
    debouncedSearch(e.target.value);
  };

  const handleUpdateMenus = () => {
    setActivePage(1);
    setTriggerUpdateMenus(Date.now);
  };

  useEffect(() => {
    const controller = new AbortController();
    window.scrollTo(0, 0);
    dispatch(
      fetchMenus({
        search,
        page: activePage,
        signal: controller.signal,
      })
    );

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage, fetchMenus, triggerUpdateMenus]);

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

        <button
          className="d-flex align-items-center create-category-folder-button"
          onClick={() => navigate(ROUTES.createCategoryFolder)}
        >
          <img src={PlusOutline} height={15} width={15} alt="create-category" />
          <span className="ms-2 font-family-roboto fw-semi-bold">
            Create Category Folder
          </span>
        </button>

        {menus.map((menu) =>
          menu.type === "category_folder" ? (
            <CategoryFolder
              key={menu.id}
              className="mt-3"
              menu={menu}
              updateMenus={handleUpdateMenus}
            />
          ) : (
            <CategoryCard
              key={menu.id}
              className="w-94 mt-3"
              category={menu}
              updateMenus={handleUpdateMenus}
            />
          )
        )}

        <div
          className="d-flex flex-column align-items-center justify-content-center gap-3 new-category-button mt-3"
          onClick={() => navigate(ROUTES.createCategory)}
        >
          <img src={PlusIcon} alt="upload-img" width={78} height={78} />
          <div className="mt-4 font-family-montserrat text-center">
            Add new category to your menu
          </div>
        </div>
      </div>
      <div className="custom-pagination">
        {paginationItems.length > 1 ? (
          <Pagination size="sm" className="d-flex justify-content-center pb-3">
            {paginationItems.map((item) => (
              <Pagination.Item
                key={item}
                active={item === activePage}
                onClick={() => setActivePage(item)}
              >
                {item}
              </Pagination.Item>
            ))}
          </Pagination>
        ) : null}
      </div>
    </Layout>
  );
};

export default Menu;
