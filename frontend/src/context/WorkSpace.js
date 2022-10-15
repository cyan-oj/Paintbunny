//todo: get rid of this?
const WorkSpaceContext = React.createContext();

export function WorkSpaceProvider({ children }) {
  const workSpaceRef = useRef();
  const [value, setValue] = useState();

  useEffect (() => {
    setValue(workSpaceRef.current);
  }, [])

  return (
    <>
      <WorkSpaceContext.Provider value={value}>
        {children}
      </WorkSpaceContext.Provider>
      <div ref={workSpaceRef}></div>
    </>
  )
}

export function WorkSpace({ children })