"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart of fluency score for this week";

const chartConfig = {
  fluencyScore: {
    label: "Fluency Score ",
    color: "hsl(245 82% 67%)",
  },

  label: {
    color: "hsl(var(--background))",
  },
  // innerHeight: 32,
};

export function ChartDisplay({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fluency Score - Progress Report</CardTitle>
        <CardDescription>Current week's fluency progress</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: -10,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="fluencyScore"
              fill="var(--color-fluencyScore)"
              radius={8}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Current weeks fluency score.
        </div>
      </CardFooter>
    </Card>
  );
}
