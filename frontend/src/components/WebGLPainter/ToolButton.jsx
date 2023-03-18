import { useEffect, useState } from 'react'
import { ReactComponent as PinnedIcon } from '/public/icons/pin-slash-svgrepo.com.svg'
import { ReactComponent as UnPinnedIcon } from 'public/icons/pin-fill-svgrepo.com.svg'

function ToolButton({ buttonText, Icon, shortcutText = '', showTools, active = false, clickFunction }) {
  // todo: create a tooltip component for on-hover additional info 
  const [ pinned, setPinned ] = useState( true );
  useEffect(() => {}, [pinned, active])

  return (
    <div className='tool-button'>
      { showTools && 
      <>
        <div onClick={() => setPinned( !pinned )}>
          { pinned ? <PinnedIcon className='pin' /> : <UnPinnedIcon className='unpin' /> }
        </div>
        <div className='tool-details'>
          <div className='tool-name'>
            { buttonText }
          </div>
          <div className='shortcut'>
            { shortcutText }
        </div>
        </div>
      </>
      }
      { (showTools || pinned) && 
        <div id={ buttonText } onClick={ clickFunction } >
          <Icon className={ active ? 'icon-active' : 'icon' }/>
        </div>
      }
    </div>
  )
}

export default ToolButton;