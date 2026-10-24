import { OtpVerification } from "@/components/forms/OTPVerification";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const VerifyEmail = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-xl font-bold">Verify Your Email</h2>
        </CardTitle>
        <CardDescription>
          <p className="text-sm text-gray-400 ">
            We have sent an OTP to your email, please enter it below.{" "}
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OtpVerification />
      </CardContent>
    </Card>
  );
};

export default VerifyEmail;
