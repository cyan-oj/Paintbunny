import Painter from "../WebGLPainter/Painter";
import { useParams } from "react-router-dom";

function UserEditPage(){
  const { iconId, userId } = useParams();

  return (
    <Painter canvasType='icon' width={ 256 } height={ 256 } iconId={ iconId } userId={ userId } />
  )
}

export default UserEditPage