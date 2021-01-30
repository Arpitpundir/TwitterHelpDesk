import React from "react";
import style from "./Tweet.module.css";

const Tweet = ({ tweet, userId, setActiveTweet }) => {
  //const { id } = tweet.data;

  const author = tweet.tweet_create_events[0].user;
  console.log(tweet);
  if (author.id_str !== userId) {
    return (
      <div
        onClick={(event) => {
          event.preventDefault();
          console.log(tweet);
          setActiveTweet(tweet);
        }}
        className={style.tweet__green}
      >
        <h4>Author: {author.screen_name}</h4>
        <p>{tweet.tweet_create_events[0].text}</p>
      </div>
    );
  }
  return (
    <div
      onClick={(event) => {
        event.preventDefault();
        console.log(tweet);
        setActiveTweet(tweet);
      }}
      className={style.tweet__red}
    >
      <h4>Author: {author.screen_name}</h4>
      <p>{tweet.tweet_create_events[0].text}</p>
    </div>
  );
};

export default Tweet;
