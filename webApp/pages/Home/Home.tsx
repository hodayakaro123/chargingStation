import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Home.css";

export default function Home() {
  const [coordinates, setCoordinates] = useState<
    Array<{ lat: number; lng: number }>
  >([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [newLocation, setNewLocation] = useState<{ lat: string; lng: string }>({
    lat: "",
    lng: "",
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setCoordinates([{ lat: latitude, lng: longitude }]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const addUserLocation = () => {
    if (userLocation) {
      setCoordinates((prev) => [...prev, userLocation]);
      console.log("Added current location:", userLocation);
    }
  };

  const addCustomLocation = () => {
    const lat = parseFloat(newLocation.lat);
    const lng = parseFloat(newLocation.lng);

    if (!isNaN(lat) && !isNaN(lng)) {
      setCoordinates((prev) => [...prev, { lat, lng }]);
      setNewLocation({ lat: "", lng: "" });
      console.log("Added custom location:", { lat, lng });
    } else {
      alert("Please enter valid latitude and longitude values.");
    }
  };

  return (
    <div className="map-page">
      <h2 className="title">Charging Station Map</h2>
      <div className="input-container">
        <input
          className="input"
          type="text"
          placeholder="Latitude"
          value={newLocation.lat}
          onChange={(e) =>
            setNewLocation((prev) => ({ ...prev, lat: e.target.value }))
          }
        />
        <input
          className="input"
          type="text"
          placeholder="Longitude"
          value={newLocation.lng}
          onChange={(e) =>
            setNewLocation((prev) => ({ ...prev, lng: e.target.value }))
          }
        />
        <button className="btn" onClick={addCustomLocation}>
          Find Charging Station by location
        </button>
      </div>

      {!userLocation ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={14}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "600px", borderRadius: "10px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {coordinates.map((coord, index) => (
            <Marker key={index} position={[coord.lat, coord.lng]}>
              <Popup>
                <strong>Charging Station {index + 1}</strong>
                <br />
                Latitude: {coord.lat.toFixed(6)}
                <br />
                Longitude: {coord.lng.toFixed(6)}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}
