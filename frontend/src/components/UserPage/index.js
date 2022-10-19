import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUser, fetchUser } from "../../store/users";
import DrawingIndex from "../Drawings/DrawingIndex";
import  { dateFormat } from "../../utils"

function UserPage() {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const user = useSelector(getUser(userId));

  useEffect(() => {
    dispatch(fetchUser(userId));
  }, [dispatch, userId]);

  if (!user) return null;

  return (
    <>
      <div className="user-bio">      
        <h1>{user.username}</h1>
        <p>member since: {dateFormat(user.createdAt)} </p>
      </div>
      {user &&
        <DrawingIndex />
      }
    </>
  )
}

export default UserPage;