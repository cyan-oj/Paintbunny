import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments, getComments } from "../../store/comments";
import CommentIndexItem from "./CommentIndexItem";
import "./Comments.css"

function CommentIndex({ drawingId }) {
  const dispatch = useDispatch();
  const comments = useSelector(getComments);

  useEffect(() => {
    dispatch(fetchComments(drawingId))
  }, [drawingId, dispatch])

  const commentsList = comments.map(comment => 
    <CommentIndexItem key={comment.id} comment={comment} />
    );

  return (
    <div className="comments">
      {commentsList}
    </div>
  )
}

export default CommentIndex;
