/*
  Warnings:

  - Changed the type of `media_type` on the `recipe_media` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RecipeMediaType" AS ENUM ('image', 'video');

-- AlterTable
ALTER TABLE "recipe_ingredients" ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "recipe_media" DROP COLUMN "media_type",
ADD COLUMN     "media_type" "RecipeMediaType" NOT NULL;

-- DropEnum
DROP TYPE "public"."IngredientMediaType";
