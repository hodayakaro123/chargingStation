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
import "./ChargeInfo.css";

interface ChargerRow {
  id: number;
  Location: string;
  ChargingRate: number;
  Description: string;
  Price: string;
  picture: string;
  userId: string;
}

type ChargeInfoProps = {
  rows: ChargerRow[];
};

export default function ChargeInfo({ rows }: ChargeInfoProps) {
  const [editableRow, setEditableRow] = useState<number | null>(null);
  const [editData, setEditData] = useState<ChargerRow | null>(null);

  const handleEditClick = (id: number) => {
    setEditableRow(id);
    const row = rows.find((row) => row.id === id);
    if (row) setEditData(row);
  };

  const handleSaveClick = () => {
    setEditableRow(null);
    setEditData(null);
  };

  const handleCancelClick = () => {
    setEditableRow(null);
    setEditData(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData((prev) =>
          prev ? { ...prev, picture: reader.result as string } : prev
        );
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="charge-container">
      <TableContainer component={Paper} className="table-container">
        <Typography variant="h5" className="table-title">
          My Charging Stations
        </Typography>
        <Table stickyHeader className="without-title">
          <TableHead>
            <TableRow className="table-header-row">
              <TableCell className="table-header-cell">Location</TableCell>
              <TableCell className="table-header-cell">Charging Rate</TableCell>
              <TableCell className="table-header-cell">Description</TableCell>
              <TableCell className="table-header-cell">Price</TableCell>
              <TableCell className="table-header-cell">Picture</TableCell>
              <TableCell className="table-header-cell">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="table-row">
                {["Location", "ChargingRate", "Description", "Price"].map(
                  (field) => (
                    <TableCell key={field} className="table-cell">
                      {editableRow === row.id ? (
                        <TextField
                          name={field}
                          value={editData?.[field as keyof ChargerRow] || ""}
                          onChange={handleChange}
                          fullWidth
                        />
                      ) : (
                        row[field as keyof ChargerRow]
                      )}
                    </TableCell>
                  )
                )}
                <TableCell className="table-cell">
                  {editableRow === row.id ? (
                    <Box>
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        fullWidth
                        className="file-upload-input"
                      />
                      {editData?.picture && (
                        <img
                          src={`http://localhost:3000${row.picture}`}                           alt="Charging Station"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </Box>
                  ) : (
                    <img
                      src={`http://localhost:3000${row.picture}`} 
                      alt="Charging Station"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </TableCell>

                <TableCell className="table-cell">
                  {editableRow === row.id ? (
                    <Box
                      display="flex"
                      gap="16px"
                      justifyContent="space-around"
                    >
                      <button
                        onClick={handleSaveClick}
                        className="schedule-btn"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelClick}
                        className="schedule-btn"
                      >
                        Cancel
                      </button>
                    </Box>
                  ) : (
                    <button
                      onClick={() => handleEditClick(row.id)}
                      className="schedule-btn"
                    >
                      Edit
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
