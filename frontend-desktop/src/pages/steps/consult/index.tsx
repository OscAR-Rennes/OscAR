import { useState, useEffect } from "react";
import { FullStepDTO } from "../../../api/models/steps/FullStepDto";
import { getStepById } from "../../../api/services/step.api";

export default function StepConsultation() {

  const [step, setStep] = useState<FullStepDTO | null>(null);
  
    const id = window.location.pathname.split("/").pop();
  
    useEffect(() => {
      const fetchStep = async () => {
        if (!id) return;
        const data = await getStepById(id);
        setStep(data);
      };
      fetchStep();
    }, [id]);

    if (!step) return <p>Loading...</p>;
  
  return (
    <>
      <h1>Lootopia V0.0.1 - Steps consultation</h1>

      <section>
        <h2>{step.title}</h2>
        <p>{step.description}</p>

        <h3>Détails :</h3>
        <ul>
          <li><strong>Points :</strong> {step.points}</li>
          {step.latitude && (<li><strong>Latitude :</strong> {step.latitude}</li>)}
          {step.longitude && (<li><strong>Longitude :</strong> {step.longitude}</li>)}

          <li><strong>Chasse associée :</strong>{step.hunt.title}</li>
          <li><strong>Centre culturel :</strong> {step.hunt.culturalCenter.name}</li>
          <li><strong>Createur de l'étape : </strong>{step.hunt.creator.username}</li>
         
          {
            step.index.name ? (
              <>
                <li><strong>Chasse dans l'index numéro : </strong>{step.index.index}</li>
                <li><strong>Nom de l'index : </strong>{step.index.name}</li>
              </>
            ) : (
              <li><strong>Chasse numéro : </strong>{step.index.index}</li>
            )
          }
        </ul>
      </section>
    </>
  );
}