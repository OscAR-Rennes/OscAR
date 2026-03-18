
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
      <Table
        data={hunts}
        columns={huntsColumns}
        onRowSelect={(rows) => setSelectedHuntsRows(rows)}
        allItemsPrefix="Toutes les"
        allItemsLabel="chasses"
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
