"use client";

import { useState } from "react";
import AvatarsDisplay from "./AvatarsDisplay";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FormSheet from "../shared/FormSheet";

const AvatarsContainer = ({ avatars }) => {
  const [avatarId, setAvatarId] = useState("");
  const [avatarsData, setAvatarsData] = useState(avatars);
  console.log("the d", avatarId, avatarsData);
  return (
    <div className="flex items-center justify-center flex-col p-4 ">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-bold">Avatars</h1>
        <Button onClick={() => setAvatarId("new")}>
          <Plus />
        </Button>
      </div>
      <AvatarsDisplay avatars={avatarsData} setAvatarId={setAvatarId} />
      <FormSheet
        itemId={avatarId}
        sheetFor={"avatar"}
        data={avatarsData}
        setItemId={setAvatarId}
        setData={setAvatarsData}
      />
    </div>
  );
};

export default AvatarsContainer;
