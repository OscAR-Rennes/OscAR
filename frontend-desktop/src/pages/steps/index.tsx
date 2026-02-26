import { useEffect, useState } from "react";
import Table from "../../common/components/table/Table";
import { getStepsByCulturalCenter } from "../../api/services/step.api";

export default function Steps() {
  
  const [steps, setSteps] = useState([]);
  const [selectedStepsRows, setSelectedStepsRows] = useState([]);

  const stepsColumns = 
    [
        { key: "title", label: "Nom de l'étape" },
        { key: "description", label: "Description"},
    ]

  useEffect(() => {
    const fetchSteps = async () => {
      const stepsData = await getStepsByCulturalCenter();
      setSteps(stepsData);
    };
    fetchSteps();
  },[]);

  
  return (
    <>
      <h1>Lootopia V0.0.1 - Steps management</h1>
      <Table
        data={steps}
        columns={stepsColumns}
        onRowSelect={(rows) => setSelectedStepsRows(rows)}
      />
    </>
  );
}