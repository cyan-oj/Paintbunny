import csrfFetch from "./csrf";

export const RECEIVE_ICON = "icons/RECEIVE_ICON";
export const RECEIVE_ICONS = "icons/RECEIVE_ICONS";
export const REMOVE_ICON = "icons/REMOVE_ICON";

export const receiveIcon = icon => ({
  type: RECEIVE_ICON,
  icon
})

export const getIcon = iconId => ({ icons }) => icons ? icons[iconId] : null

export const fetchIcon = ( userId, iconId ) => async dispatch => {
  console.log("fetching icon...")
  const res = await csrfFetch(`/api/users/${userId}/icons/${iconId}`)
  const data = await res.json();
  console.log(data)
  dispatch(receiveIcon(data.icon))
}

// update icon, or create one if it does not exist 
export const updateIcon = ( userId, icon, iconId ) => async dispatch => {
  const method = iconId ? "PUT" : "POST"
  const url = iconId ? `/api/users/${userId}/icons/${iconId}` : `/api/users/${userId}/icons`

  console.log("formdata", icon)
  const res = await csrfFetch(url, {
    method: method,
    body: icon
  });
  const data = await res.json();
  console.log("responsedata", data)
  dispatch(receiveIcon(data.icon))
}

const iconsReducer = (state = {}, action) => {
  const nextState = {...state};
  switch (action.type) {
    case RECEIVE_ICON:
      nextState[action.icon.id] = action.icon;
      return nextState;
    default:
      return nextState;
  }
}

export default iconsReducer;