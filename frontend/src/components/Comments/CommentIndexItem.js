import { dateFormat } from "../../utils"
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { destroyComment } from "../../store/comments";

function CommentIndexItem({ comment, drawingId, isUser }) {
  const dispatch = useDispatch();

  const deleteComment = e => {
    if(isUser)
      dispatch(destroyComment(drawingId, comment.id))
  }

  return (
    <div className="comment">
      <div className="commenter-info">
        <Link
          to={`/users/${comment.authorId}`}>{comment.author}
        </Link>
        <p className="comment-date">{dateFormat(comment.createdAt)}</p>
        {isUser && 
          <button onClick={ deleteComment }>delete</button>
        }
      </div>
      <img src={comment.imageUrl} alt="" />
    </div>
  )
}

export default CommentIndexItem;