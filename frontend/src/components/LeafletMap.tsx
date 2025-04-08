<<<<<<< HEAD
/* import React, { useEffect } from "react";
=======
/*import React, { useEffect } from "react";
>>>>>>> ee58396c049273e4556a67f263f97ca3eab886ba

// Só importa se estiver no web
if (typeof document === "undefined") {
  // evita qualquer erro de execução no mobile
  throw new Error("LeafletMap só pode ser usado na web");
}

import "leaflet/dist/leaflet.css";
import L from "leaflet";

const LeafletMap: React.FC = () => {
  useEffect(() => {
    const map = L.map("map").setView([-22.9068, -43.1729], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.marker([-22.9068, -43.1729])
      .addTo(map)
      .bindPopup("Você está aqui!")
      .openPopup();
  }, []);

  return (
    <div
      id="map"
      style={{ height: "100%", width: "100%", borderRadius: "10px" }}
    />
  );
};

export default LeafletMap;
<<<<<<< HEAD
*/
=======
*/
>>>>>>> ee58396c049273e4556a67f263f97ca3eab886ba
