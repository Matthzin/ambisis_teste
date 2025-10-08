/*
  Warnings:

  - You are about to alter the column `estado` on the `empresa` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(2)`.

*/
-- AlterTable
ALTER TABLE `empresa` MODIFY `estado` VARCHAR(2) NOT NULL;
