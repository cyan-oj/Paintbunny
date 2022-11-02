import csrfFetch from "./csrf";

export const RECEIVE_DRAWING = "drawings/RECIEVE_DRAWING";
export const RECEIVE_DRAWINGS = "drawings/RECEIVE_DRAWINGS";
export const REMOVE_DRAWING = "drawings/REMOVE_DRAWING";

export const receiveDrawing = drawing => ({
  type: RECEIVE_DRAWING,
  drawing
});

export const receiveDrawings = drawings => ({
  type: RECEIVE_DRAWINGS,
  drawings
});

export const removeDrawing = drawingId => ({
  type: REMOVE_DRAWING,
  drawingId
});

export const getDrawings = userId => ({ drawings }) => {
  if (drawings) {
    const drawingArray = Object.values(drawings)
    if(userId){
      const selectedDrawings = drawingArray.filter(drawing => {
        return '' + drawing.artistId === userId
      });
      return selectedDrawings;
    }
    return drawingArray;
  }
  return [];
}

export const getDrawing = drawingId => ({ drawings }) => drawings ? drawings[drawingId] : null;

export const fetchDrawing = ( userId, drawingId ) => async dispatch => {
  const res = await csrfFetch(`/api/users/${userId}/drawings/${drawingId}`);
  const data = await res.json();
  dispatch(receiveDrawing(data.drawing));
}

export const fetchDrawings = userId => async dispatch => { 
  if (userId) {
    const res = await csrfFetch(`/api/users/${userId}/drawings`);
    const data = await res.json();
    dispatch(receiveDrawings(data.drawings));
  } else {
    const res = await csrfFetch("/api/drawings");
    const data = await res.json();
    dispatch(receiveDrawings(data.drawings));
  }
}

export const createDrawing = ( userId, drawing ) => async dispatch => {
  const res = await csrfFetch(`/api/users/${userId}/drawings`, {
    method: "POST",
    body: drawing
  });
  const data = await res.json();
  console.log("drawing data", data)
  dispatch(receiveDrawing(data.drawing));
}

export const updateDrawing = ( userId, drawingId, drawing ) => async dispatch => {
  const res = await csrfFetch(`/api/users/${userId}/drawings/${drawingId}`, {
    method: "PUT",
    body: drawing
  });
  const data = await res.json();
  dispatch(receiveDrawing(data.drawing));
}

export const destroyDrawing = ( userId, drawingId ) => async dispatch => {
  const res = await csrfFetch(`/api/users/${userId}/drawings/${drawingId}`, {
    method: "DELETE"
  });
  dispatch(removeDrawing(drawingId));
}

const drawingsReducer = (state = {}, action) => {
  const nextState = {...state};
  switch (action.type) {
    case RECEIVE_DRAWINGS:
      return {...state, ...action.drawings}
    case RECEIVE_DRAWING:
      nextState[action.drawing.id] = action.drawing;
      return nextState;
    case REMOVE_DRAWING:
      delete nextState[action.drawingId];
      return nextState;
    default:
      return nextState;
  }
}

export default drawingsReducer;