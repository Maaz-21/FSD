import express from "express";
import { addProducts, getFoodById, getFoodItems } from "../controllers/Food.js";

const router = express.Router();  // Router object to define routes

router.post("/add", addProducts);   // Add new food item
router.get("/", getFoodItems);     // Get all food items   
router.get("/:id", getFoodById);  // Get food item by id  

export default router;
