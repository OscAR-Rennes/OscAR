import { ReactComponent as LockIcon } from "../../assets/icon/lock-larger.svg";

type ReadOnlyFieldProps = {
  label: string;
  value: string;
};

export function ReadOnlyField({ label, value }: ReadOnlyFieldProps) {
  return (
    <div className="osc-form-item">
      <label className="osc-form-label osc-readonly-label">
        <LockIcon className="osc-readonly-lock-icon" aria-hidden="true" focusable="false" />
        <span>{label}</span>
      </label>

      <div className="osc-form-control-row">
        <span className="osc-form-required is-hidden" aria-hidden="true">
          *
        </span>

        <input className="osc-form-control" value={value} readOnly />
      </div>
    </div>
  );
}
