import EnvsContainer from "@/components/admin/envs/EnvContainer";
import { headers } from "next/headers";

const page = async () => {
  const headersList = await headers();
  const cookie = headersList.get("cookie");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/admin/env/envs`,
    {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        cookie,
      },
    }
  );

  const data = await res.json();

  return (
    <div>
      <EnvsContainer envs={data?.envs} />
    </div>
  );
};

export default page;
