"use client";

import { useState } from "react";
import EnvsDisplay from "./EnvsDisplay";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FormSheet from "../shared/FormSheet";

const EnvsContainer = ({ envs }) => {
  const [envId, setEnvId] = useState("");
  const [envsData, setEnvsData] = useState(envs);

  return (
    <div className="flex items-center justify-center flex-col p-4 ">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-bold">Environments</h1>
        <Button onClick={() => setEnvId("new")}>
          <Plus />
        </Button>
      </div>
      <EnvsDisplay envs={envsData} setEnvId={setEnvId} />
      <FormSheet
        itemId={envId}
        data={envs}
        setItemId={setEnvId}
        setData={setEnvsData}
        sheetFor={"env"}
      />
    </div>
  );
};

export default EnvsContainer;
