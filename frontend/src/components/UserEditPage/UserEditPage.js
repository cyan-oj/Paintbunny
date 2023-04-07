import { useEffect } from "react";
import Painter from "../WebGLPainter/Painter";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchIcon } from "../../store/icons";

function UserEditPage(){
  const { userId, iconId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIcon(userId, iconId));
  }, [])

  console.log( {userId, iconId});
  
  return (
    <Painter canvasType='icon' width={ 256 } height={ 256 } iconId={ iconId } userId={ userId } />
  )
}

export default UserEditPage