import { useNavigate } from "react-router-dom";
import Table from "../../../common/components/table/Table";
import "../../../common/components/table/Table.style.css";
import { useStepsData } from "./steps.data";

export default function StepsList() {

  const {
    steps,
    stepsColumns,
    setSelectedStepsRows,
  } = useStepsData();

  const navigate = useNavigate();

  return (
    <>
      <h1>Lootopia V0.0.1 - Steps management</h1>
        <h2>Table des étapes</h2>
        <Table
          data={steps}
          columns={stepsColumns}
          onRowSelect={(rows) => setSelectedStepsRows(rows)}
          renderActionButton={() => (
              <button 
              className="table-btn" 
              onClick={() => navigate("/home/steps/create")}
              >
                Créer une étape
              </button>
            )}
        />
    </>
  );
}