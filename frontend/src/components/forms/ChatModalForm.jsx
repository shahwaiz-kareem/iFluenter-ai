"use client";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { Plus, History, Mic2, AudioLines, Loader2, Loader } from "lucide-react";
import ModalCarousel from "../dashboard/ModalCarousel";
import { CarouselItem } from "../ui/carousel";
import { difficultyOptions, topicOptions } from "@/constant/chatRoom";
import { useToast } from "@/hooks/use-toast";
import {
  useLazyGetPreferencesQuery,
  useUpsertPreferencesMutation,
} from "@/lib/features/services/preferencesApi";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks";
import {
  selectChatType,
  selectPreferences,
  setChatType,
  setPreferences,
  selectCaptionsActive,
  toggleCaptionsActive,
} from "@/lib/features/preferences/preferences.slice.js";
import {
  selectAssetsKeys,
  selectChats,
  selectSessionCreated,
  setAssetsKeys,
  setChats,
  setIsModalOpen,
  setSessionCreated,
} from "@/lib/features/chat/chat.slice.js";
import { usePathname, useRouter } from "next/navigation";
import useGetAssets from "@/hooks/useGetAssets";
import ChatsScrollLoad from "../dashboard/chatRoom/ChatsScrollLoad";
import ChatDisplayElement from "../dashboard/chatRoom/ChatDisplayElement";
import { userContext } from "@/context/UserProvider";
import PremiumWrapper from "../shared/PremiumWrapper";
import { socketContext } from "@/context/SocketProvider";
import { persistor } from "@/lib/store/store";
import { useUpsertChatMutation } from "@/lib/features/services/chatApi";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

