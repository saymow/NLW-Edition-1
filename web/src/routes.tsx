import React from "react";
import { Route, BrowserRouter } from "react-router-dom";

import Home from "./pages/homePages/home";
import Register from "./pages/homePages/register";
import Login from "./pages/homePages/login"
import listPoints from "./pages/listPoints"
import MyPoints from "./pages/myPoints";
import CreatePoint from "./pages/createPoint";

const Routes = () => {
  return(
    <BrowserRouter >
      <Route component={Home} path="/" exact/>
      <Route component={Login} path="/login"/>
      <Route component={Register} path="/register" />
      <Route component={MyPoints} path="/my-points" />
      <Route component={CreatePoint} path="/create-point" />
      <Route component={listPoints} path="/list-points/:uf/:city" />
    </BrowserRouter>
  )
}

export default Routes;