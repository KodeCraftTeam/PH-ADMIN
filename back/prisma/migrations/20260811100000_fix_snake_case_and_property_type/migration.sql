-- RenameColumn (preserve data: use RENAME, not drop+add)
ALTER TABLE "public"."Users" RENAME COLUMN "createdAt" TO "created_at";

ALTER TABLE "public"."AdministratorProfiles" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "public"."AdministratorProfiles" RENAME COLUMN "personType" TO "person_type";
ALTER TABLE "public"."AdministratorProfiles" RENAME COLUMN "nameOrBusinessName" TO "name_or_business_name";
ALTER TABLE "public"."AdministratorProfiles" RENAME COLUMN "taxId" TO "tax_id";
ALTER TABLE "public"."AdministratorProfiles" RENAME COLUMN "phoneNumber" TO "phone_number";
ALTER TABLE "public"."AdministratorProfiles" RENAME COLUMN "cityId" TO "city_id";
ALTER TABLE "public"."AdministratorProfiles" RENAME COLUMN "legalRepresentative" TO "legal_representative";
ALTER TABLE "public"."AdministratorProfiles" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "public"."AdministratorProfiles" RENAME COLUMN "updatedAt" TO "updated_at";

-- AddColumn (new, defaulted so existing rows are unaffected)
ALTER TABLE "public"."communities" ADD COLUMN "type" TEXT NOT NULL DEFAULT 'RESIDENCIAL';
