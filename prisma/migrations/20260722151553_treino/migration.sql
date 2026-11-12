/*
  Warnings:

  - You are about to drop the column `user_id` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Tarefas` table. All the data in the column will be lost.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STAFF', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Tarefas" DROP CONSTRAINT "Tarefas_user_id_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "Tarefas" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'STAFF';
