"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Loader2, SendHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ChatFormSchema from "@/lib/validator/chatForm";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useRef } from "react";
import { socketContext } from "@/context/SocketProvider";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectPreferences } from "@/lib/features/preferences/preferences.slice";
import { selectRecentMessages } from "@/lib/features/chat/message.slice";

const ChatForm = ({ isDataSent, setIsDataSent }) => {
  //Note: we are sending text not voice or audio. isDataSent can sound incorrect but it is used to avoid creation of separate state.

  const context = useContext(socketContext);
  const { socket } = context;
  const preferences = useAppSelector(selectPreferences);
  const selectRecentMsgs = useAppSelector(selectRecentMessages);
  const chatMessages = selectRecentMsgs
    .slice(Number(process.env.NEXT_PUBLIC_AI_CONTEXT_MSG_COUNT.toString()))
    .map((msg) => ({
      userMessage: msg.message,
      aiResponse: msg.aiResponse,
    }));
  const form = useForm({
    resolver: zodResolver(ChatFormSchema),
    defaultValues: {
      message: "",
    },
  });

  const {
    formState: { isSubmitting },
    reset,
    setFocus,
  } = form;

  const onSubmit = async (values) => {
    setFocus("message");
    socket.emit("message", values.message, {
      chatMessages: JSON.stringify(chatMessages),
      topic: preferences?.recentChats[0]?.topic || "",
    });
    setIsDataSent(true);

    reset();
  };
  return (
    <Form {...form}>
      <form
        className="flex  flex-row items-center gap-2 justify-between w-full "
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="w-full rounded ">
              <FormControl>
                <Input
                  type="text"
                  className="w-full py-6 bg-black/80 backdrop-blur  text-white"
                  placeholder="Your message..."
                  {...field}
                />
              </FormControl>
              <FormMessage className="font-bold absolute top-6 left-4" />
            </FormItem>
          )}
        />

        <Button
          className="w-16 py-4 disabled:bg-muted-foreground/80 disabled:text-primary h-full hover:bg-primary/90 bg-primary"
          type="submit"
          disabled={isDataSent}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin text-primary-foreground" />
            </span>
          ) : (
            <SendHorizontal className="text-primary-foreground " />
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ChatForm;
