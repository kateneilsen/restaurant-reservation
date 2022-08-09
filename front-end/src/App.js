import React from "react";
import { Route, Switch } from "react-router-dom";
import Layout from "./layout/Layout";
import ReservationSeats from "./reservations/ReservationSeats";

/**
 * Defines the root application component.
 * @returns {JSX.Element}
 */
function App() {
  return <Layout />;
}

export default App;
