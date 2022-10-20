import { Redirect } from "react-router-dom";

export const dateFormat = dateString => {
  const date = new Date(dateString)
  return date.toDateString()
}

export const ProtectedRoute = ({ user, redirectPath = "/", children }) => {
  if(!user) {
    return <Redirect to={redirectPath} />;
  }
  return children;
}
