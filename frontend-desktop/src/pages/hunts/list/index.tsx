
import { useEffect, useState } from "react";
import { getHuntsByCulturalCenter } from "../../../api/services/hunt.api";
import Table from "../../../common/components/table/Table";
import "../../../common/components/table/Table.style.css";
import { useNavigate } from "react-router-dom";

export default function HuntsList() {
  
  const [hunts, setHunts] = useState([]);
  const [selectedHuntsRows, setSelectedHuntsRows] = useState([]);

  const navigate = useNavigate();

  const huntsColumns = 
    [
        { key: "title", label: "Nom de la chasse" },
        { key: "description", label: "Description"},
    ]

  useEffect(() => {
    const fetchHunts = async () => {
      const huntsData = await getHuntsByCulturalCenter();
      setHunts(huntsData);
    };
    fetchHunts();
  },[]);

  
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
