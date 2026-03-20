import "./HeaderForm.style.css";

type HeaderFormTab = {
  id: string;
  label: string;
};

type HeaderFormProps = {
  title: string;
  entityName: string;
  tabs: HeaderFormTab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  creatorName?: string;
  creatorLabel?: string;
  statusLabel?: string;
  creatorPlacement?: "left" | "right";
};

export default function HeaderForm({
  title,
  entityName,
  tabs,
  activeTabId,
  onTabChange,
  creatorName,
  creatorLabel = "Créé par",
  statusLabel,
  creatorPlacement = "right",
}: HeaderFormProps) {
  const creatorBlock = (
    <div className={`header-form-creator-group ${creatorPlacement === "left" ? "left" : "right"}`}>
      <span className="header-form-creator-name">{creatorName || "-"}</span>
      <span className="header-form-creator-label">{creatorLabel}</span>
    </div>
  );

  return (
    <section className="header-form-container">
      <div className="header-form-top">
        {creatorPlacement === "left" && creatorBlock}

        <div className="header-form-title-group">
          <div className="header-form-title-row">
            <h1 className="header-form-title">{title}</h1>
            {statusLabel && <span className="header-form-status">- {statusLabel}</span>}
          </div>
          <p className="header-form-entity">{entityName}</p>
        </div>

        {creatorPlacement === "right" && creatorBlock}
      </div>

      <div className="header-form-tabs" role="tablist" aria-label="Onglets du formulaire">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`header-form-tab ${isActive ? "active" : ""}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}