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

type ChargeInfoProps = {
  rows: {
    id: number;
    Location: string;
    ChargingRate: number;
    Description: string;
    Price: string;
    picture: string;
  }[];
};

export default function ChargeInfo({ rows }: ChargeInfoProps) {
  const [editableRow, setEditableRow] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});

  const handleEditClick = (id: number) => {
    setEditableRow(id);
    const row = rows.find((row) => row.id === id);
    setEditData(row);
  };

  const handleSaveClick = () => {
    // Logic to save the edited data
    setEditableRow(null);
  };

  const handleCancelClick = () => {
    setEditableRow(null);
    setEditData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData((prev: any) => ({
          ...prev,
          picture: reader.result as string,
        }));
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
                <TableCell className="table-cell">
                  {editableRow === row.id ? (
                    <TextField
                      name="Location"
                      value={editData.Location}
                      onChange={handleChange}
                      fullWidth
                    />
                  ) : (
                    row.Location
                  )}
                </TableCell>
                <TableCell className="table-cell">
                  {editableRow === row.id ? (
                    <TextField
                      name="ChargingRate"
                      value={editData.ChargingRate}
                      onChange={handleChange}
                      fullWidth
                    />
                  ) : (
                    row.ChargingRate
                  )}
                </TableCell>
                <TableCell className="table-cell">
                  {editableRow === row.id ? (
                    <TextField
                      name="Description"
                      value={editData.Description}
                      onChange={handleChange}
                      fullWidth
                    />
                  ) : (
                    row.Description
                  )}
                </TableCell>
                <TableCell className="table-cell">
                  {editableRow === row.id ? (
                    <TextField
                      name="Price"
                      value={editData.Price}
                      onChange={handleChange}
                      fullWidth
                    />
                  ) : (
                    row.Price
                  )}
                </TableCell>
                <TableCell className="table-cell">
                  {editableRow === row.id ? (
                    <Box>
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        fullWidth
                        className="file-upload-input"
                      />
                      {editData.picture && (
                        <img
                          src={editData.picture}
                          alt="New Charging Station"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            marginTop: "10px",
                          }}
                        />
                      )}
                    </Box>
                  ) : (
                    <img
                      src={row.picture}
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
