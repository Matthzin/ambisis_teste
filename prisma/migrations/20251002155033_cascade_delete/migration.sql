-- DropForeignKey
ALTER TABLE `licenca` DROP FOREIGN KEY `licenca_empresa_id_fkey`;

-- AddForeignKey
ALTER TABLE `licenca` ADD CONSTRAINT `licenca_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