const ChatModalForm = ({ vad, vadRef }) => {
  const { socket } = useContext(socketContext);
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const chatType = useAppSelector(selectChatType);
  const preferences = useAppSelector(selectPreferences);
  const assetsKey = useAppSelector(selectAssetsKeys);
  const { userData } = useContext(userContext);
  const isUserFree = userData?.subscriptionExpired;
  const fetchedChats = useAppSelector(selectChats);
  const isCaptionsActive = useAppSelector(selectCaptionsActive);
  const sessionCreated = useAppSelector(selectSessionCreated);
  const [parentScrolling, setParentScrolling] = useState(false);
  const [chatCrudType, setChatCrudType] = useState("");
  const [triggerGetPreference, { isLoading }] = useLazyGetPreferencesQuery();

  const [upsertPreferences] = useUpsertPreferencesMutation();
  const [upsertChat] = useUpsertChatMutation();
  const { getAssets } = useGetAssets(vadRef);
  const router = useRouter();
  const pathname = usePathname();
  const chatMode = pathname.split("/").slice(-1)[0];
  // console.log("chatmode", preferences);
  const bunnyLoader = ({ src }) => {
    return `${src}`;
  };
  const form = useForm({
    defaultValues: {
      typedTopic: "",
      selectedTopic: "",
      accent: preferences?.accent,
      difficulty: preferences?.difficulty,
      speechSpeed: preferences?.speechSpeed,
      redemptionMs: preferences?.redemptionMs,
    },
  });

  useEffect(() => {
    if (!chatMode) router.push("/dashboard");
    //set the selected Chat id
    vad?.pause();

    if (preferences.initialized) {
      // Initialize from localStorage if data available
      form.reset(preferences);
    }
    if (
      !preferences.recentChats[chatMode] ||
      preferences?.recentChats[chatMode]?.length === 0
    ) {
      dispatch(setChatType("new"));
    }
    if (
      preferences.recentChats[chatMode] &&
      preferences?.recentChats[chatMode]?.length > 0
    ) {
      dispatch(
        setPreferences({
          selectedChat: preferences.recentChats[chatMode][0]._id,
        })
      );
    }

    const initializeData = async () => {
      try {
        if (
          preferences?.initialized &&
          preferences.recentChats[chatMode] &&
          preferences.recentChats[chatMode].length > 0
        )
          return;
        const data = await triggerGetPreference({ chatMode }).unwrap();
        // console.log("the data is ", data);
        if (data && data?.status === "success") {
          if (data?.recentChats?.length > 0) {
            dispatch(setChatType("previous"));
          }
          // console.log("1) The  data got in useEffect, initializeData", data);
          dispatch(
            setPreferences({
              accent: data?.accent,
              avatar: data?.avatar,
              avatars: data?.avatars,
              recentChats: {
                ...structuredClone(preferences.recentChats),
                [chatMode]: data?.recentChats,
              },
              env: data?.env,
              envs: data?.envs,
              difficulty: data?.difficulty,
              speechSpeed: data?.speechSpeed,
              selectedChat: data.recentChats[0]?._id || "",
              initialized: true,
            })
          );
        }
        form.reset({
          accent: data?.accent || "us",
          difficulty: data?.difficulty || "easy",
          speechSpeed: data?.speechSpeed || 0,
        });
      } catch (error) {
        console.log(error.message);
        toast({
          description: "Sorry, Unable to proceed!",
          variant: "destructive",
        });
      }
    };
    initializeData();

    return () => {
      dispatch(setPreferences({ chatType: "previous" }));
      form.reset({ typedTopic: "" });
    };
  }, []);

  const onSubmit = async (data) => {
    vad?.pause();
    // console.log("2) Preferences before submitting", preferences);

    try {
      if (chatType === "new" && !data?.typedTopic && !data?.selectedTopic) {
        form.setError(
          "typedTopic",
          {
            message: "Please enter or select a topic",
          },
          { shouldFocus: true }
        );
        return;
      }

      let newChatId = "";
      if (chatType === "new" && (data?.typedTopic || data?.selectedTopic)) {
        const newChat = await upsertChat({
          topic: data?.typedTopic || data?.selectedTopic,
          chatMode,
        }).unwrap();
        newChatId = newChat?.data?.upsertedId;
      }

      if (chatType === "previous") {
        const lastRecentChat =
          preferences?.recentChats?.[chatMode].slice(-1)[0];
        const filteredChats = fetchedChats?.filter(
          (chat) => chat._id !== preferences?.selectedChat
        );
        dispatch(
          setChats({
            chats:
              fetchedChats[0]?._id === preferences?.selectedChat
                ? [lastRecentChat, ...filteredChats]
                : filteredChats,
          })
        );
      }

      const preferencesData = {
        chatId: newChatId || preferences?.selectedChat || null,
        chatMode,
        chatSettings: {
          avatar: preferences?.avatar || preferences?.avatars[0],
          env: preferences?.env || preferences?.envs[0],
          accent: data?.accent,
          difficulty: data?.difficulty,
          selectedChat: newChatId || preferences?.selectedChat,
          speechSpeed: data?.speechSpeed || 0,
          redemptionMs: data?.redemptionMs,
          captionsActive: preferences.captionsActive,
          voiceControl: preferences?.voiceControl || 0,
        },
      };

      // console.log("3) preferencesData in submit", preferencesData);

      const selectedChatArr = preferences.recentChats[chatMode]?.filter(
        (chat) => chat._id === preferences?.selectedChat
      );

      socket.emit("chat-preferences", {
        chatId: newChatId || preferences?.selectedChat,
        avatarDetails: preferences?.avatar || preferences?.avatars[0],
        chatMode,
        topic:
          data?.selectedTopic ||
          data?.typedTopic ||
          selectedChatArr?.[0]?.topic ||
          "",
        preferences: {
          accent: data?.accent,
          difficulty: data?.difficulty,
          speechSpeed: data?.speechSpeed || 0,
        },
      });

      const avatarChanged =
        preferencesData.chatSettings?.avatar?._id !== assetsKey.avatar;
      const envChanged =
        preferencesData.chatSettings?.env?._id !== assetsKey.env;
      if (!avatarChanged && !envChanged) dispatch(setIsModalOpen(false));

      const updatedPref = await upsertPreferences(preferencesData).unwrap();

      // console.log("4) updatedPref in submit", updatedPref);
      const leftAvatars = updatedPref?.data?.avatars?.filter(
        (item) => item?._id !== preferences?.avatar?._id
      );
      const leftEnvs = updatedPref?.data?.envs?.filter(
        (item) => item?._id !== preferences?.env?._id
      );

      dispatch(
        setPreferences({
          ...preferencesData.chatSettings,
          chatType: "previous",
          avatars: [preferencesData.chatSettings.avatar, ...leftAvatars],
          envs: [preferencesData.chatSettings.env, ...leftEnvs],
          recentChats: {
            ...structuredClone(preferences.recentChats),
            [chatMode]: updatedPref?.data?.recentChats,
          },
        })
      );

      if (!sessionCreated) {
        dispatch(setSessionCreated(true));
      }

      if (!avatarChanged && !envChanged) return;
      // console.log("5) Data going inside getAssets", {
      //   avatarId: updatedPref?.data?.avatar,
      //   avatarUrl: preferences?.avatar?.url,
      //   envId: updatedPref?.data?.env,
      //   envUrl: preferences?.env?.url,
      //   avatarChanged,
      //   envChanged,
      //   animationsArr: ["standing", "idle", "talking"],
      // });

      await getAssets({
        avatarId: preferences?.avatar?._id,
        avatarUrl: preferences?.avatar?.url,
        envId: preferences?.env?._id,
        envUrl: preferences?.env?.url,
        avatarChanged,
        envChanged,
        animationsArr: ["standing", "idle", "talking"],
      });

      dispatch(
        setAssetsKeys({
          avatar: preferencesData.chatSettings?.avatar?._id,
          env: preferencesData.chatSettings?.env?._id,
        })
      );
    } catch (error) {
      console.log(error);
      await persistor.purge();
      toast({
        description: "Sorry, failed to continue!",
        variant: "destructive",
      });
      router.push("/dashboard");
    }
  };

  if (!preferences.initialized && isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative flex flex-col h-full w-full overflow-hidden"
      >
        <div
          className="flex-grow space-y-5 px-2 md:px-4 overflow-y-auto pb-10 custom-scrollbar"
          onScroll={() => setParentScrolling(true)}
          onScrollEnd={() => setParentScrolling(false)}
        >
          <div className=" bg-background/95 backdrop-blur-md py-3">
            <div className="flex gap-2 p-1.5 bg-secondary/50 border border-border rounded-xl">
              <Button
                type="button"
                onClick={() => dispatch(setChatType("new"))}
                className={`flex-1 py-2 rounded-lg transition-all gap-2 border-none shadow-none ${
                  chatType === "new"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-transparent hover:bg-background text-muted-foreground"
                }`}
              >
                <Plus className="w-4 h-4" />
                <span className="font-bold text-xs uppercase tracking-tight">
                  New Chat
                </span>
              </Button>
              <Button
                type="button"
                onClick={() => dispatch(setChatType("previous"))}
                disabled={!preferences?.recentChats[chatMode]?.length}
                className={`flex-1 py-2 rounded-lg transition-all gap-2 border-none shadow-none ${
                  chatType === "previous"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-transparent hover:bg-background text-muted-foreground"
                }`}
              >
                <History className="w-4 h-4" />
                <span className="font-bold text-xs uppercase tracking-tight">
                  Previous
                </span>
              </Button>
            </div>
          </div>

          {chatType === "previous" && (
            <Card className="w-full border-2 border-dashed bg-accent/20 border-border">
              <CardContent className="p-2 h-64 sm:h-72 overflow-y-auto custom-scrollbar">
                {!isLoading &&
                preferences?.recentChats?.[chatMode]?.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {preferences.recentChats?.[chatMode].map(
                      (chat, chatIndex) => (
                        <ChatDisplayElement
                          chat={chat}
                          key={chat._id}
                          isRecentChat={true}
                          chatIndex={chatIndex}
                          chatCrudType={chatCrudType}
                          setChatCrudType={setChatCrudType}
                        />
                      )
                    )}
                    <ChatsScrollLoad
                      parentScrolling={parentScrolling}
                      chatCrudType={chatCrudType}
                      setChatCrudType={setChatCrudType}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-10 text-muted-foreground">
                    {isLoading ? (
                      <Loader2 className="animate-spin text-primary" />
                    ) : (
                      <p className="text-sm">No history found</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {chatType === "new" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                    1
                  </span>
                  Conversation Topic
                </h2>
                <FormField
                  control={form.control}
                  name="selectedTopic"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(val) => {
                          field.onChange(val);
                          form.setValue("typedTopic", "");
                        }}
                        value={field.value}
                      >
                        <SelectTrigger className="h-12 bg-background border-border shadow-sm">
                          <SelectValue placeholder="Choose a conversation starter" />
                        </SelectTrigger>
                        <SelectContent>
                          {topicOptions.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-border" />
                  <span className="mx-4 text-[10px] font-bold text-muted-foreground/40 uppercase">
                    OR
                  </span>
                  <div className="flex-grow border-t border-border" />
                </div>

                <FormField
                  control={form.control}
                  name="typedTopic"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your own topic..."
                          className="h-12 bg-background border-border focus-visible:ring-primary shadow-sm"
                          onChange={(e) => {
                            field.onChange(e);
                            form.setValue("selectedTopic", "");
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                2
              </span>
              Select Avatar
            </h2>
            <PremiumWrapper iconClass="scale-110">
              <ModalCarousel item="avatar">
                {preferences?.avatars?.map((avatar) => (
                  <CarouselItem key={avatar?._id}>
                    <Card className="py-8 border-none bg-accent/20 shadow-none">
                      <CardContent className="flex flex-col items-center gap-6">
                        <Avatar className="w-32 h-32 ring-4 ring-background shadow-xl">
                          {avatar?.preview ? (
                            <Image
                              src={avatar.preview}
                              alt={avatar?.name}
                              height={160}
                              width={160}
                              loader={bunnyLoader}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <AvatarFallback className="text-2xl">
                              {avatar.name[0]}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="text-center space-y-2">
                          <p className="text-2xl font-bold tracking-tight">
                            {avatar.name}
                          </p>
                          <p className="text-sm text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                            {avatar.bio}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </ModalCarousel>
            </PremiumWrapper>
          </section>

          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                3
              </span>
              Environment
            </h2>
            <PremiumWrapper iconClass="scale-110">
              <ModalCarousel item="env">
                {preferences?.envs?.map((env) => (
                  <CarouselItem key={env?._id} className="w-full h-72">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border">
                      {env?.preview && (
                        <Image
                          src={env?.preview}
                          fill
                          loader={bunnyLoader}
                          className="object-cover"
                          alt={env?.name}
                        />
                      )}
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                        <p className="text-white font-bold">{env.name}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </ModalCarousel>
            </PremiumWrapper>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2.5">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-[10px] ring-1 ring-primary/20">
                  4
                </span>
                Vocabulary Difficulty
              </h2>
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-background border-border shadow-sm hover:border-primary/50 transition-colors focus:ring-primary">
                          <SelectValue placeholder="Select your level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-border shadow-xl">
                        {difficultyOptions.map((opt) => (
                          <SelectItem
                            key={opt.value}
                            value={opt.value}
                            className="focus:bg-accent focus:text-primary"
                          >
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2.5">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-[10px] ring-1 ring-primary/20">
                  5
                </span>
                Interaction Mode
              </h2>

              <div className="flex h-12 w-full p- border border-border rounded-2xl bg-secondary/30 backdrop-blur-sm shadow-inner gap-2">
                {/* Manual Option */}
                <button
                  type="button"
                  onClick={() =>
                    dispatch(setPreferences({ voiceControl: "manual" }))
                  }
                  className={`flex items-center justify-center gap-2.5 rounded-xl transition-all duration-500 ease-in-out font-bold text-[11px] uppercase tracking-tight active:scale-[0.98] ${
                    preferences.voiceControl === "manual"
                      ? "flex-[2] bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "flex-1 text-muted-foreground hover:bg-background/50"
                  }`}
                >
                  <Mic2 size={16} strokeWidth={2.5} />
                  <span>Press Hold</span>
                </button>

                {/* Automatic Option */}
                <PremiumWrapper
                  containerClass={`transition-all duration-500 ease-in-out flex ${
                    preferences.voiceControl === "auto" ? "flex-[2]" : "flex-1"
                  }`}
                  iconClass="-top-2 -right-1 scale-110 drop-shadow-md"
                >
                  <button
                    type="button"
                    disabled={isUserFree}
                    onClick={() =>
                      dispatch(setPreferences({ voiceControl: "auto" }))
                    }
                    className={`w-full h-full flex items-center justify-center gap-2.5 rounded-xl transition-all duration-500 font-bold text-[11px] uppercase tracking-tight active:scale-[0.98] disabled:opacity-40 ${
                      preferences.voiceControl === "auto"
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "text-muted-foreground hover:bg-background/50"
                    }`}
                  >
                    <AudioLines size={16} strokeWidth={2.5} />
                    <span>No Touch</span>
                  </button>
                </PremiumWrapper>
              </div>
            </div>
          </div>
          {/* <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                  7
                </span>
                Redemption Seconds
              </h2>
              <span className="text-sm font-bold text-primary">
                {form.watch("redemptionMs") / 1000} sec
              </span>
            </div>
            <FormField
              control={form.control}
              name="redemptionMs"
              render={({ field }) => (
                <Slider
                  disabled={preferences.voiceControl === "manual"}
                  onValueChange={(val) => field.onChange(val[0])}
                  value={[field.value]}
                  max={3000}
                  min={300}
                  step={100}
                  className="py-2 "
                />
              )}
            />
          </div> */}

          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                  6
                </span>
                Speech Speed
              </h2>
              <span className="text-sm font-bold text-primary">
                {2 * form.watch("speechSpeed")}x
              </span>
            </div>
            <FormField
              control={form.control}
              name="speechSpeed"
              render={({ field }) => (
                <Slider
                  onValueChange={(val) => field.onChange(val[0])}
                  value={[field.value]}
                  max={1}
                  min={-0.5}
                  step={0.1}
                  className="py-2"
                />
              )}
            />
          </div>
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                7
              </span>
              Captions
            </h2>

            <div className="flex items-center  gap-2">
              <Switch
                id="captions-switch"
                checked={isCaptionsActive}
                onCheckedChange={() => dispatch(toggleCaptionsActive())}
              />
              <Label
                htmlFor="captions-switch"
                className="font-semibold text-muted-foreground"
              >
                {isCaptionsActive ? "On" : "Off"}
              </Label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-auto pt-4 border-t border-border bg-background px-2 ">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full h-10 text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] transition-transform active:scale-95"
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting Up...
              </>
            ) : (
              "Let's Go"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ChatModalForm;
