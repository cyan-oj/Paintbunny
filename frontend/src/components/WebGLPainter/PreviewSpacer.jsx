function PreviewSpacer({ paintDispatch }){

  const closeTools = () => {
    paintDispatch({
      type: 'close_tools'
    })
  }

  return (
    <div className="preview-spacer" >
      <button onClick={ closeTools }>x</button>
    </div>
  )
}

export default PreviewSpacer