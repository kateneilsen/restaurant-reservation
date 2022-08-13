import React, { useState } from "react";
import useQuery from "../utils/useQuery";

export default function Search() {
  const [searchField, setSearchField] = useState("");
  const query = useQuery();
  return (
    <div class="input-group">
      <div class="form-outline">
        <input type="search" id="form1" class="form-control" />
        <label class="form-label" for="form1">
          Enter a customer's phone number
        </label>
      </div>
      <button type="button" class="btn btn-primary">
        <i class="fas fa-search"></i>
      </button>
    </div>
  );
}
