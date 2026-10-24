import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, Loader2, MessageSquareQuote, Lightbulb } from "lucide-react";
import { useGetFeedbackMutation } from "@/lib/features/services/messageApi";
import { memo, useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectMessageFocusIndex } from "@/lib/features/chat/message.slice";
import { usePathname } from "next/navigation";

const MessageCard = ({
  isUserMessage,
  message,
  aiFeedback,
  messageId,
  tabIndex,
  messageType,
}) => {
  const [feedback, setFeedback] = useState(aiFeedback);
  const [isExpanded, setIsExpanded] = useState(false);
  const [getFeedback, { isLoading }] = useGetFeedbackMutation();
  const messageFocusIndex = useAppSelector(selectMessageFocusIndex);
  const { toast } = useToast();
  const feedbackRef = useRef();
  const messageRef = useRef();
  const pathname = usePathname();
  const chatMode = pathname.split("/").slice(-1)[0];

  useEffect(() => {
    if (tabIndex === undefined || !messageType || !messageRef.current) return;

    const isTarget =
      tabIndex === messageFocusIndex.index &&
      messageFocusIndex.messageType === messageType;

    if (isTarget) {
      messageRef.current.scrollIntoView();
    }
  }, [messageFocusIndex, tabIndex, messageType]);

  const requestFeedback = async () => {
    try {
      if (feedback || !isUserMessage) return;
      const res = await getFeedback({ message, messageId }).unwrap();
      setFeedback(res?.data);
    } catch (error) {
      toast({
        description: "Unable to get feedback!",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      ref={messageRef}
      tabIndex={tabIndex}
      className={`flex outline-none transition-all duration-300 even:self-end flex-col bg-primary even:bg-muted-foreground/20 rounded-2xl rounded-tl-none p-4 ${
        isExpanded ? "w-full max-w-full" : "max-w-60"
      }`}
    >
      <Card className="shadow-none items-center bg-transparent border-none outline-none justify-center flex-col gap-2">
        <p
          className={`break-words ${
            isUserMessage ? "text-primary-foreground" : "text-gray-100"
          }`}
        >
          {message.replaceAll("Eye-fluent-er", "iFluenter")}
        </p>
        {isUserMessage && chatMode === "conversation" && (
          <Accordion
            className="w-full"
            type="single"
            collapsible
            onValueChange={(value) => setIsExpanded(!!value)}
          >
            <AccordionItem
              ref={feedbackRef}
              onClick={requestFeedback}
              className="border-b-0"
              value="item-1"
            >
              <AccordionTrigger className="py-1 pt-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-600 shadow-md">
                    <MessageSquareQuote size={14} className="text-white" />
                  </span>
                  <p className="text-sm font-semibold text-primary-foreground/90">
                    Feedback?
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2
                      size={18}
                      className="animate-spin text-primary-foreground"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 w-full overflow-hidden p-4 bg-background/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl">
                    <div className="flex flex-col gap-1 border-b border-border pb-3">
                      <h3 className="text-base font-bold text-foreground">
                        Insights
                      </h3>
                      <p className="text-sm text-primary font-medium italic">
                        "{feedback?.eitherSay}"
                      </p>
                    </div>

                    <div className="space-y-4">
                      {feedback?.grammarIssues?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Grammar
                          </h4>
                          <div className="flex flex-col gap-2">
                            {feedback?.grammarIssues.map((issue, idx) => (
                              <div
                                key={idx}
                                className="bg-accent/40 p-3 rounded-lg border border-primary/10"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[9px] px-1.5 py-0.5 bg-primary/20 text-primary rounded font-bold uppercase">
                                    {issue?.issueType}
                                  </span>
                                </div>
                                <p className="text-xs text-destructive/70 line-through">
                                  {issue?.original}
                                </p>
                                <p className="text-sm text-foreground font-bold">
                                  {issue?.corrected}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed bg-black/5 p-2 rounded">
                                  {issue?.explanation}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {feedback?.vocabularyIssues?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Vocabulary
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {feedback?.vocabularyIssues.map((issue, idx) => (
                              <div
                                key={idx}
                                className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-lg flex justify-between items-center"
                              >
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-amber-600">
                                    {issue?.suggestion}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground italic">
                                    {issue?.reason}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-muted-foreground bg-amber-500/10 px-1 rounded line-through">
                                  {issue?.word}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {feedback?.coherenceIssues?.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Clarity
                          </h4>
                          <div className="flex flex-col gap-2">
                            {feedback?.coherenceIssues.map((issue, idx) => (
                              <div
                                key={idx}
                                className="bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-lg"
                              >
                                <p className="text-xs font-bold text-foreground mb-1">
                                  {issue?.problem}
                                </p>
                                <div className="flex items-start gap-2 bg-primary/5 p-2 rounded border border-primary/10">
                                  <Lightbulb
                                    size={12}
                                    className="text-primary mt-0.5 shrink-0"
                                  />
                                  <p className="text-[11px] text-primary font-medium italic">
                                    {issue?.suggestion}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {feedback?.grammarIssues?.length === 0 &&
                        feedback?.vocabularyIssues?.length === 0 &&
                        feedback?.coherenceIssues?.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-4 text-center">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                              <Check size={16} className="text-primary" />
                            </div>
                            <p className="text-xs font-bold text-foreground">
                              Perfectly communicated!
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </Card>
    </div>
  );
};

export default memo(MessageCard);
