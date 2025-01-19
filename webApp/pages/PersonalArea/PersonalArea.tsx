import React, { useState, useEffect } from "react";
import "./PersonalArea.css";
import GeneralInfoHeader from "../../src/components/GeneralInfoHeader";
import ChargeInfo from "../../src/components/ChargeInfo";


interface Comment {
  text: string;
}

interface Charger {
  location?: string;
  latitude?: number;
  longitude?: number;
  price: number;
  rating?: number;
  chargingRate?: number;
  picture?: string;
  description?: string;
  comments: Comment[];
  userId: string;
}

const PersonalArea: React.FC = () => {
  const [carBrand, setCarBrand] = useState<string>("");
  const [carYear, setCarYear] = useState<string>("");
  const [carModel, setCarModel] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<Charger[]>([]);

  useEffect(() => {
    const fetchChargingStations = async () => {
      const userId = localStorage.getItem("userId");
      const accessToken = localStorage.getItem("accessToken");
      if (!userId) {
        alert("User ID is required");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/addChargingStation/getChargersByUserId/chargers/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      
        if (!response.ok) {
          throw new Error("Failed to fetch charging stations");
        }
      
        const data = await response.json();
        setRows(data.chargers); 
      } catch (error) {
        console.error("Error fetching charging stations:", error);
        alert("Failed to fetch charging stations");
      }
      
    };

    fetchChargingStations();
  }, []);

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
      const response = await fetch("http://localhost:3000/gemini/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          carBrand,
          carYear,
          carModel,
          userId,
        }),
      });

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
