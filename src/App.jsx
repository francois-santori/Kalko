import React from "react";
import { Routes, Route } from "react-router-dom";
import Accueil from "./pages/Accueil.jsx";
import Jeux from "./pages/Jeux.jsx";
import TablesMultiplications from "./pages/TablesMultiplications";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/jeux" element={<Jeux />} />
      <Route path="/jeux/tables-multiplications" element={<TablesMultiplications />} />
    </Routes>
  );
}
