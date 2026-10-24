import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function StatCard({ label, value, highlight }) {
  return (
    <Card
      className={`border ${highlight ? "border-primary" : "border-primary/30"}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <span className="text-2xl font-bold text-primary">{value}</span>

        {highlight && (
          <Badge className="bg-primary text-primary-foreground">New</Badge>
        )}
      </CardContent>
    </Card>
  );
}
