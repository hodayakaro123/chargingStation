import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const rows = [
  {
    id: 1,
    name: "John Doe",
    age: 30,
    location: "New York",
    cost: "$10",
    more: "more",
  },
  { id: 2, name: "Jane Smith", age: 25, location: "New York", cost: "$10" },
  { id: 3, name: "Alice Johnson", age: 35 },
  { id: 1, name: "John Doe", age: 30 },
  { id: 2, name: "Jane Smith", age: 25 },
  { id: 3, name: "Alice Johnson", age: 35 },
];

export default function ActivityHistory() {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Cost</TableCell>
            <TableCell>More</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.age}</TableCell>
              <TableCell>{row.location}</TableCell>
              <TableCell>{row.cost}</TableCell>
              <TableCell>{row.more}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
