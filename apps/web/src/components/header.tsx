import React from "react";
import { SideMenu } from "./side-menu";
import { SessionDialog } from "./session";

const Header = () => {
  return (
    <div className="flex justify-between items-center absolute right-4 top-4">
      {/* <div>
        <h1 className="text-2xl font-bold text-white">Whiteboard</h1>
      </div> */}
      <div className="flex space-x-4 items-center">
        <SessionDialog />
        <SideMenu />
      </div>
    </div>
  );
};

export default Header;
