import React from "react";
import { Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserPage from "./components/UserPage";
import DrawingPage from "./components/Drawings/DrawingPage";
import DrawingIndex from "./components/Drawings/DrawingIndex";
import DrawingTemplatePage from "./components/Drawings/DrawingTemplatePage";
import Canvas from "./components/Painter/Canvas";
import { ProtectedRoute } from "./utils";
import { useSelector } from "react-redux";
import Welcome from "./components/Welcome/Welcome";

function App() {
  const user = useSelector(state => state.session.user)

  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/users/:userId/drawings/:drawingId">
          <DrawingPage />
        </Route>
        <Route path="/template">
          <DrawingTemplatePage />
        </Route>
        <Route path="/users/:userId">
          <UserPage />
        </Route>
        <Route path="/new">
          <ProtectedRoute user={user} >
              <Canvas />
          </ProtectedRoute>
        </Route>
        <Route path="/"> 
          { !user &&
            <Welcome />
          }
          <DrawingIndex user={ user } />
        </Route>
      </Switch>
    </>
  );
}

export default App;