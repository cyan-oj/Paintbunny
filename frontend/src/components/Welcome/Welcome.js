import GuestMenu from "../Navbar/GuestMenu";

function Welcome() {
  
  return (
    <div className="welcome-banner">
      <h1>Welcome to Paintbunny, sign up to start painting today!</h1>
      <GuestMenu />
    </div>
  )
}

export default Welcome;