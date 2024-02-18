import express from "express";
import categoriesRoute from "./app/routes/category.js";
import productRoute from "./app/routes/product.js";
import cartRoute from "./app/routes/cart.js";
import orderRoute from "./app/routes/order.js";
import tokenRoute from "./app/routes/token.js";
import userRoute from "./app/routes/user.js";

const app = express();

app.use(express.json());
app.use(tokenRoute);
app.use(userRoute);
app.use(categoriesRoute);
app.use(productRoute);
app.use(cartRoute);
app.use(orderRoute);

export default app;
