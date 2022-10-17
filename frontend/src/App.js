import React from "react";
import { Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserPage from "./components/UserPage";
import DrawingPage from "./components/Drawings/DrawingPage";
import DrawingIndex from "./components/Drawings/DrawingIndex";
import Canvas from "./components/Painter/Canvas";

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
          <Canvas />
        </Route>
        <Route path="/"> 
          <DrawingIndex />
        </Route>
      </Switch>
    </>
  );
}

export default App;