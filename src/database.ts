import { PrismaClient } from "@prisma/client";

import dotenv from "dotenv"

dotenv.config()


declare global {
  var prisma: PrismaClient | undefined
}
export const prisma: PrismaClient = global.prisma || new PrismaClient()

global.prisma = prisma
