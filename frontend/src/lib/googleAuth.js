const handleGoogleAuth = () => {
  window.open(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/auth/google`, "_self");
};

export default handleGoogleAuth;
