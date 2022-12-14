import csrfFetch from "./csrf";

export const RECEIVE_COMMENT = "comments/RECEIVE_COMMENT";
export const RECEIVE_COMMENTS = "comments/RECEIVE_COMMENTS";
export const REMOVE_COMMENT = "comments/REMOVE_COMMENT";

export const receiveComment = comment => ({
  type: RECEIVE_COMMENT,
  comment
})

export const receiveComments = comments => ({
  type: RECEIVE_COMMENTS,
  comments
})

export const removeComment = commentId => ({
  type: REMOVE_COMMENT,
  commentId
})

export const getComment = commentId => ({ comments }) => comments ? comments[commentId] : null;
export const getComments = ({ comments }) => comments ? Object.values(comments) : [];
export const getDrawingComments = drawingId => ({ comments }) => {
  if (comments) {
    const commentArray = Object.values(comments)
    const selectedComments = commentArray.filter(comment => {
      return '' + comment.drawingId === drawingId
      });
    return selectedComments;
  }
  return [];
}

export const fetchComments = drawingId => async dispatch => {
  const res = await csrfFetch(`/api/drawings/${drawingId}/comments`);
  const data = await res.json();
  dispatch(receiveComments(data.comments || []));
} 

export const createComment = ( drawingId, comment ) => async dispatch => {
  const res = await csrfFetch(`/api/drawings/${drawingId}/comments`, {
    method: "POST",
    body: comment
  });
  const data = await res.json();
  dispatch(receiveComment(data.comment));
}

export const destroyComment = ( drawingId, commentId ) => async dispatch => {
  const res = await csrfFetch(`/api/drawings/${drawingId}/comments/${commentId}`, {
    method: "DELETE"
  });
  dispatch(removeComment(commentId));
}

const commentsReducer = (state = {}, action) => {
  const nextState = {...state};
  switch (action.type) {
    case RECEIVE_COMMENTS:
      return {...state, ...action.comments}
    case RECEIVE_COMMENT: 
      nextState[action.comment.id] = action.comment;
      return nextState;
    case REMOVE_COMMENT:
      delete nextState[action.commentId];
      return nextState;
    default:
      return nextState;
  }
}

export default commentsReducer;