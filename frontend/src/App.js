import React from "react";
import { Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserPage from "./components/UserPage";
import WorkSpace from "./components/Painter/WorkSpace";
import DrawingPage from "./components/DrawingPage";

function App() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/users/:userId">
          <UserPage />
        </Route>
        <Route path="/drawings/:drawingId">
          <DrawingPage />
        </Route>
      </Switch>
      <WorkSpace />
    </>
  );
}

export default App;