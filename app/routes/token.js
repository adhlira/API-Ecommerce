import bcrypt from "bcrypt";
import crypto from "crypto";
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { validateTokenRequest } from "../validator.js";

const router = Router();
const prisma = new PrismaClient();

router.post("/token", validateTokenRequest, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid email",
    });
  }

  const validPassword = bcrypt.compareSync(req.body.password, user.password);

  if (!validPassword) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }

  // generate a token that is not already exists in the database
  let token;
  do {
    token = crypto.randomBytes(64).toString("base64");
  } while (await prisma.token.findUnique({ where: { token } }));

  await prisma.token.create({
    data: {
      token,
      user_id: user.id,
      expires_at: new Date(Date.now() + 2592000000), // 30 days
    },
  });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
});

export default router;
