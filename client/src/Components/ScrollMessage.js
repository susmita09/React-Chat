import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { isSameSenderMargin, isSameUser } from "../config/chatConfig";

const ScrollMessage = ({ messages }) => {
  const { user } = ChatState();

  return (
    <div>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#ECC94B" : "#D69E2E"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </div>
  );
};

export default ScrollMessage;
