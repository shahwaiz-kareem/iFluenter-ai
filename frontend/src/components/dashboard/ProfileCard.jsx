"use client";
import { userContext } from "@/context/UserProvider";
import { useContext } from "react";

const ProfileCard = () => {
  const { userData } = useContext(userContext);
  const { profileImage, name, email } = userData;
  return (
    <div className="flex items-center py-4 space-x-4 rounded-lg">
      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-orange-600 text-white  font-bold">
        {profileImage ? (
          <img
            src={profileImage}
            alt={name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          name?.charAt(0).toUpperCase()
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold capitalize text-foreground">
          {name}
        </h2>
        <p className="text-sm text-white/60 ">{email}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
