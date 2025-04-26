import { CommentWithAuthor } from "@/db/queries/comments";
import CommentShow from "./CommentShow";

interface CommentListProps {
  comments: CommentWithAuthor[];
}

// TODO: Get a list of comments from somewhere
export default async function CommentList({ comments }: CommentListProps) {
  const topLevelComments = comments.filter(
    (comment) => comment.parentId === null
  );

  return (
    <div className="space-y-3">
      <h1 className="text-lg font-bold">All {comments.length} comments</h1>
      {topLevelComments.map((comment) => {
        return (
          <CommentShow
            key={comment.id}
            commentId={comment.id}
            comments={comments}
          />
        );
      })}
    </div>
  );
}
