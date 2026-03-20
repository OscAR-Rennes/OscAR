import { useEffect, useState } from "react";
import MapPicker from "../../../common/components/map/map";
import { FullStepDTO } from "../../../api/models/steps/FullStepDto";
import { getStepById } from "../../../api/services/step.api";

export const STEPS_CONSULT_TABS = [
	{ id: "general", label: "Général" },
	{ id: "documents", label: "Documents" },
];

export function StepsConsultMapField({
	latitude,
	longitude,
}: {
	latitude: number | null;
	longitude: number | null;
}) {
	const markerValue =
		latitude !== null && longitude !== null
			? {
					lat: Number(latitude),
					lng: Number(longitude),
				}
			: null;

	return (
		<div className="steps-consult-map-panel">
			<MapPicker value={markerValue} readOnly={true} />
		</div>
	);
}

export function useStepConsultData() {
	const [step, setStep] = useState<FullStepDTO | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const stepId = window.location.pathname.split("/").pop();

	useEffect(() => {
		const fetchStep = async () => {
			if (!stepId) {
				setErrorMessage("Étape introuvable.");
				setIsLoading(false);
				return;
			}

			try {
				const data = await getStepById(stepId);
				setStep(data);
			} catch {
				setErrorMessage("Impossible de charger les informations de l'étape.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchStep();
	}, [stepId]);

	return {
		step,
		isLoading,
		errorMessage,
	};
}