import React, { useState } from "react";
import "./NewChargingStation.css";

export default function NewChargingStation() {
  const [location, setLocation] = useState("");
  const [chargingRate, setChargingRate] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const authToken = localStorage.getItem("authToken");
    const refreshToken = localStorage.getItem("refreshToken");
    console.log("authToken:", authToken);
    console.log("refreshToken:", refreshToken);
    if (!authToken) {
      setError("You must be logged in to add a charging station.");
      return;
    }

    if (!location || !chargingRate || !price || !description) {
      setError("All fields are required.");
      return;
    }

    const chargerData = {
      location,
      chargingRate,
      price,
      description,
    };


    try {

      const response = await fetch("http://localhost:3000/addChargingStation/addCharger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(chargerData), 
      });
      

      if (!response.ok) {
        throw new Error("Failed to add charging station.");
      }

      setSuccessMessage("Charging station added successfully!");
      setError("");
      setLocation("");
      setChargingRate("");
      setPrice("");
      setDescription("");
      setSelectedImage(null);
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while adding the charging station.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="newChargingPage">
      <div className="form-card">
        <form className="charging-form" onSubmit={handleSubmit}>
          <h1>Add a New Charging Station</h1>

          <div className="input-group">
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <input
              type="text"
              placeholder="Charging rate"
              value={chargingRate}
              onChange={(e) => setChargingRate(e.target.value)}
            />
            <input
              type="text"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="image-upload">
              <label htmlFor="file-upload">Choose an Image</label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {selectedImage && (
                <div>
                  <p>Selected image: {selectedImage.name}</p>
                </div>
              )}
            </div>
          </div>

          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}

          <button type="submit" className="add-btn">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
