import React from "react";
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

const rows = [
  {
    id: 1,
    Date: "27/05/2001",
    Time: 29,
    location: "Houston",
    cost: "$30",
    more: "Details",
    status: "Pending" as Status,
  },
  {
    id: 2,
    Date: "17/01/2023",
    Time: 31,
    location: "Dallas",
    cost: "$14",
    more: "Details",
    status: "Approved" as Status,
  },
  {
    id: 3,
    Date: "09/11/2022",
    Time: 33,
    location: "Seattle",
    cost: "$22",
    more: "Details",
    status: "Declined" as Status,
  },
  {
    id: 4,
    Date: "03/07/2021",
    Time: 35,
    location: "Portland",
    cost: "$17",
    more: "Details",
    status: "Pending" as Status,
  },
  {
    id: 5,
    Date: "21/04/2020",
    Time: 37,
    location: "Las Vegas",
    cost: "$28",
    more: "Details",
    status: "Approved" as Status,
  },
  {
    id: 6,
    Date: "11/02/2023",
    Time: 39,
    location: "Denver",
    cost: "$11",
    more: "Details",
    status: "Pending" as Status,
  },
  {
    id: 7,
    Date: "01/12/2022",
    Time: 41,
    location: "Phoenix",
    cost: "$19",
    more: "Details",
    status: "Declined" as Status,
  },
  {
    id: 8,
    Date: "13/10/2021",
    Time: 43,
    location: "San Diego",
    cost: "$23",
    more: "Details",
    status: "Approved" as Status,
  },
];

const statusStyles: Record<Status, { backgroundColor: string; color: string }> =
  {
    Pending: {
      backgroundColor: "#FFA500",
      color: "white",
    },
    Approved: {
      backgroundColor: "#28a745",
      color: "white",
    },
    Declined: {
      backgroundColor: "#dc3545",
      color: "white",
    },
  };

export default function ActivityHistory() {
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
              <TableCell className="table-header-cell">Time</TableCell>
              <TableCell className="table-header-cell">Location</TableCell>
              <TableCell className="table-header-cell">Cost</TableCell>
              <TableCell className="table-header-cell">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="table-row">
                <TableCell className="table-cell">{row.Date}</TableCell>
                <TableCell className="table-cell">{row.Time}</TableCell>
                <TableCell className="table-cell">{row.location}</TableCell>
                <TableCell className="table-cell">{row.cost}</TableCell>
                <TableCell
                  className={`table-cell status-cell ${row.status}`}
                  style={{
                    backgroundColor: statusStyles[row.status]?.backgroundColor,
                    color: statusStyles[row.status]?.color,
                    padding: "12px 15px",
                    width: "30px",
                    height: "10px",
                    borderRadius: "10px",
                    textAlign: "center",
                  }}
                >
                  {row.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
