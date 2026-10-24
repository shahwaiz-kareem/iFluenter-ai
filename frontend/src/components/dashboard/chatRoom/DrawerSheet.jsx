"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ChatSheetContent from "./ChatSheetContent";
import { useAppSelector } from "@/lib/hooks/hooks";
import {
  selectIsDrawerOpen,
  setIsDrawerOpen,
} from "@/lib/features/chat/chat.slice";
import { useDispatch } from "react-redux";
import { memo, useCallback } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const DrawerSheet = ({ isMobile, isTablet }) => {
  const dispatch = useDispatch();
  const isDrawerOpen = useAppSelector(selectIsDrawerOpen);
  const handleDrawerToggle = useCallback(() => {
    dispatch(setIsDrawerOpen(!isDrawerOpen));
  }, [isDrawerOpen]);
  return (
    <Sheet onOpenChange={handleDrawerToggle} modal={false} open={isDrawerOpen}>
      <SheetContent
        onInteractOutside={(event) => event.preventDefault()}
        side={isMobile || isTablet ? "bottom" : "right"}
        className={` px-0 w-full max-lg:h-[50%] ${
          isDrawerOpen ? "max-lg:translate-y-0" : ""
        }  lg:h-full overflow-x-hidden lg:p-0 max-lg:rounded-2xl pt-6 lg:pt-16 overflow-y-hidden bg-background max-lg:-z-0 [&>button:first-child]:hidden`}
      >
        <SheetHeader>
          <VisuallyHidden>
            <SheetTitle>Chat Messages</SheetTitle>
            <SheetDescription>See your messages</SheetDescription>
          </VisuallyHidden>
        </SheetHeader>
        <ChatSheetContent />
      </SheetContent>
    </Sheet>
  );
};

export default memo(DrawerSheet);
