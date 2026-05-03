import Table, { type Column } from "../table/Table";
import { formatDuration } from "../../utils/formatDuration";
import { translateDifficultyName } from "../../utils/translateDifficulty";
import type { HuntStatsDto } from "../../../api/models/hunts/HuntStatsDto";
import "./HuntStatsPanel.css";

type HuntStatsPanelProps = {
  stats: HuntStatsDto | null;
  emptyMessage?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

type StepRow = {
  id: string;
  title: string;
  indexLabel: string;
  averageDurationMs: number | null;
  completionsCount: number;
};

const stepColumns: Column<StepRow>[] = [
  { key: "title", label: "Étape" },
  {
    key: "indexLabel",
    label: "Index",
  },
  {
    key: "averageDurationMs",
    label: "Durée moyenne",
    render: (row) => formatDuration(row.averageDurationMs),
  },
  {
    key: "completionsCount",
    label: "Complétions",
  },
];

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="hunt-stats-card">
      <span className="hunt-stats-card-label">{label}</span>
      <strong className="hunt-stats-card-value">{value}</strong>
    </div>
  );
}

export default function HuntStatsPanel({
  stats,
  emptyMessage = "Aucune statistique disponible pour cette chasse.",
  eyebrow = "Statistiques",
  title,
  subtitle,
}: HuntStatsPanelProps) {
  if (!stats) {
    return <div className="hunt-stats-empty">{emptyMessage}</div>;
  }

  const stepRows: StepRow[] = stats.stepStats.map((step) => ({
    id: step.id,
    title: step.title,
    indexLabel: step.index.name ? `${step.index.index} - ${step.index.name}` : String(step.index.index),
    averageDurationMs: step.averageDurationMs,
    completionsCount: step.completionsCount,
  }));

  return (
    <div className="hunt-stats-panel">
      <div className="hunt-stats-panel-header">
        <div>
          <p className="hunt-stats-eyebrow">{eyebrow}</p>
          <h2 className="hunt-stats-title">{title ?? stats.title}</h2>
          {subtitle ? <p className="hunt-stats-subtitle">{subtitle}</p> : null}
        </div>
        <div className="hunt-stats-title-badge">{stats.completionRate}% complétion</div>
      </div>

      <div className="hunt-stats-meta">
        <div className="hunt-stats-meta-item">
          <span className="hunt-stats-meta-label">Créé par</span>
          <strong>{stats.creator.username}</strong>
        </div>
        <div className="hunt-stats-meta-item">
          <span className="hunt-stats-meta-label">Centre culturel</span>
          <strong>{stats.culturalCenter.name}</strong>
        </div>
        <div className="hunt-stats-meta-item">
          <span className="hunt-stats-meta-label">Difficulté</span>
          <strong>{translateDifficultyName(stats.difficulty.name)}</strong>
        </div>
      </div>

      <div className="hunt-stats-summary-grid">
        <StatCard label="Étapes" value={String(stats.totalSteps)} />
        <StatCard label="Participants" value={String(stats.participantsCount)} />
        <StatCard label="Complétions" value={String(stats.completedAttemptsCount)} />
        <StatCard label="Taux de complétion" value={`${stats.completionRate}%`} />
        <StatCard label="Temps moyen de complétion" value={formatDuration(stats.averageCompletionTimeMs)} />
        <StatCard label="Durée moyenne d'une step" value={formatDuration(stats.averageStepDurationMs)} />
      </div>

      <div className="hunt-stats-steps">
        <h2 className="hunt-stats-section-title">Statistiques des étapes</h2>
        {stepRows.length > 0 ? (
          <Table
            data={stepRows}
            columns={stepColumns}
            displayMode="subgrid"
            allItemsLabel="étapes"
            allItemsPrefix="Toutes les"
          />
        ) : (
          <div className="hunt-stats-empty hunt-stats-empty--inline">Aucune step n'est disponible pour cette chasse.</div>
        )}
      </div>
    </div>
  );
}
