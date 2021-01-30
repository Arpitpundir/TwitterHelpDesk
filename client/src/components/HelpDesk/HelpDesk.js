import React, { useState } from "react";
import style from "./HelpDesk.module.css";
import TweetList from "./Tweets/TweetList";
import ActiveTweetProfile from "./ActiveTweetProfile/ActiveTweetProfile";
import ActiveTweetReply from "./ActiveTweetReply/ActiveTweetReply";

const HelpDesk = (props) => {
  const [activeTweet, setActiveTweet] = useState(null);
  const setTweet = (tweet) => {
    console.log(tweet);
    setActiveTweet(tweet);
  };
  return (
    <div className={style.helpDesk}>
      <header className={style.helpDesk__header}>
        <h2>Twitter HelpDesk</h2>
        <h3>{props.user.name}</h3>
      </header>
      <TweetList setActiveTweet={setTweet} userId={props.user.twitterId} />
      {activeTweet ? <ActiveTweetReply tweet={activeTweet} /> : null}
      {activeTweet ? (
        <ActiveTweetProfile profile={activeTweet.tweet_create_events[0].user} />
      ) : null}
    </div>
  );
};

export default HelpDesk;
