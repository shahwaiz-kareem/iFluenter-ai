"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormDescription } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { avatarSchema } from "@/lib/validator/admin.avatar";
import { fileToBase64 } from "@/lib/utils";
import { SelectField } from "@/components/shared/SelectField";

export default function AvatarForm({
  currentAvatar,
  avatarId,
  setAvatarId,
  setAvatars,
  avatars,
}) {
  const { toast } = useToast();

  //todo: Addition care for actModes
  const initialValues = {
    name: currentAvatar?.name || "",
    gender: currentAvatar?.gender || "male",
    bio: currentAvatar?.bio || "",
    url: currentAvatar?.url || "",
    preview: currentAvatar?.preview || "",
    isActive: currentAvatar?.isActive || false,
    forTier: currentAvatar?.forTier || "pro",
    actModes: currentAvatar?.actModes?.join(" ,") || "",
  };
  const form = useForm({
    resolver: zodResolver(avatarSchema),
    defaultValues: initialValues,
  });

  const {
    formState: { isSubmitting },
  } = form;

  // console.log(form.getValues());
  const onSubmit = async (values) => {
    try {
      const postBody = {
        avatarId: avatarId,
        ...values,
        actModes: values.actModes.split(",").map((a) => a.trim()),
      };

      const upsert = await fetch(`/api/admin/avatar/upsert`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(postBody),

        headers: {
          "Content-Type": "application/json",
          // Accept: "application/json",
        },
      });
      const response = await upsert.json();

      if (response.status !== "success" || !avatarId)
        throw new Error(response.message || "Operation Failed");
      if (avatarId === "new") {
        setAvatars((prev) => [...prev, response.avatar]);
      } else {
        const updateIndex = avatars.findIndex((e) => e._id === avatarId);
        const newAvatars = avatars;
        newAvatars[updateIndex] = response.avatar;
        setAvatars(newAvatars);
      }
      setAvatarId("");
      toast({
        title: "Success",
        description:
          response?.message || "users settings have been applied successfully!",
        variant: "outline",
      });
    } catch (error) {
      toast({
        title: "Failed",
        description: error.message || "Something went wrong!",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
        <div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter avatar's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personality</FormLabel>
                <FormControl>
                  <Input placeholder="Enter avatar's bio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="actModes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Act Modes</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Act modes, separate by comma"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Separate by comma eg: apple,orange,banana
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="my-2">
            <SelectField
              control={form.control}
              name="gender"
              className="p-4"
              label="Gender"
              placeholder="Select avatar's gender"
              options={[
                { value: "male", label: "male" },
                { value: "female", label: "female" },
              ]}
            />
          </div>
          <div className="my-2 flex flex-col gap-2">
            <SelectField
              control={form.control}
              name="isActive"
              className="p-4"
              label="Active"
              placeholder="Select is active"
              options={[
                { value: true, label: "Yes" },
                { value: false, label: "No" },
              ]}
            />
          </div>
          <div className="my-2 flex flex-col gap-2">
            <SelectField
              control={form.control}
              name="forTier"
              className="p-4"
              label="For Tier"
              placeholder="Select is active"
              options={[
                { value: "free", label: "Free" },
                { value: "pro", label: "Pro" },
              ]}
            />
          </div>
          {avatarId === "new" && (
            <>
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar Model</FormLabel>
                    <FormControl>
                      <Input
                        accept=".glb"
                        type="file"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          field.onChange(await fileToBase64(file));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preview"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preview Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          field.onChange(await fileToBase64(file));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <Button className="w-full md:w-32" type="submit">
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin text-white" />
              Please wait
            </span>
          ) : avatarId === "new" ? (
            "Create"
          ) : (
            "Update"
          )}
        </Button>
      </form>
    </Form>
  );
}
