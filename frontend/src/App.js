import React from "react";
import { Route, Switch } from "react-router-dom";
import SignupForm from "./components/SignupForm";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Switch>
        {/* <Route path="/login">
          <LoginForm />
        </Route> */}
        <Route path="/signup">
          <SignupForm />
        </Route>
      </Switch>
    </>
  );
}

export default App;