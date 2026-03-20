import { useEffect, useState } from "react";
import { getHuntById } from "../../../api/services/hunt.api";
import { FullHuntDTO } from "../../../api/models/hunts/FullHuntDto";
import { type Column } from "../../../common/components/table/Table";

type StepRow = {
	id: string;
	title: string;
	description: string;
};

export function useHuntConsultData(huntId?: string) {
	const [hunt, setHunt] = useState<FullHuntDTO | null>(null);
	const [steps, setSteps] = useState<StepRow[]>([]);

	const stepsColumns: Column<StepRow>[] = [
		{ key: "title", label: "Étape" },
		{ key: "description", label: "Description" },
	];

	useEffect(() => {
		const fetchHunt = async () => {
			if (!huntId) return;
			const data = await getHuntById(huntId);
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
	}, [huntId]);

	return {
		hunt,
		steps,
		stepsColumns,
	};
}