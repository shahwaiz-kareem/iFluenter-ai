"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ChatModalForm from "@/components/forms/ChatModalForm";
import { useAppSelector } from "@/lib/hooks/hooks";
import {
  selectAssetsStatus,
  selectIsModalOpen,
} from "@/lib/features/chat/chat.slice";
import CanvasLoader from "./CanvasLoader";
import { memo } from "react";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import DailyLimitReached from "./DailyLimitReached";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Link from "next/link";

const ChatModal = ({ vad, vadRef, isLimitReached }) => {
  const isModalOpen = useAppSelector(selectIsModalOpen);
  const assetsStatus = useAppSelector(selectAssetsStatus);
  // console.log("Check this", assetsStatus.status, isModalOpen);

  return (
    <Dialog open={isModalOpen}>
      <DialogContent className="sm:max-w-[650px] px-4  rounded-xl  [&>button]:hidden  h-[90%] sm:h-[85%] flex flex-col justify-center items-center text-white">
        <DialogHeader
          className={`flex flex-col justify-center self-start items-start ${
            !isLimitReached && "gap-1 mb-2"
          }`}
        >
          {isLimitReached && (
            <Link
              href={"/dashboard"}
              className="bg-primary text-primary-foreground py-1 px-2 rounded shadow hover:bg-primary/90"
            >
              <ArrowLeft size={20} />
            </Link>
          )}
          {!isLimitReached ? (
            <>
              <DialogTitle className="text-2xl flex items-center justify-center gap-2">
                <Link
                  href={"/dashboard"}
                  className="bg-primary text-primary-foreground py-1 px-2 rounded shadow hover:bg-primary/90"
                >
                  <ArrowLeft size={18} />
                </Link>
                {assetsStatus.status === "loading"
                  ? "Loading Assets"
                  : "Preferences"}
              </DialogTitle>
              <DialogDescription className="text-white/80 ">
                {assetsStatus.status === "loading"
                  ? "Please wait until all assets are loaded"
                  : "Customize your conversation experience"}
              </DialogDescription>
            </>
          ) : (
            <VisuallyHidden>
              <DialogTitle className="text-2xl ">
                Daily Limit has reached.
              </DialogTitle>
              <DialogDescription>
                You are on free plan your daily limit has reached
              </DialogDescription>
            </VisuallyHidden>
          )}
        </DialogHeader>

        {isLimitReached ? (
          <DailyLimitReached />
        ) : (
          <>
            {assetsStatus?.status === "" && (
              <ChatModalForm vad={vad} vadRef={vadRef} />
            )}
          </>
        )}

        {assetsStatus.status === "loading" && (
          <CanvasLoader assetsStatus={assetsStatus} />
        )}

        {assetsStatus.status === "error" && (
          <div className="flex items-center h-full w-full justify-center flex-col gap-2">
            <TriangleAlert size={80} className="text-red-500" />
            <strong className="text-sm">
              {assetsStatus?.msg ||
                "Something unexpected happened! Please reload..."}
            </strong>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default memo(ChatModal);
