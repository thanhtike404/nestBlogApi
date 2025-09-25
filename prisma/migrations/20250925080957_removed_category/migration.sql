/*
  Warnings:

  - You are about to drop the column `category_id` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `telescope_entries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `telescope_entries_tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `telescope_monitoring` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."blog_posts" DROP CONSTRAINT "blog_posts_category_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."post_category" DROP CONSTRAINT "post_category_category_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."post_category" DROP CONSTRAINT "post_category_post_id_foreign";

-- DropForeignKey
ALTER TABLE "public"."telescope_entries_tags" DROP CONSTRAINT "telescope_entries_tags_entry_uuid_foreign";

-- DropIndex
DROP INDEX "public"."blog_posts_category_id_is_published_index";

-- AlterTable
ALTER TABLE "public"."blog_posts" DROP COLUMN "category_id";

-- DropTable
DROP TABLE "public"."categories";

-- DropTable
DROP TABLE "public"."post_category";

-- DropTable
DROP TABLE "public"."telescope_entries";

-- DropTable
DROP TABLE "public"."telescope_entries_tags";

-- DropTable
DROP TABLE "public"."telescope_monitoring";

-- CreateTable
CREATE TABLE "public"."Follows" (
    "followerId" BIGINT NOT NULL,
    "followedId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follows_pkey" PRIMARY KEY ("followerId","followedId")
);

-- AddForeignKey
ALTER TABLE "public"."Follows" ADD CONSTRAINT "Follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Follows" ADD CONSTRAINT "Follows_followedId_fkey" FOREIGN KEY ("followedId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
