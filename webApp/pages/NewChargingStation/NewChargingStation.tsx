import React from "react";
import "./NewChargingStation.css"; // Import the CSS file

export default function NewChargingStation() {
  return (
    <div className="newChargingPage">
      <div className="form-card">
        <form className="charging-form">
          <h1>Add a New Charging Station</h1>

          <div className="input-group">
            <input type="text" placeholder="Position location" />
            <input type="text" placeholder="Charging rate" />
            <input type="text" placeholder="Price" />
            <input type="text" placeholder="Description" />
          </div>

          <button type="submit" className="add-btn">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
