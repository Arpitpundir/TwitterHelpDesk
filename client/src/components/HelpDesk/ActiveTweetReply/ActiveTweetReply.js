import React, { useState } from "react";
import style from "./ActiveTweetReply.module.css";
import axiosInstance from "./../../../utils/axiosInstance";
import Aux from "./../../../utils/Aux";
import axios from "axios";

const ActiveTweetReply = ({ tweet }) => {
  const [reply, setReply] = useState("");
  const sentReply = async (event) => {
    const res = await axios({
      baseURL: "/api/user/reply",
      method: "POST",
      data: {
        replyText:
          "@" + tweet.tweet_create_events[0].user.screen_name + " " + reply,
        tweetId: tweet.tweet_create_events[0].id,
      },
      withCredentials: true,
    });
    if (res.data.status === "sent") {
      setReply("");
    }
  };
  return (
    <Aux>
      <div className={style.reply}>
        <h3>Customer</h3>
        <div className={style.tweet}>
          <p>
            <b>You are replying to: </b>{" "}
            {tweet.tweet_create_events[0].user.screen_name}{" "}
          </p>
        </div>
        <div className={style.input}>
          <input
            placeholder="Your Reply"
            value={reply}
            onChange={(event) => setReply(event.target.value)}
          ></input>
        </div>
        <div className={style.button}>
          <button
            className={style.submit}
            onClick={(event) => sentReply(reply)}
          >
            {" "}
            Reply{" "}
          </button>
        </div>
      </div>
    </Aux>
  );
};

export default ActiveTweetReply;
