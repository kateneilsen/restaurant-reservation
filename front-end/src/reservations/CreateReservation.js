import React, { useState } from "react";
import ReservationForm from "./ReservationForm";
import { createReservation } from "../utils/api";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";

export default function CreateReservation() {
  const initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };
  const [formValues, setFormValues] = useState({ ...initialState });
  const [errors, setErrors] = useState([]);
  const history = useHistory();

  const changeHandler = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  const handleNumber = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: Number(target.value),
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const controller = new AbortController();
    try {
      const response = await createReservation(formValues, controller.signal);
      history.push(`/dashboard?date=${formValues.reservation_date}`);
      return response;
    } catch (error) {
      setErrors(error);
    }
    return () => controller.abort();
  };

  return (
    <div className="m-4">
      <h1>Create Reservation</h1>
      <ErrorAlert errors={errors} />
      <ReservationForm
        submitHandler={submitHandler}
        changeHandler={changeHandler}
        handleNumber={handleNumber}
        formValues={formValues}
        history={history}
      />
    </div>
  );
}
