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
import "./ManageUsers.css";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      address: "123 Main St",
      phone: "123-456-7890",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      address: "456 Oak St",
      phone: "234-567-8901",
    },
    {
      id: 3,
      firstName: "Alice",
      lastName: "Johnson",
      email: "",
      address: "789 Elm St",
      phone: "345-678-9012",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editUser, setEditUser] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<User | null>(null);

  const filterUsers = () => {
    return users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
    );
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleEditUser = (user: User) => {
    setEditUser(user.id);
    setEditedData(user);
  };

  const handleSaveEdit = () => {
    if (editedData) {
      setUsers(
        users.map((user) =>
          user.id === editedData.id ? { ...editedData } : user
        )
      );
      setEditUser(null);
      setEditedData(null);
    }
  };

  const handleCancelEdit = () => {
    setEditUser(null);
    setEditedData(null);
  };

  const handleChange = (field: keyof User, value: string) => {
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
        Control All Users
      </Typography>

      <TextField
        label="Search by name or phone"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ marginBottom: 2, backgroundColor: "#fff", borderRadius: 1 }}
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
                Name
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Address
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
            {filterUsers().map((user) => (
              <TableRow
                key={user.id}
                sx={{ "&:hover": { backgroundColor: "#f1f1f1" } }}
              >
                <TableCell>
                  {editUser === user.id ? (
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
                    `${user.firstName} ${user.lastName}`
                  )}
                </TableCell>
                <TableCell>
                  {editUser === user.id ? (
                    <Input
                      value={editedData?.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      sx={{ marginBottom: 1 }}
                    />
                  ) : (
                    user.email
                  )}
                </TableCell>
                <TableCell>
                  {editUser === user.id ? (
                    <Input
                      value={editedData?.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      sx={{ marginBottom: 1 }}
                    />
                  ) : (
                    user.address
                  )}
                </TableCell>
                <TableCell>
                  {editUser === user.id ? (
                    <Input
                      value={editedData?.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      sx={{ marginBottom: 1 }}
                    />
                  ) : (
                    user.phone
                  )}
                </TableCell>
                <TableCell className="tableCell">
                  {editUser === user.id ? (
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
                        onClick={() => handleEditUser(user)}
                        className="schedule-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
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
