import { z } from "zod";

const ChatFormSchema = z.object({
  message: z.string().min(1, "Please type something to send!"),
});

export default ChatFormSchema;
