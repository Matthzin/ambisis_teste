-- CreateTable
CREATE TABLE `empresa` (
    `id` VARCHAR(191) NOT NULL,
    `razao_social` VARCHAR(255) NOT NULL,
    `cnpj` CHAR(14) NOT NULL,
    `cep` CHAR(8) NOT NULL,
    `cidade` VARCHAR(255) NOT NULL,
    `estado` VARCHAR(255) NOT NULL,
    `bairro` VARCHAR(255) NOT NULL,
    `complemento` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `empresa_cnpj_key`(`cnpj`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `licenca` (
    `id` VARCHAR(191) NOT NULL,
    `empresa_id` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(191) NOT NULL,
    `orgao_ambiental` VARCHAR(255) NOT NULL,
    `emissao` DATE NOT NULL,
    `validade` DATE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `licenca_numero_key`(`numero`),
    INDEX `idx_empresa_id`(`empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `licenca` ADD CONSTRAINT `licenca_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
