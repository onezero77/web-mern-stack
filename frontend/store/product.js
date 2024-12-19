import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  setProduct: (products) => {
    set({ products });
  },
  createProduct: async (newProduct) => {
    if (
      !newProduct ||
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.image
    ) {
      return { success: false, message: "Please provide all fields." };
    }
    try {
      const res = await fetch("api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      if (res.ok) {
        set((state) => ({
          products: [...state.products, data.data],
        }));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "Server error" };
    }
  },
  fetchProducts: async () => {
    try {
      const res = await fetch("api/products");
      const data = await res.json();
      if (res.ok) {
        set({ products: data.data });
      }
    } catch (error) {
      console.error(error);
    }
  },
  deleteProduct: async (id) => {
    const res = await fetch(`api/products/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };
    // update the UI immediately without needing to refresh
    set((state) => ({
      products: state.products.filter((product) => product._id !== id),
    }));
    return { success: true, message: data.message };
  },
  updateProduct: async (id, updatedProduct) => {
    try {
      const res = await fetch(`api/products/${id}`, {
        // Make sure the URL starts with /
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || "Failed to update product",
        };
      }

      if (!data.success) {
        return {
          success: false,
          message: data.message,
        };
      }

      // update the UI immediately without needing to refresh
      set((state) => ({
        products: state.products.map((product) =>
          product._id === id ? { ...product, ...updatedProduct } : product
        ),
      }));

      return {
        success: true,
        message: data.message || "Product updated successfully",
      };
    } catch (error) {
      console.error("Update product error:", error);
      return {
        success: false,
        message: "Failed to update product. Please try again.",
      };
    }
  },
}));
