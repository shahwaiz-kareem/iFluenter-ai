import Image from "next/image";
import Link from "next/link";
import React from "react";
import InfoBanner from "../InfoBanner";

const SidebarHeaderContent = () => {
  return (
    <>
      <div className="flex items-center pl-1 py-2 gap-2">
        <Link href="/">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={50}
            height={50}
            priority
            className="w-auto h-9 rounded-lg"
          />
        </Link>
      </div>
    </>
  );
};
export default SidebarHeaderContent;
