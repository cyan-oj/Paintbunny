import csrfFetch from "./csrf";

export const RECEIVE_DRAWING = "drawings/RECIEVE_DRAWING";

export const receiveDrawing = drawing => ({
  type: RECEIVE_DRAWING,
  drawing
});

export const getDrawing = drawingId => ({ drawings }) => drawings ? drawings[drawingId] : null;

export const fetchDrawing = drawingId => async dispatch => {
  const res = await csrfFetch(`/api/drawings/${drawingId}`);
  const data = await res.json();
  console.log("drawingdata", data)
  dispatch(receiveDrawing(data.drawing));
}

const drawingsReducer = (state = {}, action) => {
  const nextState = {...state};
  switch (action.type) {
    case RECEIVE_DRAWING:
      console.log("statedrawing", nextState[action.drawing])
      nextState[action.drawing.id] = action.drawing;
      return nextState;
      default:
        return state;
  }
}

export default drawingsReducer;