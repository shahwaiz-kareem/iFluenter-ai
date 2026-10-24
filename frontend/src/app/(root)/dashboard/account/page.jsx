import UserStoreProvider from "@/app/store/UserStoreProvider";
import AccountTabs from "@/components/account/AccountTabs";
import ProfileCard from "@/components/dashboard/ProfileCard";

const page = async () => {
  return (
    <div className="flex flex-1 max-w-3xl flex-col gap-4 p-4">
      <ProfileCard />
      <UserStoreProvider>
        <AccountTabs />
      </UserStoreProvider>
    </div>
  );
};

export default page;
