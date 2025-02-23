import { Router } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { JWT_MERCHANT_PASS } from "../config";
const prismaClient = new PrismaClient();
export const merchantRouter = Router();

merchantRouter.post("/signup", async (req, res) => {
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
merchantRouter.post("/signin", async (req, res) => {
const {username,password}=req.body;
const merchant = await prismaClient.merchant.findFirst(
    {
        where:{
            username,
            password
        }
    }
)
if(!merchant)
{
    return res.status(403).json({
        message:"unable to log you in"
    })
}
const token = jwt.sign({
    id: merchant.id,

}, JWT_MERCHANT_PASS)
return res.json({token})
}
)