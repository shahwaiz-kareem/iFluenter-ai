import { Separator } from "@/components/ui/separator";
import Section from "../shared/Section";
import Grid from "../shared/Grid";
import StatCard from "./StatCard";

export default function UsersStats({ users }) {
  if (!users) return null;

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-xl font-bold text-primary">Users Overview</h2>
        <p className="text-sm text-muted-foreground">
          High-level user and subscription status
        </p>
      </div>

      {/* ================= CORE USERS ================= */}
      <Section title="Core Users">
        <Grid>
          <StatCard label="Total Users" value={users.total} />
          <StatCard label="Verified Users" value={users.verified} />
          <StatCard label="Onboarded Users" value={users.onboarded} />
          <StatCard label="Suspended Users" value={users.suspended} />
        </Grid>
      </Section>

      <Separator />

      {/* ================= SUBSCRIPTIONS ================= */}
      <Section title="Subscription Status">
        <Grid>
          <StatCard label="Free Users" value={users.free} />
          <StatCard label="Pro Users" value={users.pro} />
          <StatCard label="Expired" value={users.expired} />
          <StatCard label="Unpaid" value={users.unpaid} />
          <StatCard label="Paused" value={users.paused} />
          <StatCard label="Cancelled" value={users.cancelled} />
        </Grid>
      </Section>

      <Separator />

      {/* ================= GROWTH ================= */}
      <Section title="Growth">
        <Grid>
          <StatCard label="New Users Today" value={users.newToday} highlight />
          <StatCard
            label="New Users (Last 7 Days)"
            value={users.newLast7Days}
            highlight
          />
        </Grid>
      </Section>
    </div>
  );
}
