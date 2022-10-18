import { dateFormat } from "../../utils"
import { Link } from "react-router-dom";

function CommentIndexItem({ comment }) {
  return (
    <div className="comment">
      <div className="commenter-info">
        <Link
          to={`/users/${comment.authorId}`}>{comment.author}
        </Link>
        <p className="comment-date">{dateFormat(comment.createdAt)}</p>
      </div>
      <img src={comment.imageUrl} alt="" />
    </div>
  )
}

export default CommentIndexItem;