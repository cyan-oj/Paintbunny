import React from "react";
import { Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserPage from "./components/UserPage";
import WorkSpace from "./components/Painter/WorkSpace";

function App() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/users/:userId">
          <UserPage />
        </Route>
      </Switch>
      <WorkSpace />
    </>
  );
}

export default App;