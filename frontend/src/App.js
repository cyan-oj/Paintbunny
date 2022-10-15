import React from "react";
import { Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserPage from "./components/UserPage";
import WorkSpace from "./components/Painter/Painter";
import DrawingPage from "./components/Drawings/DrawingPage";
import DrawingIndex from "./components/Drawings/DrawingIndex";

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
        <Route path="/"> 
          <DrawingIndex />
        </Route>
      </Switch>
      <WorkSpace />
    </>
  );
}

export default App;