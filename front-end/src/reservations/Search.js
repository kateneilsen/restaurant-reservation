import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ListReservations from "./ListReservations";
import ErrorAlert from "../layout/ErrorAlert";

export default function Search() {
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);
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
      setLoaded(true);
    } catch (error) {
      setError(error);
    }
    return () => abortController.abort();
  }

  const handleSearch = ({ target }) => {
    setSearch({ ...search, [target.name]: target.value });
  };

  return (
    <div className="container mt-4">
      <ErrorAlert error={error} />
      <h4>Search by Phone Number</h4>
      <form onSubmit={submitHandler}>
        <label className="row">Enter Mobile Number</label>
        <div className="row">
          <input
            type="search"
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
      ) : (
        <p>No reservations found.</p>
      )}
    </div>
  );
}
