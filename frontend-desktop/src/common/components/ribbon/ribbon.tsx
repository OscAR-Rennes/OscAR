import Button from "../button/Button";
import { useNavigate } from "react-router-dom";
import "./ribbon.style.css";

export default function Ribbon({ formId }) {
	const navigate = useNavigate();

	return (
		<div className="osc-ribbon">
			<div className="osc-ribbon-left">
				<Button type="button" onClick={() => navigate(-1)}>
					← Retour
				</Button>
			</div>

			<div className="osc-ribbon-right">
				<Button type="submit" form={formId}>
					Sauvegarder
				</Button>
			</div>
		</div>
	);
}
