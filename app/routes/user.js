import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import { Router } from "express";
import { Permission } from "../authorization.js";
import { validateTokenRequest } from "../validator.js";
import { authToken, authorizePermission } from "../midllewares.js";

const prisma = new PrismaClient();
const bcryptRound = Number(process.env.BCRYPT_ROUND);
config();
const router = Router();

router.post("/users", validateTokenRequest, async (req, res) => {
  const role = 2;
  const { name, email, password } = req.body;

  const user = await prisma.user.create({
    data: {
      role_id: role,
      name: name,
      email: email,
      password: bcrypt.hashSync(password, bcryptRound),
    },
  });
  res.status(200).json({ message: "Data user successfully inserted", user });
});

router.use(authToken);

router.put("/users/:id", authorizePermission(Permission.EDIT_USERS), async (req, res) => {
  const user = await prisma.user.findFirst({ where: { id: Number(req.params.id) } });
  const token = await prisma.token.findFirst({ where: { token: req.headers.authorization } });

  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "Invalid ID" });
  } else {
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
    } else {
      if (token.user_id != Number(req.params.id)) {
        res.status(401).json({ message: "The User ID you entered is not yours" });
      } else {
        const updated_user = await prisma.user.update({ where: { id: Number(req.params.id) }, data: req.body });
        res.status(200).json({ message: "Data user updated", updated_user });
      }
    }
  }
});
export default router;
