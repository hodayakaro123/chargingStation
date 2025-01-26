import React, { useState } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import "./RecivedBooking.css";

interface Booking {
  id: string;
  customerName: string;
  location: string;
  date: string;
  price: string;
  status: string;
}

const ReceivedBooking: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "1",
      customerName: "John Doe",
      location: "New York",
      date: "2025-01-25",
      price: "$100",
      status: "pending",
    },
    {
      id: "2",
      customerName: "Jane Smith",
      location: "Los Angeles",
      date: "2025-01-26",
      price: "$120",
      status: "confirmed",
    },
    {
      id: "3",
      customerName: "Michael Brown",
      location: "Chicago",
      date: "2025-01-27",
      price: "$80",
      status: "rejected",
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleStatusChange = async (id: string, status: string) => {
    setLoading(true);

    try {
      // Simulate API update call with a delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === id ? { ...booking, status } : booking
        )
      );

      alert(
        `Booking ${
          status === "confirmed" ? "confirmed" : "rejected"
        } successfully`
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to update booking status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="received-booking-container">
      <h3>Received Bookings</h3>
      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings received yet.</p>
      ) : (
        <table className="booking-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Location</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.customerName}</td>
                <td>{booking.location}</td>
                <td>{booking.date}</td>
                <td>{booking.price}</td>
                <td
                  className={`status ${
                    booking.status === "pending"
                      ? "status-pending"
                      : booking.status === "confirmed"
                      ? "status-confirmed"
                      : "status-rejected"
                  }`}
                >
                  {booking.status === "confirmed" && (
                    <AiOutlineCheckCircle className="status-icon confirmed" />
                  )}
                  {booking.status === "rejected" && (
                    <AiOutlineCloseCircle className="status-icon rejected" />
                  )}
                  {booking.status === "pending" && "Pending"}
                </td>
                <td>
                  {booking.status === "pending" && (
                    <div className="action-buttons">
                      <button
                        onClick={() =>
                          handleStatusChange(booking.id, "confirmed")
                        }
                        disabled={loading}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(booking.id, "rejected")
                        }
                        disabled={loading}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReceivedBooking;
