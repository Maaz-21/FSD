import mongoose from "mongoose";
import Food from "../models/Food.js";

export const addProducts = async (req, res, next) => {  // Add multiple products
  try {
    const foodData = req.body;
    if (!Array.isArray(foodData)) {
      return next(
        createError(400, "Invalid request. Expected an array of foods.")
      );
    }
    let createdfoods = [];
    for (const foodInfo of foodData) {                  // Loop through each product
      const { name, desc, img, price, ingredients, category } = foodInfo;     // Extract product details
      const product = new Food({                           // Create a new product object
        name,
        desc,
        img,
        price,
        ingredients,
        category,
      });
      const createdFoods = await product.save();       // Save the product to the database
      createdfoods.push(createdFoods);                // Add the created product to the list of created products
    }
    return res
      .status(201)
      .json({ message: "Products added successfully", createdfoods });
  } catch (err) {
    next(err);
  }
};

export const getFoodItems = async (req, res, next) => {      // Get all products
  try {
    let { categories, minPrice, maxPrice, ingredients, search } = req.query; // Extract query parameters
    ingredients = ingredients?.split(",");                 // Split ingredients string into an array
    categories = categories?.split(",");

    const filter = {};    
    if (categories && Array.isArray(categories)) {      
      filter.category = { $in: categories }; // Match products in any of the specified categories
    }
    if (ingredients && Array.isArray(ingredients)) {
      filter.ingredients = { $in: ingredients }; // Match products in any of the specified ingredients
    }
    if (maxPrice || minPrice) {      
      filter["price.org"] = {};           // Filter products based on price range
      if (minPrice) {
        filter["price.org"]["$gte"] = parseFloat(minPrice);    // Match products with price greater than or equal to minPrice
      }
      if (maxPrice) {
        filter["price.org"]["$lte"] = parseFloat(maxPrice);   // Match products with price less than or equal to maxPrice
      }
    }
    if (search) {     // Search products based on title or description
      filter.$or = [    // Match products with title or description containing the search string
        { title: { $regex: new RegExp(search, "i") } }, // Case-insensitive title search
        { desc: { $regex: new RegExp(search, "i") } }, // Case-insensitive description search
      ];
    }
    const foodList = await Food.find(filter);

    return res.status(200).json(foodList);
  } catch (err) {
    next(err);
  }
};

export const getFoodById = async (req, res, next) => {   // Get a single product by ID
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return next(createError(400, "Invalid product ID"));
    }
    const food = await Food.findById(id);
    if (!food) {
      return next(createError(404, "Food not found"));
    }
    return res.status(200).json(food);
  } catch (err) {
    next(err);
  }
};
