import bcrypt from "bcrypt";  // for hashing password
import jwt from "jsonwebtoken";  // for generating token
import dotenv from "dotenv";    // for environment variables
import { createError } from "../error.js";  // for error handling
import User from "../models/User.js";
import Orders from "../models/Orders.js";

dotenv.config();   // Load environment variables from .env file

// Auth

export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;

    //Check for existing user
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return next(createError(409, "Email is already in use."));
    }

    const salt = bcrypt.genSaltSync(10);         // Generate a salt for hashing the password
    const hashedPassword = bcrypt.hashSync(password, salt);  

    const user = new User({    // Create a new user object
      name,
      email,
      password: hashedPassword,
      img,
    });
    const createdUser = await user.save();         // Save the user to the database
    const token = jwt.sign({ id: createdUser._id }, process.env.JWT, {       // Generate a token for the user; createdUser._id is the user's id and process.env.JWT is the secret key
      expiresIn: "9999 years", 
    });
    return res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
};

export const UserLogin = async (req, res, next) => {    // Login user
  try {
    const { email, password } = req.body;

    //Check for existing user
    const user = await User.findOne({ email: email }).exec();    
    if (!user) {
      return next(createError(409, "User not found."));
    }

    const isPasswordCorrect = await bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT, {     
      expiresIn: "9999 years",
    });
    return res.status(200).json({ token, user });
  } catch (err) {
    next(err);
  }
};

//Cart

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userJWT = req.user;                          // Get the user from the JWT
    const user = await User.findById(userJWT.id);     // Find the user in the database
    const existingCartItemIndex = user.cart.findIndex((item) =>    // Check if the product is already in the cart
      item.product.equals(productId)
    );
    if (existingCartItemIndex !== -1) {
      // Product is already in the cart, update the quantity
      user.cart[existingCartItemIndex].quantity += quantity;
    } else {
      // Product is not in the cart, add it
      user.cart.push({ product: productId, quantity });
    }
    await user.save();   // Save the user to the database after updating the cart
    return res
      .status(200)
      .json({ message: "Product added to cart successfully", user });
  } catch (err) {
    next(err);
  }
};

export const removeFromCart = async (req, res, next) => {    // Remove a product from the cart
  try {
    const { productId, quantity } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const productIndex = user.cart.findIndex((item) =>
      item.product.equals(productId)
    );
    if (productIndex !== -1) {                // Check if the product is in the cart
      if (quantity && quantity > 0) {     // If a quantity is specified, update the quantity of the product in the cart
        user.cart[productIndex].quantity -= quantity;   
        if (user.cart[productIndex].quantity <= 0) {       // If the quantity is less than or equal to 0, remove the product from the cart
          user.cart.splice(productIndex, 1); // Remove the product from the cart
        }
      } else {
        user.cart.splice(productIndex, 1);    // Remove the product from the cart entirely, if no quantity is specified
      }

      await user.save();

      return res
        .status(200)
        .json({ message: "Product quantity updated in cart", user });
    } else {
      return next(createError(404, "Product not found in the user's cart"));
    }
  } catch (err) {
    next(err);
  }
};

export const getAllCartItems = async (req, res, next) => {
  try {
    const userJWT = req.user;
    const user = await User.findById(userJWT.id).populate({      // Get the user from the JWT and populate the cart with product details
      path: "cart.product",
      model: "Food",
    });
    const cartItems = user.cart;
    return res.status(200).json(cartItems);
  } catch (err) {
    next(err);
  }
};

//Orders

export const placeOrder = async (req, res, next) => {
  try {
    const { products, address, totalAmount } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);

    const order = new Orders({
      products,
      user: user._id,
      total_amount: totalAmount,
      address,
    });

    await order.save();
    user.cart = [];
    await user.save();
    return res
      .status(200)
      .json({ message: "Order placed successfully", order });
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    if (!user.favourites.includes(productId)) {
      user.favourites.push(productId);
      await user.save();
    }
    return res
      .status(200)
      .json({ message: "Product added to favorites successfully", user });
  } catch (err) {
    next(err);
  }
};

//Favorites

export const removeFromFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    user.favourites = user.favourites.filter((fav) => !fav.equals(productId));
    await user.save();

    return res
      .status(200)
      .json({ message: "Product removed from favorites successfully", user });
  } catch (err) {
    next(err);
  }
};

export const addToFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);

    if (!user.favourites.includes(productId)) {
      user.favourites.push(productId);
      await user.save();
    }

    return res
      .status(200)
      .json({ message: "Product added to favorites successfully", user });
  } catch (err) {
    next(err);
  }
};

export const getUserFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("favourites").exec();
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const favoriteProducts = user.favourites;
    return res.status(200).json(favoriteProducts);
  } catch (err) {
    next(err);
  }
};
