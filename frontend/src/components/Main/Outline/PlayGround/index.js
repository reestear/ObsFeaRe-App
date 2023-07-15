import React, { useState } from "react";
import ChatAI from "./ChatAI";
import TreeLayout from "./TreeLayout";
import "./styles.css";

const PlayGround = () => {
  const [openChat, setOpenChat] = useState(false);
  const toggleOpenChat = () => {
    setOpenChat(!openChat);
  };

  return (
    <div className="PlayGround">
      <ChatAI openChat={openChat} toggleOpenChat={toggleOpenChat}></ChatAI>
      <TreeLayout></TreeLayout>
    </div>
  );
};

export default PlayGround;
