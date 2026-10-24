"use client";
import { ResetPasswordConfirm } from "@/components/forms/ResetPasswordConfirm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

const ResetPassConfirm = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="animate-spin" size={30} />
        </div>
      }
    >
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription>Choose a new password to reset</CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordConfirm />
        </CardContent>
      </Card>
    </Suspense>
  );
};

export default ResetPassConfirm;
