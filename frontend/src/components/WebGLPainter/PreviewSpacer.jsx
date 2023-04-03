function PreviewSpacer({ paintDispatch }){

  const closeTools = () => {
    paintDispatch({
      type: 'close_tools'
    })
  }

  return (
      <button className="close-tools" onClick={ closeTools }>x</button>
  )
}

export default PreviewSpacer