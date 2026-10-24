import ChatSessionStats from "@/components/admin/stats/ChatSessionStats";
import UsersStats from "@/components/admin/stats/UsersStats";
import { headers } from "next/headers";

const Stats = async () => {
  const headersList = await headers();
  const cookie = headersList.get("cookie");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/admin/stats`,

    {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        cookie,
      },
    }
  );

  const { data } = await res.json();

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Statistics</h1>
      <UsersStats users={data.users} />
      <ChatSessionStats sessions={data.sessions} />
    </div>
  );
};

export default Stats;
