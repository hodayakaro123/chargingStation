"use client";

import React, { useState } from "react";
import "./generalinfoheader.css";

type GeneralInfoHeaderProps = {
  name: string;
  gender: string;
  age: number;
  Email: string;
  Phone: string;
};

export default function GeneralInfoHeader({
  name: initialName,
  Email: initialEmail,
  Phone: initialPhone,
}: GeneralInfoHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [firstName, setFirstName] = useState(initialName.split(" ")[0]);
  const [lastName, setLastName] = useState(initialName.split(" ")[1] || "");

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const saveChanges = () => {
    setName(`${firstName} ${lastName}`);
    setIsEditing(false);
  };

  return (
    <div className="card-container">
      {!isEditing ? (
        <>
          <div className="patient-details">
            <h2>{name}</h2>
          </div>

          <div className="info-section">
            <p className="label">Email</p>
            <p className="value">{initialEmail}</p>
            <p className="label" style={{ marginTop: "12px" }}>
              Phone
            </p>
            <p className="value">{phone}</p>
          </div>

          <div className="actions">
            <button className="schedule-btn" onClick={toggleEditMode}>
              Edit
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="patient-details">
            <label className="label">First Name</label>
            <input
              type="text"
              className="edit-input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
            />
            <label className="label">Last Name</label>
            <input
              type="text"
              className="edit-input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
            />
          </div>

          <div className="info-section">
            <p className="label">Email</p>
            <p className="value">{initialEmail}</p> {/* אי אפשר לערוך */}
            <label className="label" style={{ marginTop: "12px" }}>
              Phone
            </label>
            <input
              type="text"
              className="edit-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div className="actions">
            <button className="schedule-btn" onClick={saveChanges}>
              Save
            </button>
            <button className="schedule-btn" onClick={toggleEditMode}>
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
