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

const rows = [
  {
    id: 1,
    name: "John Doe",
    age: 30,
    location: "New York",
    cost: "$10",
    more: "Details",
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 25,
    location: "Los Angeles",
    cost: "$20",
    more: "Details",
  },
  {
    id: 3,
    name: "Alice Johnson",
    age: 35,
    location: "Chicago",
    cost: "$15",
    more: "Details",
  },
  {
    id: 4,
    name: "Michael Brown",
    age: 40,
    location: "Miami",
    cost: "$18",
    more: "Details",
  },
  {
    id: 5,
    name: "Sarah Wilson",
    age: 28,
    location: "San Francisco",
    cost: "$25",
    more: "Details",
  },
  {
    id: 6,
    name: "David Lee",
    age: 32,
    location: "Boston",
    cost: "$12",
    more: "Details",
  },
  {
    id: 9,
    Date: "27/05/2001",
    Time: 29,
    location: "Houston",
    cost: "$30",
    more: "Details",
  },
  {
    id: 10,
    Date: "17/01/2023",
    Time: 31,
    location: "Dallas",
    cost: "$14",
    more: "Details",
  },
  {
    id: 11,
    Date: "09/11/2022",
    Time: 33,
    location: "Seattle",
    cost: "$22",
    more: "Details",
  },
  {
    id: 12,
    Date: "03/07/2021",
    Time: 35,
    location: "Portland",
    cost: "$17",
    more: "Details",
  },
  {
    id: 13,
    Date: "21/04/2020",
    Time: 37,
    location: "Las Vegas",
    cost: "$28",
    more: "Details",
  },
  {
    id: 14,
    Date: "11/02/2023",
    Time: 39,
    location: "Denver",
    cost: "$11",
    more: "Details",
  },
  {
    id: 15,
    Date: "01/12/2022",
    Time: 41,
    location: "Phoenix",
    cost: "$19",
    more: "Details",
  },
  {
    id: 16,
    Date: "13/10/2021",
    Time: 43,
    location: "San Diego",
    cost: "$23",
    more: "Details",
  },
  {
    id: 17,
    Date: "25/08/2020",
    Time: 45,
    location: "Philadelphia",
    cost: "$26",
    more: "Details",
  },
  {
    id: 18,
    Date: "07/06/2019",
    Time: 47,
    location: "Atlanta",
    cost: "$13",
    more: "Details",
  },
  {
    id: 19,
    Date: "19/04/2018",
    Time: 49,
    location: "Orlando",
    cost: "$21",
    more: "Details",
  },
  {
    id: 20,
    Date: "31/01/2017",
    Time: 51,
    location: "Austin",
    cost: "$16",
    more: "Details",
  },
];

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
              <TableCell className="table-header-cell">More</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="table-row">
                <TableCell className="table-cell">{row.Date}</TableCell>
                <TableCell className="table-cell">{row.Time}</TableCell>
                <TableCell className="table-cell">{row.location}</TableCell>
                <TableCell className="table-cell">{row.cost}</TableCell>
                <TableCell className="table-cell more-column">
                  {row.more}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
