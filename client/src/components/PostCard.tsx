import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { Post } from "../types/post.js";

export interface PostCardProps {
  post: Post;
  /** @description Invoked when the user chooses to edit this post. */
  onEdit: () => void;
}

/**
 * @description Renders a single post in a card layout with an edit action.
 * @param props Post data and edit handler.
 * @returns Card element.
 */
export function PostCard({ post, onEdit }: PostCardProps) {
  const created = new Date(post.createdAt);
  const dateLabel = Number.isNaN(created.getTime())
    ? post.createdAt
    : created.toLocaleString();

  return (
    <Card data-testid="post-card" variant="outlined" sx={{ bgcolor: "background.paper" }}>
      <CardContent>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          gap={1}
          sx={{ mb: 1 }}
        >
          <Typography component="h2" variant="h6" sx={{ flex: 1 }}>
            {post.title}
          </Typography>
          <Button size="small" variant="outlined" onClick={onEdit}>
            Edit
          </Button>
        </Stack>
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
