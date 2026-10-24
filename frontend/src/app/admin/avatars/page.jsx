import AvatarsContainer from "@/components/admin/avatars/AvatarsContainer";
import { headers } from "next/headers";

const page = async () => {
  const headersList = await headers();
  const cookie = headersList.get("cookie");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/admin/avatar/avatars`,
    {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        cookie,
      },
    }
  );

  const data = await res.json();

  return <AvatarsContainer avatars={data?.avatars} />;
};

export default page;
