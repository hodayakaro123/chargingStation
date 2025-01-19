import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Box,
  Input,
} from "@mui/material";
import "./ManageChargingStations.css";

interface ChargeStation {
  chargeId: number;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  phone: string;
}

export default function ManageChargeStations() {
  const [chargeStations, setChargeStations] = useState<ChargeStation[]>([
    {
      chargeId: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      location: "123 Main St",
      phone: "123-456-7890",
    },
    {
      chargeId: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      location: "456 Oak St",
      phone: "234-567-8901",
    },
    {
      chargeId: 3,
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@example.com",
      location: "789 Elm St",
      phone: "345-678-9012",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editChargeStation, setEditChargeStation] = useState<number | null>(
    null
  );
  const [editedData, setEditedData] = useState<ChargeStation | null>(null);

  const filterChargeStations = () => {
    return chargeStations.filter(
      (station) =>
        station.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${station.firstName} ${station.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  };

  const deleteChargeStation = (chargeId: number) => {
    setChargeStations(
      chargeStations.filter((station) => station.chargeId !== chargeId)
    );
  };

  const handleEditChargeStation = (station: ChargeStation) => {
    setEditChargeStation(station.chargeId);
    setEditedData(station);
  };

  const handleSaveEdit = () => {
    if (editedData) {
      setChargeStations(
        chargeStations.map((station) =>
          station.chargeId === editedData.chargeId ? { ...editedData } : station
        )
      );
      setEditChargeStation(null);
      setEditedData(null);
    }
  };

  const handleCancelEdit = () => {
    setEditChargeStation(null);
    setEditedData(null);
  };

  const handleChange = (field: keyof ChargeStation, value: string) => {
    if (editedData) {
      setEditedData({
        ...editedData,
        [field]: value,
      });
    }
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#333" }}
      >
        Manage All Charging Stations
      </Typography>

      <TextField
        label="Search by location, email, or owner's name"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          marginBottom: 2,
          backgroundColor: "#fff",
          borderRadius: 1,
        }}
      />

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          height: "200px",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              position: "sticky",
              top: "0",
              zIndex: 1,
            }}
          >
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Charge Id
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Owner's Name
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Location
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Phone
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterChargeStations().map((station) => (
              <TableRow
                key={station.chargeId}
                sx={{ "&:hover": { backgroundColor: "#f1f1f1" } }}
              >
                <TableCell>
                  {editChargeStation === station.chargeId ? (
                    <Input
                      value={editedData?.chargeId}
                      onChange={(e) => handleChange("chargeId", e.target.value)}
                      sx={{ marginBottom: 1 }}
                    />
                  ) : (
                    station.chargeId
                  )}
                </TableCell>
                <TableCell>
                  {editChargeStation === station.chargeId ? (
                    <Box>
                      <Input
                        value={editedData?.firstName}
                        onChange={(e) =>
                          handleChange("firstName", e.target.value)
                        }
                        sx={{ marginBottom: 1 }}
                      />
                      <Input
                        value={editedData?.lastName}
                        onChange={(e) =>
                          handleChange("lastName", e.target.value)
                        }
                        sx={{ marginBottom: 1 }}
                      />
                    </Box>
                  ) : (
                    `${station.firstName} ${station.lastName}`
                  )}
                </TableCell>
                <TableCell>
                  {editChargeStation === station.chargeId ? (
                    <Input
                      value={editedData?.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      sx={{ marginBottom: 1 }}
                    />
                  ) : (
                    station.email
                  )}
                </TableCell>
                <TableCell>
                  {editChargeStation === station.chargeId ? (
                    <Input
                      value={editedData?.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      sx={{ marginBottom: 1 }}
                    />
                  ) : (
                    station.location
                  )}
                </TableCell>
                <TableCell>
                  {editChargeStation === station.chargeId ? (
                    <Input
                      value={editedData?.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      sx={{ marginBottom: 1 }}
                    />
                  ) : (
                    station.phone
                  )}
                </TableCell>
                <TableCell>
                  {editChargeStation === station.chargeId ? (
                    <div className="buttun">
                      <button onClick={handleSaveEdit} className="schedule-btn">
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="schedule-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="buttun">
                      <button
                        onClick={() => handleEditChargeStation(station)}
                        className="schedule-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteChargeStation(station.chargeId)}
                        className="schedule-btn"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
