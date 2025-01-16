import React, { useState } from "react";
import "./NewChargingStation.css";

export default function NewChargingStation() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  return (
    <div className="newChargingPage">
      <div className="form-card">
        <form className="charging-form">
          <h1>Add a New Charging Station</h1>

          <div className="input-group">
            <input type="text" placeholder="Location" />
            <input type="text" placeholder="Charging rate" />
            <input type="text" placeholder="Price" />
            <input type="text" placeholder="Description" />

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

          <button type="submit" className="add-btn">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
