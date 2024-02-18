import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { Permission } from "../authorization.js";
import { authToken, authorizePermission } from "../midllewares.js";

const prisma = new PrismaClient();
const router = Router();
router.use(authToken);

router.post("/cart", authorizePermission(Permission.ADD_CART), async (req, res) => {
  const { product_id, quantity } = req.body;
  if (!req.body.product_id || !req.body.quantity) {
    res.status(400).json({ message: "Incomplate data" });
  } else {
    const product = await prisma.product.findFirst({ where: { id: req.body.product_id } });
    const token = await prisma.token.findFirst({ where: { token: req.headers.authorization } });
    if (!product) {
      res.status(404).json({ message: "Product Not Found" });
    } else {
      const existing_product = await prisma.cart.findFirst({ where: { product_id: req.body.product_id } });
      if (existing_product) {
        const cart = await prisma.cart.update({ where: { id: existing_product.id }, data: { quantity: existing_product.quantity + req.body.quantity, total: product.price * (existing_product.quantity + req.body.quantity) } });
        res.status(200).json({ message: "Product added to cart", cart });
      } else {
        const user_id = token.user_id;
        const total = quantity * product.price;
        const cart = await prisma.cart.create({
          data: {
            product_id,
            quantity,
            total,
            user_id,
          },
        });
        res.status(200).json({ message: "Product added to cart", cart });
      }
    }
  }
});

router.get("/cart", authorizePermission(Permission.BROWSE_CART), async (req, res) => {
  const token = await prisma.token.findFirst({ where: { token: req.headers.authorization } });
  const user_id = token.user_id;

  const cart = await prisma.cart.findMany({ where: { user_id: user_id } });
  if (cart.length === 0) {
    res.status(404).json({ message: "Cart is Empty" });
  } else {
    const total = cart.reduce((acc, item) => acc + item.total, 0);
    res.json({
      cart,
      total,
    });
  }
});

router.put("/cart/:id", authorizePermission(Permission.EDIT_CART), async (req, res) => {
  const token = await prisma.token.findFirst({ where: { token: req.headers.authorization } });
  const user_id = token.user_id;
  console.log(user_id);
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "Invalid Cart ID" });
  } else {
    const cart_id = await prisma.cart.findFirst({ where: { id: Number(req.params.id), user_id: user_id } });
    if (!cart_id) {
      res.status(404).json({ message: "Cart ID Not Found" });
    } else {
      const cart = await prisma.cart.update({ where: { id: Number(req.params.id) }, data: req.body });
      res.status(200).json({ message: "Cart updated", cart });
    }
  }
});

router.delete("/cart/:id", async (req, res) => {
  const token = await prisma.token.findFirst({ where: { token: req.headers.authorization } });
  const user_id = token.user_id;
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "Invalid Cart ID" });
  } else {
    const cart_id = await prisma.cart.findFirst({ where: { id: Number(req.params.id), user_id: user_id } });
    if (!cart_id) {
      res.status(404).json({ message: "Cart ID is Not Found" });
    } else {
      await prisma.cart.delete({ where: { id: Number(req.params.id) } });
      res.status(200).json({ message: "Product deleted from cart" });
    }
  }
});

export default router;
