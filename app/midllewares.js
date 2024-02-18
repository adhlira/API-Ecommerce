import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Token is required",
    });
  }

  const validToken = await prisma.token.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role_id: true,
        },
      },
    },
  });

  if (!validToken) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  if (validToken.expires_at < new Date()) {
    return res.status(401).json({
      message: "Expired token",
    });
  }

  req.user = validToken.user;

  next();
};

export const authorizePermission = (permission) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const permissionRecords = await prisma.permissionRole.findMany({
      where: { role_id: req.user.role_id },
      include: { permission: true },
    });

    const permissions = permissionRecords.map((record) => record.permission.name);

    if (!permissions.includes(permission)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
};
