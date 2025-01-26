import React, { useState, useEffect } from "react";
import "./PersonalArea.css";
import GeneralInfoHeader from "../../src/components/GeneralInfoHeader";
import ChargeInfo from "../../src/components/ChargeInfo";
import ReceivedBooking from "../../src/components/RecivedBooking";

interface User {
  firstName: string;
  lastName: string;
  picture: string;
  email: string;
}

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
  _id: string;
}

interface ChargeInfoRow {
  id: number;
  Location: string;
  ChargingRate: number;
  Description: string;
  Price: string;
  picture: string;
  userId: string;
}

const PersonalArea: React.FC = () => {
  const [carBrand, setCarBrand] = useState<string>("");
  const [carYear, setCarYear] = useState<string>("");
  const [carModel, setCarModel] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<ChargeInfoRow[]>([]);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      const accessToken = localStorage.getItem("accessToken");

      if (!userId || !accessToken) {
        alert("User ID and Access Token are required");
        return;
      }

      try {
        const userResponse = await fetch(
          `http://localhost:3000/auth/getUserById/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user information");
        }

        const userData = await userResponse.json();
        setUserInfo({
          firstName: userData.firstName,
          lastName: userData.lastName,
          picture: userData.picture,
          email: userData.email,
        });
      } catch (error) {
        console.error("Error fetching user information:", error);
        alert("Failed to fetch user information");
      }

      try {
        const chargingResponse = await fetch(
          `http://localhost:3000/addChargingStation/getChargersByUserId/chargers/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!chargingResponse.ok) {
          throw new Error("Failed to fetch charging stations");
        }

        const chargingData = await chargingResponse.json();
        const chargers = chargingData.chargers.map(
          (charger: Charger, index: number) => ({
            id: `${charger._id}-${index}`,
            Location: charger.location || "Unknown",
            ChargingRate: charger.chargingRate || 0,
            Description: charger.description || "No description",
            Price: charger.price.toString(),
            picture: charger.picture || "",
            userId: charger.userId,
          })
        );

        setRows(chargers);
      } catch (error) {
        console.error("Error fetching charging stations:", error);
        alert("Failed to fetch charging stations");
      }
    };

    fetchData();
  }, []);

  const handleUpdateCarInfo = async () => {
    if (!carBrand || !carYear || !carModel) {
      alert("Please enter all car details.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/gemini/generate-content",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            carBrand,
            carYear,
            carModel,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      alert("Car information sent successfully");
    } catch (error) {
      console.error("Error sending car information:", error);
      alert("Failed to send car information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {userInfo && (
        <div className="general-info">
          <GeneralInfoHeader
            name={`${userInfo.firstName} ${userInfo.lastName}`}
            Email={userInfo.email}
            picturePath={userInfo.picture}
          />
        </div>
      )}

      <div className="charge-info">
        <ChargeInfo rows={rows} />
      </div>

      <div className="car-model-section">
        <h3>Car Information</h3>
        <div className="input-group">
          <input
            type="text"
            value={carBrand}
            onChange={(e) => setCarBrand(e.target.value)}
            placeholder="Car Brand"
          />
          <input
            type="number"
            value={carYear}
            onChange={(e) => setCarYear(e.target.value)}
            placeholder="Car Year"
            min="1900"
            max={new Date().getFullYear()}
          />
          <input
            type="text"
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
            placeholder="Car Model"
          />
        </div>
        <button onClick={handleUpdateCarInfo} disabled={loading}>
          {loading ? "Sending..." : "Send Car Info"}
        </button>
      </div>

      <div className="received-bookings">
        <ReceivedBooking />
      </div>
    </div>
  );
};

export default PersonalArea;
