import { useEffect, useState } from "react";
import { getHuntById } from "../../../api/services/hunt.api";
import { getAllDifficulty } from "../../../api/services/difficulty.api";
import { FullHuntDTO } from "../../../api/models/hunts/FullHuntDto";
import { EditHuntFormDto } from "../../../api/models/hunts/EditHuntFormDto";
import { type Column } from "../../../common/components/table/Table";
import MapPicker from "../../../common/components/map/map";
import { useFormContext } from "react-hook-form";
import { editHunt } from "../../../api/services/hunt.api";

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
			setDifficulties(diff.data ?? []);
			setHunt(data);
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

	const buildEditHuntSubmitHandler = (onSuccess: () => void) => {
		return async (data: EditHuntFormDto) => {
			if (!huntId) return;

			const activeValue = data.active as unknown;
			const normalizedIsActive =
				typeof activeValue === "string"
					? activeValue.toLowerCase() === "true"
					: Boolean(activeValue);

			const updated = await editHunt(huntId, {
				title: data.title,
				description: data.description,
				difficulty_id: data.difficulty_id,
				points: Number(data.points),
				latitude: Number(data.latitude),
				longitude: Number(data.longitude),
				picture_path: data.picture_path ?? "",
				isactive: normalizedIsActive,
			});

			if (updated) {
				onSuccess();
			}
		};
	};

	return {
		hunt,
		difficulties,
		steps,
		stepsColumns,
		buildEditHuntSubmitHandler,
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