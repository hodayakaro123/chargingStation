import React, { useState, ChangeEvent, FormEvent } from "react";
import "./Booking.css";
import ReviewCard from "../../src/components/ReviewCard/ReviewCard";

export default function Booking() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    message: "",
    dateTime: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Booking successfully submitted!");
  };

  return (
    <div className="booking-form-container">
      <h2 className="booking-form-title">Charging Station Booking</h2>
      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="firstName">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="lastName">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="contactNumber">
            Contact Number
          </label>
          <input
            type="tel"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="form-textarea"
          ></textarea>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="dateTime">
            Date and Time
          </label>
          <input
            type="datetime-local"
            id="dateTime"
            name="dateTime"
            value={formData.dateTime}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
      <div className="review-container">
        <ReviewCard
          userName="יוסי כהן"
          location="תל אביב"
          reviewText="עמדת טעינה מצוינת! תהליך מהיר ונוח."
          rating={4}
          date="19/01/2025"
          avatar="https://randomuser.me/api/portraits/men/1.jpg"
        />
      </div>
    </div>
  );
}
