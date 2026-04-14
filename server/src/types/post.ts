/**
 * @description Serialized blog post returned by the API and stored in JSON.
 */
export interface Post {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

/**
 * @description Payload accepted when creating a post (server assigns id and createdAt).
 */
export interface CreatePostInput {
  title: string;
  body: string;
}
