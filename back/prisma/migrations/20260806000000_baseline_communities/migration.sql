-- CreateTable
CREATE TABLE "public"."administrator_community" (
    "id" TEXT NOT NULL,
    "administrator_id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,

    CONSTRAINT "administrator_community_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."communities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tax_id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,
    "total_units" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "communities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "administrator_community_administrator_id_community_id_key" ON "public"."administrator_community"("administrator_id" ASC, "community_id" ASC);

-- AddForeignKey
ALTER TABLE "public"."administrator_community" ADD CONSTRAINT "administrator_community_administrator_id_fkey" FOREIGN KEY ("administrator_id") REFERENCES "public"."AdministratorProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."administrator_community" ADD CONSTRAINT "administrator_community_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."communities" ADD CONSTRAINT "communities_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."Cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
