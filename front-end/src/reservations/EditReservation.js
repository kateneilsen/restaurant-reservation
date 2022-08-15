import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation, updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

export default function EditReservation() {
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
  const { reservationId } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    async function loadData() {
      try {
        if (reservationId) {
          const response = await readReservation(
            reservationId,
            abortController.signal
          );
          setFormValues(response);
        } else {
          setFormValues({ ...initialState });
        }
      } catch (error) {
        setErrors(error);
      }
    }
    loadData();
    return () => abortController.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationId]);

  async function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      await updateReservation(formValues, abortController.signal);
      history.push(`/dashboard?date=${formValues.reservation_date}`);
    } catch (error) {
      setErrors(error);
    }
    return () => abortController.abort();
  }

  const handleNumber = ({ target }) => {
    setFormValues({ ...formValues, [target.name]: Number(target.value) });
  };

  const changeHandler = ({ target }) => {
    setFormValues({ ...formValues, [target.name]: target.value });
  };

  return (
    <div>
      <h3>Edit Reservation</h3>
      <ErrorAlert errors={errors} />
      <ReservationForm
        submitHandler={submitHandler}
        handleNumber={handleNumber}
        changeHandler={changeHandler}
        formValues={formValues}
        history={history}
      />
    </div>
  );
}
