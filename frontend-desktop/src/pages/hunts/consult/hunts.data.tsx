import { useEffect, useState } from "react";
import { getHuntById } from "../../../api/services/hunt.api";
import { getAllDifficulty } from "../../../api/services/difficulty.api";
import { FullHuntDTO } from "../../../api/models/hunts/FullHuntDto";
import { type Column } from "../../../common/components/table/Table";
import MapPicker from "../../../common/components/map/map";
import { useFormContext } from "react-hook-form";

type StepRow = {
	id: string;
	title: string;
	description: string;
};

export const HUNTS_CONSULT_TABS = [{ id: "general", label: "Général" }];

export function useHuntConsultData(huntId?: string, reloadKey?: string) {
	const [hunt, setHunt] = useState<FullHuntDTO | null>(null);
	const [steps, setSteps] = useState<StepRow[]>([]);
	const [difficulties, setDifficulties] = useState<any[]>([]);

	const stepsColumns: Column<StepRow>[] = [
		{ key: "title", label: "Étape" },
		{ key: "description", label: "Description" },
	];

	useEffect(() => {
		const fetchHunt = async () => {
			if (!huntId) return;
			const [data, diff] = await Promise.all([
				getHuntById(huntId),
				getAllDifficulty(),
			]);
			setHunt(data);
			setDifficulties(diff ?? []);
			setSteps(
				data.steps.map((step: any) => ({
					id: step.id,
					title: step.title,
					description: step.description ?? "-",
				}))
			);
		};

		fetchHunt();
	}, [huntId, reloadKey]);

	return {
		hunt,
		difficulties,
		steps,
		stepsColumns,
	};
}

export function EditHuntMapField() {
	const { watch, setValue } = useFormContext();
	const latitude = watch("latitude");
	const longitude = watch("longitude");

	const markerValue =
		latitude !== undefined &&
		latitude !== null &&
		latitude !== "" &&
		longitude !== undefined &&
		longitude !== null &&
		longitude !== ""
			? {
					lat: Number(latitude),
					lng: Number(longitude),
				}
			: null;

	return (
		<MapPicker
			value={markerValue}
			onChange={(coords: { lat: number; lng: number }) => {
				setValue("latitude", coords.lat, { shouldDirty: true, shouldValidate: true });
				setValue("longitude", coords.lng, { shouldDirty: true, shouldValidate: true });
			}}
		/>
	);
}

export function EditDirtyTracker({ onDirtyChange }: { onDirtyChange: (value: boolean) => void }) {
	const { formState } = useFormContext();

	useEffect(() => {
		onDirtyChange(formState.isDirty);
	}, [formState.isDirty, onDirtyChange]);

	return null;
}