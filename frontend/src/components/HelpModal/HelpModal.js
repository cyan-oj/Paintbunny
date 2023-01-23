import { useState } from "react";
import "./HelpModal.css"

function HelpModal({ helpText }) {
  const [ hovered, hover ] = useState(false);

  return (
    <div className="help-modal">
      <button className="help-button"
        onMouseEnter={ e => hover(true)} 
        onMouseLeave={ e=> hover(false)}
      >ⓘ</button>
      { hovered && 
        <p className="help-text">{ helpText }</p>
      }
    </div>
  )
}

export default HelpModal;