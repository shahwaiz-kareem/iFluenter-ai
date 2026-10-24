import { useEffect } from "react";
import { useToast } from "./use-toast";
import { useAppDispatch } from "@/lib/hooks/hooks";
import { setMicPermissionStatus } from "@/lib/features/chat/chat.slice";

const useMicPermissionManager = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handlePermission = (permissionStatus) => {
    if (permissionStatus.state === "granted") {
      dispatch(setMicPermissionStatus("granted"));
    }
    if (permissionStatus.state === "denied") {
      toast({
        title: "⚠️ Permission Error",
        description:
          "Please grant permission to microphone, Otherwise the app might not work properly. You can grant via settings.",
        variant: "alert",
      });
      dispatch(setMicPermissionStatus("denied"));
    }
  };

  const triggerPermissionManager = () => {
    if (!navigator.permissions) {
      // console.log("Permissions API not supported in this browser.");
      // Fallback: directly call getUserMedia and handle the error/success
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then((stream) => {
          dispatch(setMicPermissionStatus("granted"));
          stream.getTracks().forEach((t) => t.stop());
        })
        .catch((err) => {
          if (
            err.name === "NotAllowedError" ||
            err.name === "PermissionDeniedError"
          ) {
            dispatch(setMicPermissionStatus("denied"));

            toast({
              title: "⚠️ Permission Error",
              description:
                "Please grant permission to microphone, Otherwise the app might not work properly. You can grant via settings.",
              variant: "alert",
            });
          }
        });

      return;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const permissionStatus = await navigator.permissions.query({
          name: "microphone",
        });

        handlePermission(permissionStatus);

        permissionStatus.onchange = () => {
          handlePermission(permissionStatus);
        };
      } catch (error) {
        console.error("Error querying permissions:", error);
        return "unknown";
      }
    })();
  }, []);

  return { triggerPermissionManager };
};

export default useMicPermissionManager;
