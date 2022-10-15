import React from "react";
import { Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserPage from "./components/UserPage";
import DrawingPage from "./components/Drawings/DrawingPage";
import DrawingIndex from "./components/Drawings/DrawingIndex";
import Painter from "./components/Painter/Painter";

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
        <Route path="/new">
          <Painter />
        </Route>
        <Route path="/"> 
          <DrawingIndex />
        </Route>
      </Switch>
    </>
  );
}

export default App;