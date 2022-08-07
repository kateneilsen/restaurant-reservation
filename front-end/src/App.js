import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Layout from "./layout/Layout";

/**
 * Defines the root application component.
 * @returns {JSX.Element}
 */
function App() {
  class DebugRouter extends Router {
    constructor(props) {
      super(props);
      console.log(
        "initial history is: ",
        JSON.stringify(this.history, null, 2)
      );
      this.history.listen((location, action) => {
        console.log(
          `The current URL is ${location.pathname}${location.search}${location.hash}`
        );
        console.log(
          `The last navigation action was ${action}`,
          JSON.stringify(this.history, null, 2)
        );
      });
    }
  }
  return (
    <DebugRouter>
      <Switch>
        <Route path="/">
          <Layout />
        </Route>
      </Switch>
    </DebugRouter>
  );
}

export default App;
