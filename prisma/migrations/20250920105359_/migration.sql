/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Series` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PostToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_parentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Image" DROP CONSTRAINT "Image_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_seriesId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_PostToTag" DROP CONSTRAINT "_PostToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_PostToTag" DROP CONSTRAINT "_PostToTag_B_fkey";

-- DropTable
DROP TABLE "public"."Category";

-- DropTable
DROP TABLE "public"."Comment";

-- DropTable
DROP TABLE "public"."Image";

-- DropTable
DROP TABLE "public"."Post";

-- DropTable
DROP TABLE "public"."Series";

-- DropTable
DROP TABLE "public"."Tag";

-- DropTable
DROP TABLE "public"."User";

-- DropTable
DROP TABLE "public"."_PostToTag";

-- DropEnum
DROP TYPE "public"."Status";

-- CreateTable
CREATE TABLE "public"."blog_posts" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),
    "title" VARCHAR(255) NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(0),
    "slug" VARCHAR(255) NOT NULL,
    "user_id" BIGINT NOT NULL,
    "category_id" BIGINT NOT NULL,
    "excerpt" TEXT,
    "featured_image" VARCHAR(255),
    "content_blocks" JSON,
    "seo_meta" JSON,
    "reading_time" INTEGER,
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cache" (
    "key" VARCHAR(255) NOT NULL,
    "value" TEXT NOT NULL,
    "expiration" INTEGER NOT NULL,

    CONSTRAINT "cache_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "public"."cache_locks" (
    "key" VARCHAR(255) NOT NULL,
    "owner" VARCHAR(255) NOT NULL,
    "expiration" INTEGER NOT NULL,

    CONSTRAINT "cache_locks_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."failed_jobs" (
    "id" BIGSERIAL NOT NULL,
    "uuid" VARCHAR(255) NOT NULL,
    "connection" TEXT NOT NULL,
    "queue" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "exception" TEXT NOT NULL,
    "failed_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "failed_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."job_batches" (
    "id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "total_jobs" INTEGER NOT NULL,
    "pending_jobs" INTEGER NOT NULL,
    "failed_jobs" INTEGER NOT NULL,
    "failed_job_ids" TEXT NOT NULL,
    "options" TEXT,
    "cancelled_at" INTEGER,
    "created_at" INTEGER NOT NULL,
    "finished_at" INTEGER,

    CONSTRAINT "job_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."jobs" (
    "id" BIGSERIAL NOT NULL,
    "queue" VARCHAR(255) NOT NULL,
    "payload" TEXT NOT NULL,
    "attempts" SMALLINT NOT NULL,
    "reserved_at" INTEGER,
    "available_at" INTEGER NOT NULL,
    "created_at" INTEGER NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."migrations" (
    "id" SERIAL NOT NULL,
    "migration" VARCHAR(255) NOT NULL,
    "batch" INTEGER NOT NULL,

    CONSTRAINT "migrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."password_reset_tokens" (
    "email" VARCHAR(255) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0),

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "public"."post_category" (
    "post_id" BIGINT NOT NULL,
    "category_id" BIGINT NOT NULL,

    CONSTRAINT "post_category_pkey" PRIMARY KEY ("post_id","category_id")
);

-- CreateTable
CREATE TABLE "public"."post_tag" (
    "post_id" BIGINT NOT NULL,
    "tag_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "post_tag_pkey" PRIMARY KEY ("post_id","tag_id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" VARCHAR(255) NOT NULL,
    "user_id" BIGINT,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "payload" TEXT NOT NULL,
    "last_activity" INTEGER NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tags" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "color" VARCHAR(255),
    "description" TEXT,
    "official_url" VARCHAR(255),
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."telescope_entries" (
    "sequence" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "batch_id" UUID NOT NULL,
    "family_hash" VARCHAR(255),
    "should_display_on_index" BOOLEAN NOT NULL DEFAULT true,
    "type" VARCHAR(20) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(0),

    CONSTRAINT "telescope_entries_pkey" PRIMARY KEY ("sequence")
);

-- CreateTable
CREATE TABLE "public"."telescope_entries_tags" (
    "entry_uuid" UUID NOT NULL,
    "tag" VARCHAR(255) NOT NULL,

    CONSTRAINT "telescope_entries_tags_pkey" PRIMARY KEY ("entry_uuid","tag")
);

-- CreateTable
CREATE TABLE "public"."telescope_monitoring" (
    "tag" VARCHAR(255) NOT NULL,

    CONSTRAINT "telescope_monitoring_pkey" PRIMARY KEY ("tag")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "email_verified_at" TIMESTAMP(0),
    "password" VARCHAR(255) NOT NULL,
    "remember_token" VARCHAR(100),
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_unique" ON "public"."blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_category_id_is_published_index" ON "public"."blog_posts"("category_id", "is_published");

-- CreateIndex
CREATE INDEX "blog_posts_is_featured_index" ON "public"."blog_posts"("is_featured");

-- CreateIndex
CREATE INDEX "blog_posts_is_published_published_at_index" ON "public"."blog_posts"("is_published", "published_at");

-- CreateIndex
CREATE INDEX "blog_posts_user_id_is_published_index" ON "public"."blog_posts"("user_id", "is_published");

-- CreateIndex
CREATE INDEX "blog_posts_views_count_index" ON "public"."blog_posts"("views_count");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_unique" ON "public"."categories"("slug");

-- CreateIndex
CREATE INDEX "categories_slug_index" ON "public"."categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "failed_jobs_uuid_unique" ON "public"."failed_jobs"("uuid");

-- CreateIndex
CREATE INDEX "jobs_queue_index" ON "public"."jobs"("queue");

-- CreateIndex
CREATE INDEX "post_category_category_id_post_id_index" ON "public"."post_category"("category_id", "post_id");

-- CreateIndex
CREATE INDEX "post_category_post_id_category_id_index" ON "public"."post_category"("post_id", "category_id");

-- CreateIndex
CREATE INDEX "post_tag_post_id_tag_id_index" ON "public"."post_tag"("post_id", "tag_id");

-- CreateIndex
CREATE INDEX "post_tag_tag_id_post_id_index" ON "public"."post_tag"("tag_id", "post_id");

-- CreateIndex
CREATE INDEX "sessions_last_activity_index" ON "public"."sessions"("last_activity");

-- CreateIndex
CREATE INDEX "sessions_user_id_index" ON "public"."sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_unique" ON "public"."tags"("slug");

-- CreateIndex
CREATE INDEX "tags_slug_index" ON "public"."tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "telescope_entries_uuid_unique" ON "public"."telescope_entries"("uuid");

-- CreateIndex
CREATE INDEX "telescope_entries_batch_id_index" ON "public"."telescope_entries"("batch_id");

-- CreateIndex
CREATE INDEX "telescope_entries_created_at_index" ON "public"."telescope_entries"("created_at");

-- CreateIndex
CREATE INDEX "telescope_entries_family_hash_index" ON "public"."telescope_entries"("family_hash");

-- CreateIndex
CREATE INDEX "telescope_entries_type_should_display_on_index_index" ON "public"."telescope_entries"("type", "should_display_on_index");

-- CreateIndex
CREATE INDEX "telescope_entries_tags_tag_index" ON "public"."telescope_entries_tags"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_unique" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."blog_posts" ADD CONSTRAINT "blog_posts_category_id_foreign" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."blog_posts" ADD CONSTRAINT "blog_posts_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."post_category" ADD CONSTRAINT "post_category_category_id_foreign" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."post_category" ADD CONSTRAINT "post_category_post_id_foreign" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."post_tag" ADD CONSTRAINT "post_tag_post_id_foreign" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."post_tag" ADD CONSTRAINT "post_tag_tag_id_foreign" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."telescope_entries_tags" ADD CONSTRAINT "telescope_entries_tags_entry_uuid_foreign" FOREIGN KEY ("entry_uuid") REFERENCES "public"."telescope_entries"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION;
