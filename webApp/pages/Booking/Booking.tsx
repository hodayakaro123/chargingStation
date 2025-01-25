import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Booking.css";
import ReviewCard from "../../src/components/ReviewCard/ReviewCard";

export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const charger = location.state?.charger;

  const [formData, setFormData] = useState({
    chargerId: charger?._id || "",
    firstName: "",
    lastName: "",
    contactNumber: "",
    message: "",
    date: "",
    startTime: "",
    endTime: "",
    userId: localStorage.getItem("userId") || "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!charger) {
      navigate("/Home", { state: { message: "You have to pick a charger!" } });
    }
  }, [charger, navigate]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const contactNumberRegex = /^\d+$/;
    if (!contactNumberRegex.test(formData.contactNumber)) {
      setError("Contact number must contain only numbers.");
      return;
    }

    const startTime = new Date(`${formData.date}T${formData.startTime}:00`);
    const endTime = new Date(`${formData.date}T${formData.endTime}:00`);
  
    if (startTime >= endTime) {
      setError("Start time must be earlier than end time.");
      return;
    }
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:3000/bookings/bookCharger", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking.");
      }

      setSuccessMessage("Booking successfully submitted!");
      setFormData({
        chargerId: charger._id || "",
        firstName: "",
        lastName: "",
        contactNumber: "",
        message: "",
        date: "",
        startTime: "",
        endTime: "",
        userId: localStorage.getItem("userId") || "",
      });
      navigate("/ActivityHistory", { state: { message: "Booking submitted!" } });
    } catch (error) {
      console.error(error);
      setError("An error occurred while submitting the booking.");
    }
  };

  return (
    <div className="booking-page-container">
      <div className="booking-row">
        <div className="booking-form-container">
          <h2 className="booking-form-title">Charging Station Booking</h2>
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-row">
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
            </div>

            <div className="form-row">
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
              <label className="form-label" htmlFor="date">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="startTime">
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="endTime">
                  End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}

            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>

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
    </div>
  );
}
