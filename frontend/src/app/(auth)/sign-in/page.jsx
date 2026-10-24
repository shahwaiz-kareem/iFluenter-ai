import AuthCardWrapper from "@/components/cards/AuthCardWrapper";

import { SignInForm } from "@/components/forms/SignInForm";
export const metadata = {
  title: "iFluenter || Sign In ",
  description: "Sign in to iFluenter.",
};

const SignIn = () => {
  return (
    <AuthCardWrapper
      title={"Sign In"}
      label={"Login to your account"}
      navigationHref={"/sign-up"}
      navigationText={"Don't have an account?"}
    >
      <SignInForm />
    </AuthCardWrapper>
  );
};

export default SignIn;
