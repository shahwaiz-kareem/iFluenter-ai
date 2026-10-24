"use client";

import { useState } from "react";
import { UsersTable } from "./UsersTable";
import UserStoreProvider from "@/app/store/admin/AdminStoreProvider";
import FormSheet from "../shared/FormSheet";

const UsersContainer = () => {
  const [userId, setUserId] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  // const [isSearching, setIsSearching] = useState(false);
  // console.log("changed user", usersData);
  return (
    <div>
      <UserStoreProvider>
        <UsersTable
          key={userId + "table"}
          setUserId={setUserId}
          searchData={searchData}
          setSearchData={setSearchData}
          usersData={usersData}
          setUsersData={setUsersData}
          // setIsSearching={setIsSearching}
        />
        <FormSheet
          key={userId}
          data={usersData}
          setData={setUsersData}
          sheetFor={"user"}
          itemId={userId}
          setItemId={setUserId}
        />
      </UserStoreProvider>
    </div>
  );
};

export default UsersContainer;
