import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUser, fetchUser } from "../../store/users";

function UserPage() {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const user = useSelector(state => state.users[userId]);
  //debugger;
  useEffect(() => {
    dispatch(fetchUser(userId));
    console.log(user);
  }, [dispatch, userId]);
  // debugger;

  if (!user) return null;
  
  console.log(userId)
  console.log(user)

  return (
    <div className="user-bio">      
      <h1>{user.username}</h1>
    </div>
  )
}

export default UserPage;