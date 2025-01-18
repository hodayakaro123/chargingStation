import React from "react";
import ManageUsers from "../../src/components/Admin/ManageUsers";
export default function Admin() {
  return (
    <div className="admin-container">
      <div className="manageUsers">
        <ManageUsers />
      </div>
      <div className="manageStations">
        <h2>Manage Stations</h2>
      </div>
    </div>
  );
}
