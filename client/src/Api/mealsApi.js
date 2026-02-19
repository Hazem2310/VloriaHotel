import { get, post, put, del } from "./apiClient";

export const getAllMeals = () => get("/meals");

export const getMealsByType = (type) => get(`/meals/type/${type}`);

export const getMealById = (id) => get(`/meals/${id}`);

export const createMeal = (mealData) => post("/meals", mealData);

export const updateMeal = (id, mealData) => put(`/meals/${id}`, mealData);

export const deleteMeal = (id) => del(`/meals/${id}`);
