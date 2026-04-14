import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import type { Post } from "../types/post.js";

export interface PostCardProps {
  post: Post;
}

/**
 * @description Renders a single post in a card layout.
 * @param props Post data to display.
 * @returns Card element.
 */
export function PostCard({ post }: PostCardProps) {
  const created = new Date(post.createdAt);
  const dateLabel = Number.isNaN(created.getTime())
    ? post.createdAt
    : created.toLocaleString();

  return (
    <Card data-testid="post-card" variant="outlined" sx={{ bgcolor: "background.paper" }}>
      <CardContent>
        <Typography component="h2" variant="h6" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          {dateLabel}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, whiteSpace: "pre-wrap" }}>
          {post.body}
        </Typography>
      </CardContent>
    </Card>
  );
}
