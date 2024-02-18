import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { Permission } from "../authorization.js";
import { authToken, authorizePermission } from "../midllewares.js";

const prisma = new PrismaClient();
const router = Router();
router.use(authToken);

router.post("/orders", authorizePermission(Permission.ADD_ORDERS), async (req, res) => {
  const token = await prisma.token.findFirst({ where: { token: req.headers.authorization } });
  const user_id = token.user_id;

  const cart = await prisma.cart.findMany({ where: { user_id: user_id } });
  const products = await prisma.cart.findMany({ where: { user_id: user_id }, include: { product: true } });

  const total = cart.reduce((acc, item) => acc + item.total, 0);
  if (cart.length === 0) {
    res.status(404).json({ message: "Cart is empty" });
  } else {
    const order = await prisma.order.create({
      data: {
        date: new Date(),
        order_number: `ORD/${Math.floor(Math.random() * 1000)}`,
        total: total,
        user_id: user_id,
      },
    });
    await prisma.order_Item.createMany({
      data: products.map((product) => {
        return {
          order_id: order.id,
          product_id: product.product_id,
          quantity: product.quantity,
          price: product.product.price,
          total: product.total,
        };
      }),
    });
    res.status(200).json({ message: "Order successfully created", order });
    await prisma.cart.deleteMany({ where: { user_id: user_id } });
  }
});

router.get("/orders", authorizePermission(Permission.READ_ORDERS), async (req, res) => {
  const token = await prisma.token.findFirst({ where: { token: req.headers.authorization } });
  const user_id = token.user_id;
  const order = await prisma.order.findMany({ where: { user_id: user_id } });
  if (order.length === 0) {
    res.status(404).json({ message: "Order is Empty" });
  } else {
    res.json(order);
  }
});

router.get("/admin/orders", authorizePermission(Permission.BROWSE_ORDERS), async (req, res) => {
  const order = await prisma.order.findMany();
  if (order.length === 0) {
    res.status(404).json({ message: "Order is Empty" });
  } else {
    res.json(order);
  }
});

router.post("/orders/pay", async (req, res) => {
  const { amount, cardNumber, cvv, expiryMonth, expiryYear } = req.body;
  const token = await prisma.token.findFirst({ where: { token: req.headers.authorization } });
  const order = await prisma.order.findFirst({ where: { user_id: token.user_id } });
  const order_id = order.id;
  if (!order) {
    res.status(404).json({ message: "Order Not Found" });
  } else {
    if (order.status != "Waiting for Paid") {
      res.status(400).json({ message: "Order is already Paid" });
    } else {
      if (amount != order.total) {
        res.status(400).json({ message: "Amount is false" });
      } else {
        try {
          const response = await fetch("http://localhost:3100/pay", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              amount,
              cardNumber,
              cvv,
              expiryMonth,
              expiryYear,
            }),
          });
          if (response.status === 200) {
            await prisma.order.update({ where: { id: order_id }, data: { status: "PAID" } });
            const new_order = await prisma.order.findUnique({ where: { id: order_id } });
            res.json({ message: "Payment Successfull", new_order });
          } else {
            res.json({ message: "Payment Failed" });
          }
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }
    }
  }
});
export default router;
