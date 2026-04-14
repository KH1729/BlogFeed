import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useRef, useState } from "react";

import { createPost, fetchPosts } from "./lib/api.js";
import { NewPostDialog } from "./components/NewPostDialog.js";
import { PostCard } from "./components/PostCard.js";
import type { Post } from "./types/post.js";

/** @description Shown once when the feed loads empty; invites the first post. */
const EMPTY_FEED_INTRO_MESSAGE =
  "There are no posts in your feed yet. Write the first post below to get started.";

/**
 * @description Blog feed page: loads posts and opens a dialog to create posts.
 * @returns Main application layout.
 */
export function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [newPostIntroMessage, setNewPostIntroMessage] = useState<string | null>(null);
  const hasAutoOpenedForEmptyFeedRef = useRef(false);

  const loadPosts = useCallback(async () => {
    setLoadError(null);
    try {
      const next = await fetchPosts();
      setPosts(next);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Could not load posts";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    if (isLoading || loadError !== null || posts.length > 0) return;
    if (hasAutoOpenedForEmptyFeedRef.current) return;
    hasAutoOpenedForEmptyFeedRef.current = true;
    setNewPostIntroMessage(EMPTY_FEED_INTRO_MESSAGE);
    setIsNewPostOpen(true);
  }, [isLoading, loadError, posts.length]);

  const handleCloseNewPost = useCallback(() => {
    if (isSubmitting) return;
    setIsNewPostOpen(false);
    setFormError(null);
    setNewPostIntroMessage(null);
  }, [isSubmitting]);

  return (
    <Box sx={{ minHeight: "100vh", py: 5, px: 2 }}>
      <Container maxWidth="sm">
        <Stack spacing={4}>
          <Box
            component="header"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h3" component="h1" gutterBottom>
                Blog feed
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Simple posts from your JSON-backed API.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setFormError(null);
                setNewPostIntroMessage(null);
                setIsNewPostOpen(true);
              }}
            >
              New post
            </Button>
          </Box>

          <NewPostDialog
            open={isNewPostOpen}
            onClose={handleCloseNewPost}
            introMessage={newPostIntroMessage}
            formError={formError}
            isSubmitting={isSubmitting}
            onSubmit={async (values) => {
              setFormError(null);
              setIsSubmitting(true);
              try {
                await createPost(values);
                await loadPosts();
                setNewPostIntroMessage(null);
                setIsNewPostOpen(false);
              } catch (e: unknown) {
                const message = e instanceof Error ? e.message : "Could not create post";
                setFormError(message);
              } finally {
                setIsSubmitting(false);
              }
            }}
          />

          <Box component="section" aria-label="Posts">
            <Typography
              variant="overline"
              color="text.secondary"
              display="block"
              sx={{ mb: 2 }}
            >
              Feed
            </Typography>
            {isLoading ? (
              <Stack alignItems="center" py={2}>
                <CircularProgress aria-label="Loading posts" />
              </Stack>
            ) : loadError ? (
              <Alert severity="error">{loadError}</Alert>
            ) : posts.length === 0 ? (
              <Typography color="text.secondary">
                No posts yet. Click <strong>New post</strong> to add one.
              </Typography>
            ) : (
              <Stack component="ul" spacing={2} sx={{ listStyle: "none", m: 0, p: 0 }}>
                {posts.map((post) => (
                  <Box component="li" key={post.id}>
                    <PostCard post={post} />
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
