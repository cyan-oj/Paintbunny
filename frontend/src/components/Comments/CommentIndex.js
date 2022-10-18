import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments, getComments } from "../../store/comments";
import CommentIndexItem from "./CommentIndexItem";
import "./Comments.css"

function CommentIndex({ drawingId }) {
  const dispatch = useDispatch();
  const comments = useSelector(getComments);

  const user = useSelector(state => state.session.user)

  useEffect(() => {
    dispatch(fetchComments(drawingId))
  }, [drawingId, dispatch])

  const commentsList = comments.map(comment => 
    <CommentIndexItem key={comment.id} comment={comment} isUser={ user && user.id === comment.authorId} drawingId={drawingId} />
    );

  return (
    <div className="comments">
      {commentsList}
    </div>
  )
}

export default CommentIndex;
