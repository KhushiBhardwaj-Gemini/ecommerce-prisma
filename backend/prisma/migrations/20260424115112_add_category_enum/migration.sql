-- Step 1: Create enum type
CREATE TYPE "Category" AS ENUM ('electronics', 'men', 'women', 'jwellery');

-- Step 2: Alter column safely
ALTER TABLE "Product"
ALTER COLUMN "category" TYPE "Category"
USING category::text::"Category";