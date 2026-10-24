import { Separator } from "@/components/ui/separator";
import Grid from "../shared/Grid";
import Section from "../shared/Section";
import StatCard from "./StatCard";

export default function ChatSessionStats({ sessions }) {
  if (!sessions) return null;

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-xl font-bold text-primary">
          Engagement & Sessions
        </h2>
        <p className="text-sm text-muted-foreground">
          User activity and speaking behavior
        </p>
      </div>

      {/* ================= CORE SESSION STATS ================= */}
      <Section title="Session Activity">
        <Grid>
          <StatCard label="Total Sessions" value={sessions.total} />
          <StatCard label="Sessions Today" value={sessions.today} />
          <StatCard
            label="Active Users (7 Days)"
            value={sessions.activeUsersLast7Days}
          />
        </Grid>
      </Section>

      <Separator />

      {/* ================= SPEAKING METRICS ================= */}
      <Section title="Speaking Metrics">
        <Grid>
          <StatCard
            label="Total Spoken Duration"
            value={`${toMinutes(sessions.totalSpokenDuration)} min`}
          />
          <StatCard
            label="Avg Spoken / Session"
            value={`${sessions.avgSpokenDuration}s`}
          />
          <StatCard
            label="Avg Messages / Session"
            value={sessions.avgMessages}
          />
        </Grid>
      </Section>
    </div>
  );
}

/* ================= HELPERS ================= */

function toMinutes(seconds = 0) {
  return Math.round(seconds / 60);
}
