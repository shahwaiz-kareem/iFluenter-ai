"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import {
  useLazyGetUsersQuery,
  useLazySearchUserQuery,
} from "@/lib/features/services/admin/userApi.admin";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table?.getIsAllPageRowsSelected() ||
          (table?.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table?.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "ageRange",
    header: () => <div className="">Age range</div>,
    cell: ({ row }) => {
      return <div className=" font-medium">{row.getValue("ageRange")}</div>;
    },
  },
  {
    accessorKey: "isVerified",
    header: () => <div className="">Email Verified</div>,
    cell: ({ row }) => {
      return (
        <div className=" font-medium capitalize">
          {row.getValue("isVerified") ? "verified" : "unverified"}
        </div>
      );
    },
  },
  {
    accessorKey: "proficiencyLevel",
    header: () => <div className="">proficiencyLevel</div>,
    cell: ({ row }) => {
      return (
        <div className=" font-medium ">{row.getValue("proficiencyLevel")}</div>
      );
    },
  },
  {
    accessorKey: "subscriptionStatus",
    header: () => <div className="text-right">Subscription Status</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium capitalize ">
          {row.getValue("subscriptionStatus")}
        </div>
      );
    },
  },
  {
    accessorKey: "subscriptionId",
    header: () => <div className="text-right ">Subscription Id</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium ">
          {row.getValue("subscriptionId")}
        </div>
      );
    },
  },
];

let userPageNo = 1;
let searchPageNo = 1;
const pageLimit = 6;

export function UsersTable({
  setUserId,
  usersData,
  setUsersData,
  searchData,
  setSearchData,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [searchStatus, setSearchStatus] = useState({
    searchKey: "",
    searchValue: "",
    active: false,
    searchChanged: false,
  });
  console.log("nutable", usersData);

  const [getUsers] = useLazyGetUsersQuery();
  const [searchUser] = useLazySearchUserQuery();
  const { toast } = useToast();
  const rename_id = (arr) => {
    return arr.map((obj) => {
      const { _id, ...rest } = obj;
      return { ...rest, id: _id };
    });
  };
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getUsers({
          pageNo: userPageNo,
          pageLimit,
          sortBy: "createdAt",
        }).unwrap();
        setUsersData(rename_id(data?.users));
        console.log(data);
        userPageNo++;
      } catch (error) {
        console.log("error", error);
        toast({
          title: "Error",
          description: error.message,
        });
      }
    };
    getData();
    return () => {
      userPageNo = 1;
      searchPageNo = 1;
    };
  }, []);

  const handleNext = async () => {
    try {
      if (searchStatus.active) {
        const data = await getUsers({
          pageNo: userPageNo + 1,
          pageLimit,
        }).unwrap();
        setUsersData((prev) => [...prev, ...rename_id(data?.users)]);
        userPageNo++;
        // setSearchStatus((prev) => ({ ...prev, searchChanged: false }));
      } else {
        const data = await searchUser({
          pageNo: searchPageNo + 1,
          pageLimit,
        }).unwrap();

        setSearchData((prev) => [...prev, ...rename_id(data.searchResult)]);
        if (!searchStatus.searchChanged) searchPageNo++;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };
  const handleSearch = async () => {
    try {
      if (!searchStatus.searchChanged && searchStatus.active) {
        setSearchData([]);
        // setIsSearching(false);
        searchPageNo = 0;
        return setSearchStatus(() => ({
          searchKey: "",
          searchValue: "",
          active: false,
          searchChanged: false,
        }));
      }
      // setIsSearching(true);
      const data = await searchUser({
        searchKey: searchStatus.searchKey,
        searchValue: searchStatus.searchValue,
        pageNo: searchPageNo,
        pageLimit,
      }).unwrap();
      // console.log("the data", data);
      if (searchStatus.searchChanged) {
        setSearchData(rename_id(data.searchResult));
      } else {
        setSearchData((prev) => [...prev, ...rename_id(data.searchResult)]);
      }

      setSearchStatus((prev) => ({
        ...prev,
        active: true,
        searchChanged: false,
      }));
      if (!searchStatus.searchChanged) searchPageNo++;
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  const table = useReactTable({
    data: searchStatus.active ? searchData : usersData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // console.log();
  // return <></>;
  return (
    <div className="w-full ">
      <div className="flex items-center py-4">
        <div className="max-w-md flex items-center gap-2 justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {searchStatus.searchKey || "Key"} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column?.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.id === searchStatus.searchKey}
                      onCheckedChange={() =>
                        setSearchStatus((prev) => ({
                          ...prev,
                          searchKey: column.id,
                          searchChanged: true,
                        }))
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            placeholder="Enter search value"
            value={searchStatus.searchValue}
            onChange={(event) =>
              setSearchStatus((prev) => ({
                ...prev,
                searchValue: event.target.value,
                searchChanged: true,
              }))
            }
          />
          <Button
            onClick={(e) => handleSearch(e)}
            disabled={!searchStatus.searchKey || !searchStatus.searchValue}
            className="w-16 h-full flex items-center justify-center"
          >
            {searchStatus.searchKey &&
            searchStatus.searchValue &&
            !searchStatus.searchChanged &&
            searchStatus.active ? (
              <X size={20} />
            ) : (
              <Search size={20} />
            )}
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {
              <>
                {table?.getRowModel()?.rows?.length ? (
                  table?.getRowModel()?.rows.map((row) => (
                    <TableRow
                      onClick={() => {
                        console.log(row.original);
                        setUserId(row.original.id);
                      }}
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </>
            }
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table?.getFilteredSelectedRowModel().rows.length} of{" "}
          {table?.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table?.previousPage()}
            disabled={searchData?.length === 0 || usersData?.length === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNext()}
            // disabled={}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
