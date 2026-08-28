-- AlterTable
ALTER TABLE "units" ALTER COLUMN "coefficient" DROP NOT NULL;
ALTER TABLE "units" ADD COLUMN "coefficient_origin" TEXT;

-- Backfill: unidades existentes ya tenían coeficiente asignado antes de que
-- 'origin' existiera. No hay forma de saber retroactivamente si vino del
-- reglamento; se infiere 'CALCULADO' (comportamiento por defecto del código
-- anterior). Corregible por unidad vía re-upload a coeficientes con
-- origen=REGLAMENTO si el administrador confirma que aplica.
UPDATE "units" SET "coefficient_origin" = 'CALCULADO'
  WHERE "coefficient" IS NOT NULL AND "coefficient_origin" IS NULL;
