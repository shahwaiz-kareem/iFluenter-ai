"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Ellipsis, Pen, Trash } from "lucide-react";

export default function ChatCrudDropdown({ chatCrudType, setChatCrudType }) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          onClick={() => setChatCrudType("")}
          hidden={!!chatCrudType}
          className="max-sm:mr-6 "
          asChild
        >
          <Ellipsis size={18} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56  rounded-lg"
          side={"bottom"}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="hover:bg-muted cursor-pointer"
              onClick={() => setChatCrudType("rename")}
            >
              <Pen />
              <span>Rename</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-muted cursor-pointer"
              onClick={() => setChatCrudType("delete")}
            >
              <Trash className="text-red-500" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
