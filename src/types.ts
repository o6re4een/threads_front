export type JWTToken = {
  access_token: string;
  token_type: string;
};

export type createRootThreadPayload = {
  content: string;
  image_url?: string | null;
};

export type createSubThreadPayload = {
  content: string;
  image_url?: string | null;
  parent_id: number;
};

export type Author = {
  user_name: string;
};

export type Thread = {
  id: number;
  parent_id: number | null;
  post_id: number;
  creator_id: number;
  user: Author;
  image_url: string | null;
  content: string;
  post: Post;
  parent: Thread | null;
  children: Thread[] | null;
};

export type Category = {
  name: string;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  author_id: number;
  threads_count: number;
  threads: Thread[] | null;
  author: Author;
};

export type User = {
  id: number;
  user_name: string;
  email: string;
  role: string | null;
  threads_count: number;
  posts_count: number;
};

export type createPostPayload = {
  title: string;
  content: string;
  image_url?: string | null;
  category?: string;
};
