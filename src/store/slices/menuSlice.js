import { toast } from "react-toastify";
import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Constants
import { APIS } from "../../constants/routes";

const PAGE_SIZE = 5;

export const fetchMenus = createAsyncThunk(
  "menus/fetchMenus",
  async ({ search, page, signal }) => {
    try {
      const response = await axios.get(APIS.menusList, {
        params: {
          search_query: search || "",
          page,
          page_size: PAGE_SIZE,
        },
        signal,
      });

      if (response.status === 200) {
        return {
          menus: response.data?.data || [],
          totalPages: response.data.links.last,
        };
      }
    } catch (error) {
      if (signal?.aborted) return { aborted: true };

      toast.error("Unable to fetch Menus");
    }
  }
);

export const menusSlice = createSlice({
  name: "menus",
  initialState: {
    list: { loading: true, data: [], totalPages: 0, activePage: 1 },
  },
  reducers: {
    setMenus: (state, action) => {
      state.list.data = action.payload;
    },
    setActivePage: (state, action) => {
      state.list.activePage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenus.fulfilled, (state, action) => {
        if (action.payload?.aborted) return;

        state.list.loading = false;
        state.list.data = action.payload?.menus || [];
        state.list.totalPages = action.payload?.totalPages || 0;
      })
      .addCase(fetchMenus.pending, (state) => {
        state.list.loading = true;
      })
      .addCase(fetchMenus.rejected, (state) => {
        state.list.loading = false;
      });
  },
});

export const { setMenus, setActivePage } = menusSlice.actions;

export const selectMenus = (state) => state.menus.list;

export default menusSlice.reducer;
