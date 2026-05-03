import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../api/services/huntStats.api";
import type { HuntDashboardStatsDto } from "../../api/models/hunts/HuntDashboardStatsDto";
import HuntStatsPanel from "../../common/components/hunt_stats/HuntStatsPanel";
import { formatDuration } from "../../common/utils/formatDuration";
import "./index.style.css";

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="dashboard-card">
      <span className="dashboard-card-label">{label}</span>
      <strong className="dashboard-card-value">{value}</strong>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState<HuntDashboardStatsDto | null>(null);
  const [selectedHuntId, setSelectedHuntId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setDashboardStats(data ?? null);
        setSelectedHuntId((currentId) => currentId ?? data?.hunts?.[0]?.id ?? null);
        setErrorMessage(null);
      } catch {
        setDashboardStats(null);
        setErrorMessage("Impossible de charger les statistiques des chasses.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const selectedHunt = useMemo(
    () => dashboardStats?.hunts.find((hunt) => hunt.id === selectedHuntId) ?? null,
    [dashboardStats, selectedHuntId]
  );

  if (isLoading) {
    return <div className="dashboard-page dashboard-page--loading">Chargement du dashboard...</div>;
  }

  if (errorMessage) {
    return <div className="dashboard-page dashboard-page--error">{errorMessage}</div>;
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Dashboard</p>
          <h1>Vue d'ensemble</h1>
          <p className="dashboard-description">
            Consulte d’abord les stats globales, puis sélectionne une chasse pour voir son détail.
          </p>
        </div>

        <button className="dashboard-link-button" onClick={() => navigate("/home/hunts")}>Voir les chasses</button>
      </header>

      {dashboardStats ? (
        <>
          <section className="dashboard-scope-card">
            <div>
              <p className="dashboard-scope-label">Global</p>
              <h2 className="dashboard-scope-title">Chasses visibles</h2>
              <p className="dashboard-scope-subtitle">
                Vue d’ensemble des chasses accessibles à ton rôle.
              </p>
            </div>
            <div className="dashboard-scope-pill">{dashboardStats.summary.huntsCount} chasses</div>
          </section>

          <section className="dashboard-summary-grid">
            <SummaryCard label="Chasses visibles" value={String(dashboardStats.summary.huntsCount)} />
            <SummaryCard label="Participants" value={String(dashboardStats.summary.participantsCount)} />
            <SummaryCard label="Complétions" value={String(dashboardStats.summary.completedAttemptsCount)} />
            <SummaryCard label="Temps moyen de complétion" value={formatDuration(dashboardStats.summary.averageCompletionTimeMs)} />
            <SummaryCard label="Durée moyenne d'une step" value={formatDuration(dashboardStats.summary.averageStepDurationMs)} />
            <SummaryCard label="Taux moyen de complétion" value={dashboardStats.summary.averageCompletionRate === null ? "—" : `${dashboardStats.summary.averageCompletionRate}%`} />
          </section>

          <section className="dashboard-hunt-selector-card">
            <div className="dashboard-selector-row">
              <div>
                <p className="dashboard-section-title">Chasse</p>
                <p className="dashboard-section-subtitle">Choisis une chasse pour voir son détail.</p>
              </div>

              <select
                className="dashboard-hunt-select"
                value={selectedHuntId ?? ""}
                onChange={(event) => setSelectedHuntId(event.target.value)}
              >
                {dashboardStats.hunts.map((hunt) => (
                  <option key={hunt.id} value={hunt.id}>
                    {hunt.title}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <HuntStatsPanel
            stats={selectedHunt}
            eyebrow="Détail"
            title={selectedHunt?.title ?? "Chasse sélectionnée"}
            subtitle="Les indicateurs ci-dessous suivent la chasse choisie."
            emptyMessage="Sélectionne une chasse pour voir ses statistiques."
          />
        </>
      ) : (
        <div className="dashboard-empty">Aucune chasse accessible pour le moment.</div>
      )}
    </div>
  );
}
