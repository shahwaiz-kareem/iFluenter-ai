import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

const AvatarsDisplay = ({ avatars, setAvatarId }) => {
  return (
    <div className="flex justify-center mt-6 flex-wrap gap-4  overflow-y-auto">
      {avatars?.map((avatar) => (
        <Card
          className="hover:shadow-xl w-96"
          onClick={() => {
            console.log("clicked", avatar);
            setAvatarId(avatar._id);
          }}
          key={avatar._id}
        >
          <CardHeader>
            <CardTitle className="text-lg">{avatar.name}</CardTitle>
            <CardDescription>{avatar.bio}</CardDescription>
          </CardHeader>
          <CardContent className="font-normal text-base">
            <div className="mb-4 h-40 w-40 mx-auto">
              <Image
                height={200}
                width={200}
                src={avatar.preview}
                alt="Avatar's preview"
                className="rounded-full object-cover h-full w-full"
              />
            </div>
            <p>Gender: {avatar.gender}</p>
            <div className="flex items-center  gap-2">
              Active:
              <Badge
                className={avatar.isActive ? "bg-green-500" : "bg-yellow-500"}
              >
                {avatar.isActive ? "Active" : "inactive"}
              </Badge>
            </div>
            <p>Act mode: {avatar.actModes.join(", ")}</p>
            <p className="break-words">Avatar url: {avatar.url}</p>
            <p>For Tier: {avatar.forTier}</p>
            <p>Created at: {new Date(avatar.createdAt).toDateString()}</p>
            <p>Updated at: {new Date(avatar.updatedAt).toDateString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AvatarsDisplay;
