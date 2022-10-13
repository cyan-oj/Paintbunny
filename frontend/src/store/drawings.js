import csrfFetch from "./csrf";

export const RECEIVE_DRAWING = "drawings/RECIEVE_DRAWING";
export const RECEIVE_DRAWINGS = "drawings/RECEIVE_DRAWINGS";

export const receiveDrawing = drawing => ({
  type: RECEIVE_DRAWING,
  drawing
});

export const receiveDrawings = drawings => ({
  type: RECEIVE_DRAWINGS,
  drawings
});

export const getDrawings = ({ drawings }) => drawings ? Object.values(drawings) : [];

export const getDrawing = drawingId => ({ drawings }) => drawings ? drawings[drawingId] : null;

export const fetchDrawing = (userId, drawingId) => async dispatch => {
  const res = await csrfFetch(`/api/users/${userId}/drawings/${drawingId}`);
  const data = await res.json();
  dispatch(receiveDrawing(data.drawing));
}

export const fetchDrawings = () => async dispatch => {
  const res = await csrfFetch("/api/drawings");
  const data = await res.json();
  dispatch(receiveDrawings(data.drawings));
}

const drawingsReducer = (state = {}, action) => {
  const nextState = {...state};
  switch (action.type) {
    case RECEIVE_DRAWING:
      nextState[action.drawing.id] = action.drawing;
      return nextState;
    case RECEIVE_DRAWINGS:
      return {...state, ...action.drawings}
    default:
      return state;
  }
}

export default drawingsReducer;