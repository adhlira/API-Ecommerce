import { PrismaClient } from "@prisma/client";
import { Router, query } from "express";
import { Permission } from "../authorization.js";
import { authToken, authorizePermission } from "../midllewares.js";

const prisma = new PrismaClient();
const router = Router();
router.use(authToken);

router.post("/products", authorizePermission(Permission.ADD_PRODUCTS), async (req, res) => {
  const { category_id, name, description, price } = req.body;

  if (!req.body.category_id || !req.body.name || !req.body.description || !req.body.price) {
    res.status(400).json({ message: "Incomplete data" });
  } else {
    const id = await prisma.category.findFirst({ where: { id: req.body.category_id } });
    if (!id) {
      res.status(404).json({ message: "Category Id not found" });
    } else {
      const product = await prisma.product.create({ data: { category_id, name, description, price } });
      res.status(200).json({ message: "Product created successfully", product });
    }
  }
});

router.get("/products/search", authorizePermission(Permission.BROWSE_PRODUCTS), async (req, res) => {
  const { query } = req.query;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const itemsPerPage = 3;
  const skip = (page - 1) * itemsPerPage;
  const products = await prisma.product.findMany({
    where: {
      OR: [{ name: { contains: query } }, { Category: { name: { contains: query } } }, { description: { contains: query } }],
    },
    orderBy: { name: "asc" },
    skip,
    take: itemsPerPage,
  });
  if (products.length === 0) {
    res.status(404).json({ message: "Product Not found" });
  } else {
    res.status(200).json(products);
  }
});

router.get("/products", authorizePermission(Permission.BROWSE_PRODUCTS), async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

router.get("/products/:id", authorizePermission(Permission.READ_PRODUCTS), async (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "Invalid product id" });
  } else {
    const product = await prisma.product.findFirst({ where: { id: Number(req.params.id) } });
    if (!product) {
      res.status(404).json({ message: "Product Not Found" });
    } else {
      const product = await prisma.product.findFirst({ where: { id: Number(req.params.id) } });
      res.status(200).json(product);
    }
  }
});

router.put("/products/:id", authorizePermission(Permission.EDIT_PRODUCTS), async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid Product Id" });
  } else {
    const product_id = await prisma.product.findFirst({ where: { id: id } });
    if (!product_id) {
      res.status(404).json({ message: "Product ID Not Found" });
    } else {
      const category_id = await prisma.category.findFirst({ where: { id: req.body.category_id } });
      if (!category_id) {
        res.status(400).json({ message: "Category ID not found" });
      } else {
        const product = await prisma.product.update({ where: { id: id }, data: req.body });
        res.status(200).json(product);
      }
    }
  }
});

router.delete("/products/:id", authorizePermission(Permission.DELETE_PRODUCTS), async (req, res) => {
  const id = Number(req.params.id);
  const product_id = await prisma.product.findFirst({ where: { id: id } });
  if (!product_id) {
    res.status(404).json({ message: "Product ID Not Found" });
  } else {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.status(200).json({ message: "Product has been deleted" });
  }
});

export default router;
