-- CreateTable
CREATE TABLE "unit_groups" (
    "id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sort_order" INTEGER,

    CONSTRAINT "unit_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "group_id" TEXT,
    "identifier" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "floor" INTEGER,
    "private_area_m2" DECIMAL(10,4) NOT NULL,
    "coefficient" DECIMAL(10,4) NOT NULL,
    "property_registration_number" TEXT,
    "use" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVA',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persons" (
    "id" TEXT NOT NULL,
    "person_type" TEXT NOT NULL,
    "document_type" TEXT NOT NULL,
    "document_number" TEXT NOT NULL,
    "full_name_or_business_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "notification_address" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_ownerships" (
    "id" TEXT NOT NULL,
    "unit_id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,
    "ownership_percentage" DECIMAL(6,3) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "is_primary" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_ownerships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unit_groups_community_id_name_key" ON "unit_groups"("community_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "units_community_id_identifier_key" ON "units"("community_id", "identifier");

-- CreateIndex
CREATE UNIQUE INDEX "units_community_id_property_registration_number_key" ON "units"("community_id", "property_registration_number");

-- CreateIndex
CREATE UNIQUE INDEX "persons_document_number_key" ON "persons"("document_number");

-- RenameForeignKey
ALTER TABLE "AdministratorProfiles" RENAME CONSTRAINT "AdministratorProfiles_cityId_fkey" TO "AdministratorProfiles_city_id_fkey";

-- RenameForeignKey
ALTER TABLE "AdministratorProfiles" RENAME CONSTRAINT "AdministratorProfiles_userId_fkey" TO "AdministratorProfiles_user_id_fkey";

-- AddForeignKey
ALTER TABLE "unit_groups" ADD CONSTRAINT "unit_groups_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "unit_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_ownerships" ADD CONSTRAINT "property_ownerships_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_ownerships" ADD CONSTRAINT "property_ownerships_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "AdministratorProfiles_taxId_key" RENAME TO "AdministratorProfiles_tax_id_key";

-- RenameIndex
ALTER INDEX "AdministratorProfiles_userId_key" RENAME TO "AdministratorProfiles_user_id_key";
