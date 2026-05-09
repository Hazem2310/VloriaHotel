import express from "express";
import { getAllHalls, getHallById, createHall, updateHall, deleteHall } from "../controllers/hallsController.js";

const router = express.Router();

router.get("/", getAllHalls);
router.get("/:id", getHallById);
router.post("/", createHall);
router.put("/:id", updateHall);
router.delete("/:id", deleteHall);

export default router;
