import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

const EnvsDisplay = ({ envs, setEnvId }) => {
  return (
    <div className="flex justify-center mt-6 flex-wrap gap-4  overflow-y-auto">
      {envs?.map((env) => (
        <Card
          className="hover:shadow-xl w-96 "
          onClick={() => setEnvId(env._id)}
          key={env._id}
        >
          <CardHeader>
            <CardTitle className="text-lg">{env.name}</CardTitle>
            <CardDescription>{env.bio}</CardDescription>
          </CardHeader>
          <CardContent className="font-normal text-base">
            <div className="mb-4">
              <Image
                height={600}
                width={500}
                src={env.preview}
                alt="env's preview"
                className="rounded-lg h-full w-full"
              />
            </div>
            <p>Gender: {env.gender}</p>
            <div className="flex items-center  gap-2">
              Active:
              <Badge
                className={env.isActive ? "bg-green-500" : "bg-yellow-500"}
              >
                {env.isActive ? "Active" : "inactive"}
              </Badge>
            </div>
            <p>Act mode: {env.actModes.join(", ")}</p>
            <p>For Tier: {env.forTier}</p>
            <p className="break-words">env url: {env.url}</p>
            <p>Created at: {new Date(env.createdAt).toDateString()}</p>
            <p>Updated at: {new Date(env.updatedAt).toDateString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnvsDisplay;
