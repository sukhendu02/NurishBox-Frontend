// src/store/productStore.js
import { create }        from "zustand";
import { getallItems } from "../api/menu.api";
import toast             from "react-hot-toast";
import useAddressStore from "../store/addressStrore.js"
const initialFilters = {
  category: "All Items",
  type:     "",           // "" | "VEG" | "NON-VEG"
  sortBy:   "",           // "" | "price_asc" | "price_desc" | "calories_asc" | "popular" | "newest"
  discounted: "",         // "" | "true"
};

const initialState = {
  products:       [],
  total:          0,
  page:           1,
  hasNext:        false,
  isLoading:      false,
  isFetchingMore: false,
  filters:        initialFilters,
  status:         null,
  canOrder:       false,
  message:        null,
  kitchen:        null,
}

export const useProductStore = create((set, get) => ({
  ...initialState,

  // ── Set one filter → reset to page 1 → fetch ─────────────────
  setFilter: async (key, value) => {
    const newFilters = { ...get().filters, [key]: value };
    set({ filters: newFilters, products: [], page: 1 });
    await get()._fetch(newFilters, 1, false);
  },

  // ── Initial load ──────────────────────────────────────────────
  fetchProducts: async () => {
    await get()._fetch(get().filters, 1, false);
  },

  // ── Infinite scroll — append ──────────────────────────────────
  loadMore: async () => {
    const { hasNext, isLoading, isFetchingMore, page, filters } = get();
    if (!hasNext || isLoading || isFetchingMore) return;
    await get()._fetch(filters, page + 1, true);
  },

  // ── Reset ─────────────────────────────────────────────────────
  resetFilters: async () => {
    set({ ...initialState });
    await get()._fetch(initialFilters, 1, false);
  },

  

  // ── Internal fetch ────────────────────────────────────────────
  _fetch: async (filters, page, append) => {

    set(append ? { isFetchingMore: true } : { isLoading: true });

    try {
const { selectedAddress } = useAddressStore.getState()

  
      
      // Build params — only send non-empty values
      const params = { page, limit: 12 };

          if (selectedAddress?.type === 'current_location' && selectedAddress?.coords) {
  params.lat = selectedAddress.coords.lat
  params.lng = selectedAddress.coords.lng
}

      if (filters.category && filters.category !== "All Items") {
        params.category = filters.category.toUpperCase().replace(" ", " ");
      }
      if (filters.type)   params.type   = filters.type;
      if (filters.sortBy) params.sortBy = filters.sortBy;

      if (filters.discounted) params.discounted = filters.discounted;
      
      const res  = await getallItems(params);
      // const { items }  = res.data; // ← your response: res.data.items
      // const { data, pagination } = items;

      const { data, pagination, status, canOrder, message, kitchen } = res.data
      

      set((state) => ({
  products:       append ? [...state.products, ...data] : data,
  total:          pagination.total,
  page:           pagination.page,
  hasNext:        pagination.hasNextPage,
  isLoading:      false,
  isFetchingMore: false,
  status,
  canOrder,
  message,
  kitchen,
}))

    } catch (err) {
      set({ isLoading: false, isFetchingMore: false });
      toast.error(err.message || "Failed to load products");
    }
  },
}));