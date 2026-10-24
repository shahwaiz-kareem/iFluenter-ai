"use client";

import { AlertTriangle, Mic, MicVocal, Speech } from "lucide-react";

const SupportAndAvailabilityDisplay = ({
  isTtsSupported,
  recognitionSupport,
  MicPermissionStatus,
}) => {
  return (
    <div className="flex items-center md:w-[600px] md:mx-auto justify-center mt-8 px-2 flex-col gap-6">
      <div className="flex items-center  flex-col justify-between gap-2">
        <AlertTriangle size={80} className="text-yellow-400" />
        <h2 className="font-bold">We encountered some issues!</h2>
      </div>

      {!recognitionSupport && (
        <div className="flex items-center h-20 w-full gap-2 justify-between">
          <div className="h-full w-[20%]  flex items-center justify-center rounded-lg bg-blue-400">
            <Mic size={40} />
          </div>
          <div className="flex  justify-start flex-col">
            <h4>
              Your browser doesn't supports <strong>Speech Recognition</strong>.
            </h4>
            <p className="text-sm">
              Please use latest version of Chrome or Edge browser OR Upgrade to
              pro.
            </p>
          </div>
        </div>
      )}

      {!isTtsSupported && (
        <div className="flex items-center  h-20 w-full gap-2 ">
          <div className="h-full w-[20%]  flex items-center justify-center rounded-lg bg-blue-400">
            <Speech size={40} />
          </div>
          <div className="flex   justify-start flex-col">
            <h4>
              Your browser doesn't supports <strong>Speech Synthesis</strong>.
            </h4>
            <p className="text-sm">
              Please use latest version of Chrome or Edge browser OR Upgrade to
              pro.
            </p>
          </div>
        </div>
      )}
      {/* {!MicPermissionStatus && (
        <div className="flex items-center gap-2 h-20 w-full  justify-between">
          <div className="h-full w-[20%]  flex items-center justify-center rounded-lg bg-red-400">
            <MicVocal size={40} />
          </div>
          <div className="flex  justify-start flex-col">
            <h4>
              <strong>Microphone</strong> might be not working.
            </h4>
            <p className="text-sm">
              Try to troubleshoot your device microphone or Login with another
              device.
            </p>
          </div>
        </div>
      )} */}

      <button className="p-3 rounded-lg self-start bg-primary/75 animate-accordion-up ">
        <span className="mb-4">👑</span> Upgrade to Pro
      </button>
    </div>
  );
};

export default SupportAndAvailabilityDisplay;
