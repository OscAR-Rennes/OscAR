
import { use, useEffect, useState } from "react";
import { getHuntsByCulturalCenter } from "../../../api/services/hunt.api";
import Table from "../../../common/components/table/Table";
import "../../../common/components/table/Table.style.css";
import { useNavigate } from "react-router-dom";
import { useHuntsData } from "./hunts.data";

export default function HuntsList() {

  const navigate = useNavigate();

  const {
    hunts,
    huntsColumns,
    setSelectedHuntsRows,
  } = useHuntsData();

  
  return (
    <>
      <h1>Lootopia V0.0.1 - Hunts List</h1>
      <h2>Table des chasses</h2>
        <Table
          data={hunts}
          columns={huntsColumns}
          onRowSelect={(rows) => setSelectedHuntsRows(rows)}
          renderActionButton={() => (
              <button 
              className="table-btn" 
              onClick={() => navigate("/home/hunts/create")}
              >
                Créer une chasse
              </button>
            )}
        />
    </>
  );
}
