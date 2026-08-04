-- CreateTable
CREATE TABLE "Cities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdministratorProfiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "personType" TEXT NOT NULL,
    "nameOrBusinessName" TEXT NOT NULL,
    "taxId" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "address" TEXT,
    "cityId" TEXT NOT NULL,
    "legalRepresentative" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "AdministratorProfiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cities_name_key" ON "Cities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AdministratorProfiles_userId_key" ON "AdministratorProfiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AdministratorProfiles_taxId_key" ON "AdministratorProfiles"("taxId");

-- AddForeignKey
ALTER TABLE "AdministratorProfiles" ADD CONSTRAINT "AdministratorProfiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdministratorProfiles" ADD CONSTRAINT "AdministratorProfiles_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "Cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
