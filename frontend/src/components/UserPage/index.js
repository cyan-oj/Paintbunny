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
  // debugger;
  console.log(userId)
  console.log(user)

  return (
    <div className="user-bio">        
      <h1>UserPage</h1>
    </div>
  )
}

export default UserPage;