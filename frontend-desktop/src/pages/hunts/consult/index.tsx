import { useEffect, useState } from "react";
import { getHuntById } from "../../../api/services/hunt.api";
import { FullHuntDTO } from "../../../api/models/hunts/FullHuntDto";

export default function HuntConsultation() {
  const [hunt, setHunt] = useState<FullHuntDTO | null>(null);

  const id = window.location.pathname.split("/").pop();

  useEffect(() => {
    const fetchHunt = async () => {
      if (!id) return;
      const data = await getHuntById(id);
      setHunt(data);
    };
    fetchHunt();
  }, [id]);

  if (!hunt) return <p>Loading...</p>;

  return (
    <>
      <h1>Lootopia V0.0.1 — Hunt consultation</h1>

      <section>
        <h2>{hunt.title}</h2>
        <p>{hunt.description}</p>

        <h3>Détails :</h3>
        <ul>
          <li><strong>Cultural Center:</strong> {hunt.culturalCenter.name}</li>
          <li><strong>Difficulty :</strong> {hunt.difficulty.name}</li>
          <li><strong>Active :</strong> {hunt.isActive ? "Oui" : "Non"}</li>
          <li><strong>Points :</strong> {hunt.points}</li>
          <li><strong>Latitude :</strong> {hunt.latitude}</li>
          <li><strong>Longitude :</strong> {hunt.longitude}</li>
          <li><strong>Picture URL :</strong> {hunt.pictureUrl}</li>
          <li><strong>Username :</strong> {hunt.creator.username}</li>
        </ul>

        <h3>Steps :</h3>
        <ul>
          {hunt.steps.map((step) => (
            <li key={step.id}>
              {step.title}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}