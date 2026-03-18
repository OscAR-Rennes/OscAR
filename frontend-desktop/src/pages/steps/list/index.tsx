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
        <Table
          data={steps}
          columns={stepsColumns}
          onRowSelect={(rows) => setSelectedStepsRows(rows)}
          allItemsPrefix="Toutes les"
          allItemsLabel="étapes"
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