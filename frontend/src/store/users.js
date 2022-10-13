import csrfFetch from "./csrf";

export const RECEIVE_USER = "users/RECEIVE_USER";

export const receiveUser = user => ({
  type: RECEIVE_USER,
  user
});

export const getUser = userId => ({ users }) => users ? users[userId] : null;

export const fetchUser = userId => async dispatch => {
  const res = await csrfFetch(`/api/users/${userId}`);
  const data = await res.json();
  console.log("userdata", data.users)
  dispatch(receiveUser(data.user));
}

const usersReducer = (state = {}, action) => {
  const nextState = {...state};
  switch (action.type) {
    case RECEIVE_USER:
      console.log("action", action)
      console.log("action user", action.user)
      console.log("action user id", action.user.id)
      nextState[action.user.id] = action.user;
      return nextState;
    default:
      return state;
  }
}

export default usersReducer;