import React, { useState } from "react";
import useQuery from "../utils/useQuery";
import { listReservations } from "../utils/api";

export default function Search() {
  const [searchForm, setSearchForm] = useState("");
  const [reservations, setReservations] = useState([]);
  const [errors, setErrors] = useState([]);
  const query = useQuery();

  const mobile_number = query.get("mobile_number");

  function loadReservations() {
    const abortController = new AbortController();
    listReservations({ mobile_number }, abortController.signal)
      .then(setReservations)
      .catch(setErrors);
    return () => abortController.abort();
  }

  const handleInput = (event) => {
    setSearchForm({ ...searchForm, [event.target.name]: event.target.value });
  };

  return (
    <div className="container mt-4">
      <label className="row">Search for a Reservation by Mobile Number</label>
      <div className="row">
        <input
          type="search"
          className="w-25"
          placeholder="Enter a customer's phone number"
          name="mobile_number"
          onChange={handleInput}
        />
        <button type="submit" className="btn btn-primary btn-sm">
          Find
        </button>
      </div>
    </div>
  );
}
