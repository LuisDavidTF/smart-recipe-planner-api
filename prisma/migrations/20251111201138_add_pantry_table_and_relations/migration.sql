-- CreateTable
CREATE TABLE "user_pantry_items" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "ingredientId" INTEGER NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unit_of_measure" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pantry_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_pantry_items_user_id_ingredientId_key" ON "user_pantry_items"("user_id", "ingredientId");

-- AddForeignKey
ALTER TABLE "user_pantry_items" ADD CONSTRAINT "user_pantry_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_pantry_items" ADD CONSTRAINT "user_pantry_items_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
