import React from "react";
import "./PersonalArea.css";
import GeneralInfoHeader from "../../src/components/GeneralInfoHeader";
import ChargeInfo from "../../src/components/ChargeInfo";

const rows = [
  {
    id: 1,
    Location: "New York",
    ChargingRate: 5,
    Description: "Fast charging station",
    Price: "John Doe",
    price: "$10",
    picture:
      "https://upload.wikimedia.org/wikipedia/commons/4/4f/Electric_vehicle_charging_station%2C_San_Francisco.jpg",
  },
  {
    id: 2,
    Location: "Los Angeles",
    ChargingRate: 6,
    Description: "Supercharger",
    Price: "Jane Smith",
    price: "$15",
    picture:
      "https://upload.wikimedia.org/wikipedia/commons/a/af/Tesla_supercharger_LA.jpg",
  },
];
const PersonalArea: React.FC = () => {
  return (
    <div className="container">
      <div className="general-info">
        <GeneralInfoHeader
          name="Emilia Stewart Benjamin"
          gender="Female"
          age={27}
          Email="example@gmail.com"
          Phone="053-1222-333"
        />
      </div>
      <div className="charge-info">
        <ChargeInfo rows={rows} />
      </div>
    </div>
  );
};

export default PersonalArea;
