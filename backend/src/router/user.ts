import { Router } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { JWT_USER_PASS } from "../config";

const prismaClient = new PrismaClient();

const userRouter = Router();


userRouter.post("/signup", async (req, res) => {
  const { username, password, name } = req.body; //zod to berify the schema

  try {
    await prismaClient.user.create({
      data: { username, password, name },
    });
   return res.json({ message: "signed up" });
  } catch (e) {
    return res.status(403).json({
      message: "Erorr while signing up",
    });
  }
});


userRouter.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const user = await prismaClient.user.findFirst({
    where: {
      username,
      password,
    },
  });
  if (!user) {
    return res.status(403).json({
      message: "unable to log you in",
    });
  }
  const token = jwt.sign(
    {
      id: user.id,
    },
    JWT_USER_PASS
  );
  return res.json({ token });
});


export { userRouter };