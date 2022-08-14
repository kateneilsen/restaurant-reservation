import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ListReservations from "./ListReservations";
import ErrorAlert from "../layout/ErrorAlert";

export default function Search() {
  const [search, setSearch] = useState("");
  const [mobileExists, setMobileExists] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  async function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      const response = await listReservations(
        { mobile_number: search },
        abortController.signal
      );
      setReservations(response);
      setMobileExists(true);
      setSearch("");
    } catch (error) {
      setError(error);
    }
    return () => abortController.abort();
  }

  const handleSearch = ({ target }) => {
    setSearch(target.value);
  };

  return (
    <div className="container mt-4">
      <ErrorAlert error={error} />
      <h4>Search by Phone Number</h4>
      <form onSubmit={submitHandler}>
        <div className="row">
          <input
            type="text"
            className="w-25"
            placeholder="Enter a customer's phone number"
            name="mobile_number"
            required={true}
            value={search}
            onChange={handleSearch}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            Find
          </button>
        </div>
      </form>
      {reservations.length > 0 ? (
        <ListReservations reservations={reservations} />
      ) : mobileExists && reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        ""
      )}
    </div>
  );
}
