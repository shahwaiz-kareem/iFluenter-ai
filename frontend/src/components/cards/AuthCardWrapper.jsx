import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Link from "next/link";

const AuthCardWrapper = ({
  title,
  label,
  navigationText,
  navigationHref,
  children,
}) => {
  return (
    <div className="w-96">
      <Card className=" w-full">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{label}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter>
          <div className="text-center text-sm">
            {navigationText}{" "}
            <Link href={navigationHref} className="underline">
              {title.toLowerCase() === "sign up" ? "Sign in" : "Sign up"}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthCardWrapper;
