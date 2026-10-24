"use client";

import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/shared/SplashScreen";
import InfoBanner from "@/components/shared/InfoBanner";
export const userContext = createContext();

const UserProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [systemConfig, setSystemConfig] = useState(null);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // console.log("once or twice");
    // router.refresh();
    const controller = new AbortController();
    const signal = controller.signal;
    // router.push("/sign-in");
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/user/profile`, {
          method: "GET",
          credentials: "include",
          signal,
        });
        // console.log("data", res, await res.json());
        if (!res.ok

        ) return router.push("/sign-in");
        const data = await res.json();
        const user = data.user;
        localStorage.setItem("bannerData", JSON.stringify(data.bannerData));
        if (!localStorage.getItem("existingBannerId"))
          localStorage.setItem("existingBannerId", data?.bannerData?.id);

        //Todo: Make a suspended page and redirect if user is suspended
        if (data?.status === "success") {
          // console.log(user);
          if (!user.isVerified) return router.push("/account/verify-email");

          if (!user.isOnboarded) return router.push("/onboarding");
          // if (!user.isOnboarded) return router.push("/onboarding");

          if (user.subscriptionStatus === "free")
            return router.push(
              `/pricing?name=${user.name}&email=${user.email}`
            );

          if (user.subscriptionExpired)
            return router.push(
              `/manage-subscription/?status=${(user.subscriptionStatus ===
                "expired" || user.subscriptionExpired
                ? "expired"
                : user.subscriptionStatus
              ).trim()}`
            );

          setUser(data?.user);
          setSystemConfig(data?.systemConfig);
          setIsLoading(false);
        } else {
          router.push("/sign-in");
        }
      } catch (error) {
        router.push("/sign-in");
      }
    };
    fetchUser();
    return () => controller.abort();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <SplashScreen />
      </div>
    );
  }

  return (
    <userContext.Provider
      value={{
        userData: user,
        systemConfig,
        setUserData: setUser,
        openLogoutModal,
        setOpenLogoutModal,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default UserProvider;
