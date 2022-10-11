import React from "react";
import { Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserPage from "./components/UserPage";

function App() {
  return (
    <>
      <Navbar />
      <Switch>
        {/* <Route path="/:userId">
          <UserPage />
        </Route> */}
        {/* <Route path="/signup">
          <SignupForm />
        </Route> */}
      </Switch>
    </>
  );
}

export default App;