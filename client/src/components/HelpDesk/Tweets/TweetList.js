import React, { useEffect, useState, useRef } from "react";
import Tweet from "./Tweet";
import socketIOClient from "socket.io-client";
import style from "./TweetList.module.css";

const TweetFeed = (props) => {
  const [tweets, setTweets] = useState([]);
  const [firstTweet, setFirstTweet] = useState(false);

  const tweetsRef = useRef(tweets);
  const addTweet = (tweet, tweets, setTweets) => {
    if (tweets.length === 0) {
      setFirstTweet(true);
    }
    setTweets([...tweets, tweet]);
    //console.log(tweets);
  };

  useEffect(() => {
    // This effect executes on every render (no dependency array specified).
    // Any change to the "tweet" state will trigger a re-render
    // which will then cause this effect to capture the current "tweet"
    // value in "tweetRef.current".
    tweetsRef.current = tweets;
  });

  useEffect(() => {
    // This effect only executes on the initial render so that we aren't setting
    // up the socket repeatedly. This means it can't reliably refer to "tweet"
    // because once "settweet" is called this would be looking at a stale
    // "tweet" reference (it would forever see the initial value of the
    // "tweet" state since it isn't in the dependency array).
    // "tweetRef", on the other hand, will be stable across re-renders and
    // "tweetRef.current" successfully provides the up-to-date value of
    // "tweet" (due to the other effect updating the ref).
    const handler = (tweet) => {
      addTweet(tweet, tweetsRef.current, setTweets);
    };
    let socket;
    socket = socketIOClient("https://twitterhelpdesk73.herokuapp.com/");
    socket.on("tweet", handler);
    return () => {
      socket.off("tweet", handler);
      socket.close();
    };
  }, []);

  return (
    <div className={style.tweetList}>
      <h3>Conversations</h3>
      {firstTweet ? (
        <div className={style.noMention}>
          Click on a tweet to respond and view customer
        </div>
      ) : null}
      {tweets.map((tweet) => {
        return (
          <Tweet
            key={tweet.tweet_create_events[0].id_str}
            tweet={tweet}
            userId={props.userId}
            setActiveTweet={props.setActiveTweet}
          />
        );
      })}
      {tweets.length === 0 ? (
        <div className={style.noMention}>
          Looks like you have no mentions yet.
        </div>
      ) : null}
    </div>
  );
};

export default TweetFeed;
