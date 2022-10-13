import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUser, fetchUser } from "../../store/users";

function UserPage() {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const user = useSelector(getUser(userId));

  useEffect(() => {
    dispatch(fetchUser(userId));
  }, [dispatch, userId]);

  if (!user) return null;

  const dateFormat = dateString => {
    const date = new Date(dateString)
    return date.toDateString()
  }
  
  // const drawings = user.drawings.map (drawing => { //todo: need drawings index method
  //   <img src={drawing.imageUrl} alt="" className="showimage" />
  // })

  return (
    <div className="user-bio">      
      <h1>{user.username}</h1>
      <p>member since: {dateFormat(user.createdAt)} </p>
    </div>
  )
}

export default UserPage;