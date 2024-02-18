import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { Permission } from "../authorization.js";
import { authToken, authorizePermission } from "../midllewares.js";

const prisma = new PrismaClient();
const router = Router();
router.use(authToken);

router.post("/category", authorizePermission(Permission.ADD_CATEGORIES), async (req, res) => {
  const name = req.body;

  if (!req.body.name) {
    res.status(400).json({ message: "Name is required" });
  } else {
    const name_exist = await prisma.category.findFirst({ where: { name: req.body.name } });
    if (name_exist) {
      res.status(400).json({ message: "Name is already" });
    } else {
      const category = await prisma.category.create({ data: name });
      res.status(200).json({ message: "Category created successfully", category });
    }
  }
});

router.get("/category", authorizePermission(Permission.BROWSE_CATEGORIES), async (req, res) => {
  const category = await prisma.category.findMany();
  if (category.length === 0) {
    res.status(404).json({ message: "Category is Not Found" });
  } else {
    res.json(category);
  }
});

router.put("/category/:id", authorizePermission(Permission.EDIT_CATEGORIES), async (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "Invalid ID" });
  } else {
    const category_id = await prisma.category.findFirst({ where: { id: Number(req.params.id) } });
    if (!category_id) {
      res.status(404).json({ message: "Category not found" });
    } else {
      const category_exist = await prisma.category.findFirst({ where: { name: req.body.name } });
      if (category_exist) {
        res.status(400).json({ message: "Category Name is already" });
      } else {
        const category_updated = await prisma.category.update({
          where: { id: Number(req.params.id) },
          data: req.body,
        });
        res.json({ message: "Category has been updated", category_updated });
      }
    }
  }
});

router.delete("/category/:id", authorizePermission(Permission.DELETE_CATEGORIES), async (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "Invalid ID" });
  } else {
    const category_id = await prisma.category.findFirst({ where: { id: Number(req.params.id) } });
    if (!category_id) {
      res.status(404).json({ message: "Category not found" });
    } else {
      await prisma.category.delete({
        where: { id: Number(req.params.id) },
      });
      res.json({ message: "Category has been deleted" });
    }
  }
});

export default router;
