import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";

export default function Home() {
  const [coordinates, setCoordinates] = useState<
    Array<{ lat: number; lng: number }>
  >([
    { lat: 32.096256, lng: 34.8553216 },
    { lat: 51.505, lng: -0.09 },
    { lat: 32.096256, lng: 34.8553216 },
  ]);

  const addCoordintae = () => {
    setCoordinates([...coordinates, { lat: 32.096256, lng: 34.8553216 }]);
    console.log(coordinates);
  };

  const position = [51.505, -0.09];
  return (
    <div className="map-page">
      <h2>Charging-Station</h2>
      <button onClick={addCoordintae}>Add Charging Station</button>
      <input type="text" />

      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "400px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {coordinates.map((coord, index) => (
          <Marker key={index} position={[32.096256, 34.8553216]}>
            <Popup>
              Charging Station {index + 1} <br /> Latitude: {coord.lat} <br />{" "}
              Longitude: {coord.lng}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
