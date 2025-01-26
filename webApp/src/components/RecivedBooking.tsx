import React, { useState, useEffect } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import "./RecivedBooking.css";
import { Charger } from "../types/types";
import { Booking } from "../types/types";

interface ReceivedBookingProps {
  chargers: Charger[];
}

const ReceivedBooking: React.FC<ReceivedBookingProps> = ({ chargers }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedCharger, setSelectedCharger] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/bookings/updateBooking/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update booking status on the server");
      }

      const updatedBooking = await response.json();

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === id ? { ...booking, Status: newStatus } : booking
        )
      );

      alert(
        `Booking ${
          newStatus === "Confirmed" ? "confirmed" : "rejected"
        } successfully`
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to update booking status");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingsByChargerId = async (chargerId: string) => {
    setLoading(true);
    try {
      const bookingsResponse = await fetch(
        `http://localhost:3000/bookings/getBookingByChargerId/${chargerId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!bookingsResponse.ok) {
        throw new Error(`Failed to fetch bookings for charger ${chargerId}`);
      }

      const bookingsData = await bookingsResponse.json();
      setBookings(bookingsData);
      console.log(bookingsData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCharger) {
      fetchBookingsByChargerId(selectedCharger);
    }
  }, [selectedCharger]);

  const handleChargerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCharger(event.target.value);
  };

  return (
    <div className="received-booking-container">
      <h3>Received Bookings</h3>

      {/* Charger selection dropdown */}
      <div className="charger-selection">
        <label htmlFor="charger-select">Select Charger:</label>
        <select
          id="charger-select"
          value={selectedCharger}
          onChange={handleChargerChange}
        >
          <option value="">--Select a charger--</option>
          {chargers.map((charger) => (
            <option key={charger._id} value={charger.chargerId}>
              {charger.chargerId} {/* Display chargerId in dropdown */}
            </option>
          ))}
        </select>
      </div>

      {/* If no charger selected, show a message */}
      {!selectedCharger && <p>Please select a charger to view bookings.</p>}

      {selectedCharger && (
        <div className="booking-details">
          {loading ? (
            <p>Loading...</p>
          ) : bookings.length === 0 ? (
            <p>No bookings received yet.</p>
          ) : (
            <table className="booking-table">
              <thead>
                <tr>
                  <th>BookingId</th>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Contact Number</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.chargerId}</td>
                    <td>{new Date(booking.Date).toLocaleDateString()}</td>
                    <td>{new Date(booking.StartTime).toLocaleTimeString()}</td>
                    <td>{new Date(booking.StartTime).toLocaleTimeString()}</td>
                    <td>{booking.contactNumber}</td>
                    <td>{booking.Message}</td>
                    <td
                      className={`status ${
                        booking.Status === "Pending"
                          ? "status-pending"
                          : booking.Status === "Confirmed"
                          ? "status-confirmed"
                          : "status-rejected"
                      }`}
                    >
                      {booking.Status === "Confirmed" && (
                        <AiOutlineCheckCircle className="status-icon confirmed" />
                      )}
                      {booking.Status === "Rejected" && (
                        <AiOutlineCloseCircle className="status-icon rejected" />
                      )}
                      {booking.Status === "Pending" && "Pending"}
                    </td>
                    <td>
                      {(booking.Status === "Pending" ||
                        booking.Status === "Confirmed" ||
                        booking.Status === "Rejected") && (
                        <div className="action-buttons">
                          {booking.Status !== "Confirmed" && (
                            <button
                              onClick={() =>
                                handleStatusChange(booking._id, "Confirmed")
                              }
                              disabled={loading}
                            >
                              Confirm
                            </button>
                          )}
                          {booking.Status !== "Rejected" && (
                            <button
                              style={{ backgroundColor: "red" }}
                              onClick={() =>
                                handleStatusChange(booking._id, "Rejected")
                              }
                              disabled={loading}
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ReceivedBooking;
