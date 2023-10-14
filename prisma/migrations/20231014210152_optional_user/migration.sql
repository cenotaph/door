-- DropForeignKey
ALTER TABLE "nfcs" DROP CONSTRAINT "nfcs_user_id_fkey";

-- AlterTable
ALTER TABLE "nfcs" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "nfcs" ADD CONSTRAINT "nfcs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
