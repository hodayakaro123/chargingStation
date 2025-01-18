import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Home.css";

function MapUpdater({ coordinates }: { coordinates: { lat: number; lng: number } | null }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates) {
      map.setView([coordinates.lat, coordinates.lng], map.getZoom()); // Update map center
    }
  }, [coordinates, map]);

  return null;
}
console.log("Home.tsx");
export default function Home() {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [address, setAddress] = useState<string>("");
  const [chargingStations, setChargingStations] = useState<any[]>([]); // To hold the charging stations data

  useEffect(() => {
    // Get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setCoordinates({ lat: latitude, lng: longitude }); // Initially set marker to user location
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {

    const fetchChargingStations = async () => {
      try {
        const response = await fetch("http://localhost:3000/addChargingStation/getAllChargers"); 
        const data = await response.json();
        if (data.chargers) {
          setChargingStations(data.chargers); 
        } else {
          console.error("No chargers found in response.");
        }
      } catch (error) {
        console.error("Error fetching charging stations:", error);
      }
    };

    fetchChargingStations();
  }, []);

  const searchAddress = async () => {
    if (!address.trim()) {
      alert("Please enter a valid address.");
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);

        setCoordinates({ lat: newLat, lng: newLng }); 
        setUserLocation({ lat: newLat, lng: newLng });
        console.log("Address coordinates:", { lat: newLat, lng: newLng });
      } else {
        alert("No results found for the entered address.");
      }
    } catch (error) {
      console.error("Error fetching address coordinates:", error);
      alert("Failed to fetch coordinates. Please try again.");
    }
  };

  return (
    <div className="map-page">
      <h2 className="title">Charging Station Map</h2>
      <div className="input-container">
        <input
          className="input"
          type="text"
          placeholder="Enter address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button className="btn" onClick={searchAddress}>
          Find Charging Station by Address
        </button>
      </div>

      {!userLocation ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <MapContainer
          center={coordinates ? [coordinates.lat, coordinates.lng] : [userLocation.lat, userLocation.lng]}
          zoom={14}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "600px", borderRadius: "10px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {chargingStations.map((charger) => (
            <Marker
              key={charger._id} 
              position={[charger.latitude, charger.longitude]}
            >
              <Popup>
                <strong>{charger.location}</strong>
                <br />
                Price: ${charger.price}
                <br />
                Rating: {charger.rating} stars
                <br />
                Charging Rate: {charger.chargingRate} kW
                <br />
                {charger.description && <p>{charger.description}</p>}
              </Popup>
            </Marker>
          ))}

          <MapUpdater coordinates={coordinates} /> {}
        </MapContainer>
      )}
    </div>
  );
}
