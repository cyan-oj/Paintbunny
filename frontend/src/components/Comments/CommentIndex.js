import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments, getComments } from "../../store/comments";

function CommentIndex({ drawingId }) {
  const dispatch = useDispatch();
  const comments = useSelector(getComments);

  useEffect(() => {
    dispatch(fetchComments(drawingId))
  }, [dispatch])

  const commentsList = comments.map(comment => 
    <img key={comment.id} src={comment.imageUrl} alt="" />
    );

  return (
    <div className="comments">
      {commentsList}
    </div>
  )
}

export default CommentIndex;
