import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import "./ActivityHistory.css";

type Status = "Pending" | "Approved" | "Declined";

interface Booking {
  _id: string;
  Date: string;
  StartTime: string;
  EndTime: string;
  Location: string;
  Status: Status;
  chargerId: string;
  chargerPicture?: string; 
}

const statusStyles: Record<Status, { backgroundColor: string; color: string }> = {
  Pending: { backgroundColor: "#FFA500", color: "white" },
  Approved: { backgroundColor: "#28a745", color: "white" },
  Declined: { backgroundColor: "#dc3545", color: "white" },
};

export default function ActivityHistory() {
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`http://localhost:3000/bookings/getBookingByUserId/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();

        const updatedBookings = await Promise.all(
          data.map(async (booking: Booking) => {
            const chargerResponse = await fetch(`http://localhost:3000/addChargingStation/getChargerById/${booking.chargerId}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json",
              },
            });

            if (!chargerResponse.ok) {
              throw new Error("Failed to fetch charger location");
            }

            const chargerData = await chargerResponse.json();
            console.log(chargerData.chargingStation.location);
            return {
              ...booking,
              Location: chargerData.chargingStation.location,
              chargerPicture: chargerData.chargingStation.picture, 
            };
          })
        );

        setRows(updatedBookings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  if (loading) {
    return <Typography>Loading bookings...</Typography>;
  }

  return (
    <div className="activity-history-container">
      <Typography variant="h5" className="table-title">
        Activity History
      </Typography>
      <TableContainer component={Paper} className="table-container">
        <Table stickyHeader>
          <TableHead>
            <TableRow className="table-header-row">
              <TableCell className="table-header-cell">Date</TableCell>
              <TableCell className="table-header-cell">Start Time</TableCell>
              <TableCell className="table-header-cell">End Time</TableCell>
              <TableCell className="table-header-cell">Location</TableCell>
              <TableCell className="table-header-cell">Picture</TableCell> {}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row._id} className="table-row">
                <TableCell className="table-cell">{new Date(row.Date).toLocaleDateString()}</TableCell>
                <TableCell className="table-cell">{new Date(row.StartTime).toLocaleTimeString()}</TableCell>
                <TableCell className="table-cell">{new Date(row.EndTime).toLocaleTimeString()}</TableCell>
                <TableCell className="table-cell">{row.Location}</TableCell>
                <TableCell className="table-cell">
                  {row.chargerPicture ? (
                    <img
                      src={`http://localhost:3000${row.chargerPicture}`}
                      alt="Charging Station"
                      style={{
                        width: "150px",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    />
                  ) : (
                    <Typography>No Picture Available</Typography>
                  )}
                </TableCell> {}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
