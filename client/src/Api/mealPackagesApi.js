import { get } from "./apiClient";

export const getAllMealPackages = () => get("/meal-packages");

export const getMealPackageById = (id) => get(`/meal-packages/${id}`);
