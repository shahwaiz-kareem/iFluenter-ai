"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { accountTabs } from "@/constant/tabs";
import ProfileTab from "../forms/ProfileTab";
import ChangePassword from "../forms/ChangePassword";
import ResetEmail from "../forms/ResetEmail";
import { Card } from "../ui/card";
import SubscriptionTab from "./SubscriptionTab";
import { useContext } from "react";
import { userContext } from "@/context/UserProvider";

const AccountTabs = () => {
  const { userData } = useContext(userContext);
  const planName = userData?.variantName;

  return (
    <section>
      <Tabs defaultValue="profile" className="w-full ">
        <TabsList className="w-full  py-6 ">
          {accountTabs.map((tab) => (
            <TabsTrigger
              className="w-full p-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center  justify-center gap-2"
              key={tab?.value}
              value={tab?.value}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="max-sm:hidden ">{tab.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent className="mt-4 rounded-md h-full w-full" value="profile">
          <Card className="p-6 w-full">
            <ProfileTab />
          </Card>
        </TabsContent>
        <TabsContent className="flex flex-col gap-4" value="security">
          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-bold ">Reset Email</h2>
            <Card className=" p-5  mt-2 rounded-md h-full w-full">
              <ResetEmail userData={userData} />
            </Card>
          </section>
          {userData?.signupSource === "Email" ? (
            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-bold ">Reset Password</h2>
              <Card className=" p-6 mt-2 rounded-md h-full w-full">
                <ChangePassword />
              </Card>
            </section>
          ) : null}
        </TabsContent>
        <TabsContent
          className="mt-r rounded-md h-full w-full"
          value="subscription"
        >
          <h2 className="text-lg font-bold mb-4 ">Subscription</h2>

          <SubscriptionTab
            planName={planName}
            status={userData?.subscriptionStatus}
            // customerPortal={customerPortal}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AccountTabs;
