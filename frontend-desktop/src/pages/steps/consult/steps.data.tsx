import { useEffect, useState } from "react";
import MapPicker from "../../../common/components/map/map";
import { FullStepDTO } from "../../../api/models/steps/FullStepDto";
import { getStepById } from "../../../api/services/step.api";
import { getAllIndexByHunt } from "../../../api/services/index.api";
import { useFormContext } from "react-hook-form";

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

export function EditStepMapField() {
	const { setValue, watch } = useFormContext();
	const latitude = watch("latitude");
	const longitude = watch("longitude");
	const latitudeNumber = Number(latitude);
	const longitudeNumber = Number(longitude);

	const markerValue =
		Number.isFinite(latitudeNumber) &&
		Number.isFinite(longitudeNumber)
			? {
					lat: latitudeNumber,
					lng: longitudeNumber,
				}
			: null;

	return (
		<div className="steps-consult-map-panel">
			<MapPicker
				value={markerValue}
				onChange={(coords: { lat: number; lng: number }) => {
					setValue("latitude", coords.lat, { shouldDirty: true, shouldValidate: true });
					setValue("longitude", coords.lng, { shouldDirty: true, shouldValidate: true });
				}}
			/>
		</div>
	);
}

export function EditDirtyTracker({ onDirtyChange }: { onDirtyChange: (value: boolean) => void }) {
	const { formState } = useFormContext();

	useEffect(() => {
		onDirtyChange(formState.isDirty);
	}, [formState.isDirty, onDirtyChange]);

	return null;
}

export function useStepConsultData(stepId?: string, reloadKey?: string) {
	const [step, setStep] = useState<FullStepDTO | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [indexesForHunt, setIndexesForHunt] = useState<any[]>([]);

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
				const indexes = await getAllIndexByHunt(data.hunt.id);
				setIndexesForHunt(indexes ?? []);
			} catch {
				setErrorMessage("Impossible de charger les informations de l'étape.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchStep();
	}, [stepId, reloadKey]);

	return {
		step,
		isLoading,
		errorMessage,
		indexesForHunt,
	};
}