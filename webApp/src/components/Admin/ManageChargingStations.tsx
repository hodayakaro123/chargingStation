import { useState, useEffect } from "react";
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
  revenue: number; // New field for money earned
}

export default function ManageChargeStations() {
  const [chargeStations, setChargeStations] = useState<ChargeStation[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editChargeStation, setEditChargeStation] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchChargeStations = async () => {
      const userId = localStorage.getItem("userId");
      const accessToken = localStorage.getItem("accessToken");

      if (!userId) {
        alert("User ID is required to fetch charging stations");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/admin/getAllChargers`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch charge stations");
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        if (data.chargers && Array.isArray(data.chargers)) {
          const fetchedStations = data.chargers.map(
            (station: ChargeStation) => ({
              chargeId: station.chargeId,
              firstName: station.firstName,
              lastName: station.lastName,
              email: station.email,
              location: station.location,
              phone: station.phone,
              revenue: station.revenue || 0, // Default revenue to 0 if missing
            })
          );

          setChargeStations(fetchedStations);
        } else {
          console.error(
            "Expected an array under 'chargers', but received:",
            data
          );
          alert(
            "Error: Expected an array of charge stations under 'chargers'."
          );
        }
      } catch (error) {
        console.error("Error fetching charge stations:", error);
        alert("Failed to fetch charge stations");
      }
    };

    fetchChargeStations();
  }, []);

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
    setChargeStations((prevStations) =>
      prevStations.filter((station) => station.chargeId !== chargeId)
    );
  };

  const handleEditChargeStation = (chargeId: number) => {
    setEditChargeStation(chargeId);
  };

  const handleSaveEdit = () => {
    setEditChargeStation(null);
  };

  const handleCancelEdit = () => {
    setEditChargeStation(null);
  };

  const handleChange = (
    chargeId: number,
    field: keyof ChargeStation,
    value: string
  ) => {
    setChargeStations((prevStations) =>
      prevStations.map((station) =>
        station.chargeId === chargeId
          ? {
              ...station,
              [field]: field === "revenue" ? parseFloat(value) : value,
            }
          : station
      )
    );
  };

  const filteredChargeStations = filterChargeStations();
  const totalChargeStations = filteredChargeStations.length;

  // Calculate total revenue
  const totalRevenue = filteredChargeStations.reduce(
    (sum, station) => sum + station.revenue,
    0
  );

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#333" }}
      >
        Manage All Charging Stations
      </Typography>

      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ marginBottom: 1, fontWeight: "medium", color: "#555" }}
      >
        Total Charging Stations: {totalChargeStations}
      </Typography>

      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ marginBottom: 2, fontWeight: "medium", color: "#555" }}
      >
        Total Money Earned: ${totalRevenue.toFixed(2)}
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
                Revenue Earned
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredChargeStations.map((station) => (
              <TableRow
                key={station.chargeId}
                sx={{ "&:hover": { backgroundColor: "#f1f1f1" } }}
              >
                <TableCell>{station.chargeId}</TableCell>
                <TableCell>{`${station.firstName} ${station.lastName}`}</TableCell>
                <TableCell>{station.email}</TableCell>
                <TableCell>{station.location}</TableCell>
                <TableCell>{station.phone}</TableCell>
                <TableCell>
                  {editChargeStation === station.chargeId ? (
                    <Input
                      value={station.revenue}
                      onChange={(e) =>
                        handleChange(
                          station.chargeId,
                          "revenue",
                          e.target.value
                        )
                      }
                      sx={{ marginBottom: 1 }}
                      type="number"
                    />
                  ) : (
                    `$${station.revenue.toFixed(2)}`
                  )}
                </TableCell>
                <TableCell>
                  {editChargeStation === station.chargeId ? (
                    <div>
                      <button onClick={handleSaveEdit}>Save</button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() =>
                          handleEditChargeStation(station.chargeId)
                        }
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteChargeStation(station.chargeId)}
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
