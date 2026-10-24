"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const UserStatsDisplay = ({ data }) => {
  console.log("here's hte sta", data);
  const [dataOf, setDataOf] = useState("allUsers");
  const dataOfOptions = [
    { id: "allUsers", name: "All" },
    { id: "todaysUsers", name: "Todays" },
    { id: "currentMonthsUsers", name: "Month" },
  ];
  return (
    <div className="flex  gap-4 flex-col">
      <div className="flex items-center justify-start gap-2">
        {dataOfOptions.map((option) => (
          <Button
            key={option.id}
            onClick={() => setDataOf(option.id)}
            disabled={option.id === dataOf}
          >
            {option.name}
          </Button>
        ))}
      </div>
      <div className="flex items-center flex-wrap gap-4">
        {data[dataOf]?.map((e) => (
          <Card key={e?._id} className="w-52">
            <CardHeader>
              <CardTitle className=" font-normal">
                <strong className="capitalize mr-2 text-xl">
                  {e?._id ? e._id : "Free"}
                </strong>
                users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-center">{e?.totalUsers}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserStatsDisplay;
