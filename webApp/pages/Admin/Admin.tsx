import "./Admin.css";
import ManageUsers from "../../src/components/Admin/ManageUsers";
import ManageChargeStations from "../../src/components/Admin/ManageChargingStations";
export default function Admin() {
  return (
    <div className="admin-container">
      <div className="manageUsers">
        <ManageUsers />
      </div>
      <div className="manageStations">
        <ManageChargeStations />
      </div>
    </div>
  );
}
