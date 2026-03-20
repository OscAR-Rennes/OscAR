import Button from "../button/Button";
import { useNavigate } from "react-router-dom";
import { ReactComponent as LeftArrowIcon } from "../../assets/icon/left-arrow.svg";
import "./ribbon.style.css";

export default function Ribbon({ formId }) {
	const navigate = useNavigate();

	return (
		<div className="osc-ribbon">
			<div className="osc-ribbon-left">
				<Button
					type="button"
					className="osc-ribbon-back-btn"
					aria-label="Retour"
					onClick={() => navigate(-1)}
				>
					<LeftArrowIcon className="osc-ribbon-back-icon" aria-hidden="true" focusable="false" />
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
