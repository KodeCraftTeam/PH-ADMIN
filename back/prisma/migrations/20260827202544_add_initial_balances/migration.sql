-- CreateTable
CREATE TABLE "initial_balances" (
    "id" TEXT NOT NULL,
    "unit_id" TEXT NOT NULL,
    "balance_cop" DECIMAL(14,2) NOT NULL,
    "cutoff_date" DATE NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "initial_balances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "initial_balances_unit_id_key" ON "initial_balances"("unit_id");

-- AddForeignKey
ALTER TABLE "initial_balances" ADD CONSTRAINT "initial_balances_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
