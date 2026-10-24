import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "iFluenter || Reset Password ",
  description: "Password reset page.",
};

const ResetPassword = () => {
  return (
    <div className="max-sm:px-2">
      <Card className="md:w-[400px] ">
        <CardHeader>
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription className="py-1">
            Enter your email to send reset link to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
