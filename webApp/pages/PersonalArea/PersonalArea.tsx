import React, { useState } from "react";
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
  const [carBrand, setCarBrand] = useState<string>("");
  const [carYear, setCarYear] = useState<string>("");
  const [carModel, setCarModel] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleCarBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCarBrand(e.target.value);
  };

  const handleCarYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCarYear(e.target.value);
  };

  const handleCarModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCarModel(e.target.value);
  };

  const handleUpdateCarInfo = async () => {
    if (!carBrand || !carYear || !carModel) {
      alert("Please enter all car details.");
      return;
    }

    const currentYear = new Date().getFullYear();
    if (parseInt(carYear) > currentYear) {
      alert("The car year cannot be greater than the current year.");
      return;
    }

    setLoading(true);

    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User ID is required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/gemini/generate-content",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            carBrand,
            carYear,
            carModel,
            userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const result = await response.json();
      console.log(result);

      alert("Car information sent successfully");

      setLoading(false);
    } catch (error) {
      console.error("Error sending car information:", error);
      alert("Failed to send car information");
      setLoading(false);
    }
  };

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

      <div className="car-model-section">
        <h3>Car Information</h3>
        <div className="input-group">
          <input
            type="text"
            value={carBrand}
            onChange={handleCarBrandChange}
            placeholder="Enter your car brand"
          />
          <input
            type="number"
            value={carYear}
            onChange={handleCarYearChange}
            placeholder="Enter your car year"
            min="1900"
            max={new Date().getFullYear()}
            step="1"
          />
          <input
            type="text"
            value={carModel}
            onChange={handleCarModelChange}
            placeholder="Enter your car model"
          />
        </div>
        <button onClick={handleUpdateCarInfo} disabled={loading}>
          {loading ? "Sending..." : "Send Car Information"}
        </button>
      </div>
    </div>
  );
};

export default PersonalArea;