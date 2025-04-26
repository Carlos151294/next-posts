import CommentCreateForm from "@/components/comments/CommentCreateForm";
import CommentList from "@/components/comments/CommentList";
import PostShow from "@/components/posts/PostShow";
import { fetchCommentsByPostId } from "@/db/queries/comments";
import paths from "@/helpers/paths";
import Link from "next/link";

interface PostShowPageProps {
  params: Promise<{
    slug: string;
    postId: string;
  }>;
}

export default async function PostShowPage({ params }: PostShowPageProps) {
  const { slug, postId } = await params;
  const comments = await fetchCommentsByPostId(postId);

  return (
    <div className="space-y-3">
      <Link className="underline decoration-solid" href={paths.topicShow(slug)}>
        {"< "}Back to {slug}
      </Link>
      <PostShow postId={postId} />
      <CommentCreateForm postId={postId} startOpen />
      <CommentList comments={comments} />
    </div>
  );
}
