"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import UserMutationForm from "../users/UserMutationForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EnvForm from "../envs/EnvForm";
import AvatarForm from "../avatars/AvatarForm";

const FormSheet = ({ itemId, data, setItemId, setData, sheetFor }) => {
  const user = data?.find((e) => e.id === itemId);

  return (
    <Sheet
      onOpenChange={() => setItemId("")}
      modal={false}
      key={sheetFor === "user" ? "" : itemId}
      // defaultOpen={false}
      open={!!itemId}
    >
      <SheetContent
        onInteractOutside={(e) => e.preventDefault()}
        side={"right"}
        className="overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-2xl capitalize">
            {sheetFor} Form
          </SheetTitle>
          <SheetDescription>Create or update</SheetDescription>
        </SheetHeader>

        <div className="">
          {sheetFor === "user" && (
            <Card className="my-4 mr-2">
              <CardHeader>
                <CardTitle>User Details</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                {user &&
                  Object.keys(user)?.map((key) => {
                    return (
                      <div
                        key={key}
                        className="flex item-center justify-start flex-cl py-2 gap-4"
                      >
                        <Badge className=" bg-primary ">{key}</Badge>
                        <div className={"text-sm text-primary"}>
                          {[
                            "createdAt",
                            "updatedAt",
                            "renewsAt",
                            "subscriptionCreatedAt",
                            "subscriptionEndsAt",
                          ].includes(key)
                            ? new Date(user[key]).toDateString()
                            : (typeof user[key] === "boolean" &&
                                String(user[key])) ||
                              user[key] ||
                              "--"}
                        </div>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          )}
          {sheetFor === "user" ? (
            <UserMutationForm
              selectedUser={data?.find((e) => e.id === itemId)}
              users={data}
              setUsers={setData}
              setUserId={setItemId}
            />
          ) : sheetFor === "avatar" ? (
            <AvatarForm
              currentAvatar={
                itemId === "new" ? {} : data?.find((e) => e._id === itemId)
              }
              avatarId={itemId}
              avatars={data}
              setAvatars={setData}
              setAvatarId={setItemId}
            />
          ) : (
            <EnvForm
              envId={itemId}
              currentEnv={
                itemId === "new" ? {} : data?.find((e) => e._id === itemId)
              }
              envs={data}
              setEnvId={setItemId}
              setEnvs={setData}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FormSheet;
