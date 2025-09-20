export class CreatePostDto {
  title: string;
  slug: string;
  user_id: number | string | bigint;
  category_id: number | string | bigint;
  excerpt?: string;
  featured_image?: string;
  content_blocks?: any;
  seo_meta?: any;
  reading_time?: number;
  is_featured?: boolean;
  content?: string;
  is_published?: boolean;
  published_at?: string | Date;
}
