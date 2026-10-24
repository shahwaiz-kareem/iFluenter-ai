import AuthCardWrapper from "@/components/cards/AuthCardWrapper";
import { SignUpForm } from "@/components/forms/SignUpForm";

export const metadata = {
  title: "iFluenter || Sign Up ",
  description: "Sign Up to iFluenter.",
};

const SignUp = () => {
  return (
    <AuthCardWrapper
      title={"Sign Up"}
      label={"Create a new account"}
      navigationHref={"/sign-in"}
      navigationText={"Already have an account?"}
    >
      <SignUpForm />
    </AuthCardWrapper>
  );
};

export default SignUp;
