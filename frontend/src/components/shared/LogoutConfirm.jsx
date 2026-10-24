"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { userContext } from "@/context/UserProvider";
import { useToast } from "@/hooks/use-toast";
import { persistor } from "@/lib/store/store";
import { useRouter } from "next/navigation";
import { useContext } from "react";

const LogoutConfirm = () => {
  const { openLogoutModal, setOpenLogoutModal } = useContext(userContext);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const res = await fetch(`/api/user/logout`, {
        method: "POST",
        credentials: "include",
      });

      const response = await res.json();
      if (response.status === "success") {
        toast({
          description: response.message || "Logout successful!",
          variant: "default",
        });
        await persistor.purge();
        router.push("/sign-in");
      } else {
        toast({
          description: response?.message || "Unable to login out",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        description: error.data?.message || "Unable to login out",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <AlertDialog open={openLogoutModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to end your secure session. Once you log out, you
              will need to re-enter your credentials to access your account
              details and secure features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenLogoutModal(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LogoutConfirm;
