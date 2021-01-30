import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
//import axios from "./utils/axiosInstance";
import LandingPage from "./components/LandingPage/LandingPage";
import axios from "axios";
import HelpDesk from "./components/HelpDesk/HelpDesk.js";
function App() {
  const [isAuthenticated, setAuthentication] = useState(false);
  const [authUrl, setAuthUrl] = useState(null);
  const [isLoading, setLoadingStatus] = useState(true);
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState(null);

  useEffect(() => {
    axios({
      url: "/api/auth/twitter/state",
      method: "GET",
      withCredentials: true,
    }).then((res) => {
      console.log(res.data);
      if (!res.data.isAuthenticated) {
        setAuthUrl(
          "https://api.twitter.com/oauth/authenticate?oauth_token=" +
            res.data.requestToken
        );
        setLoadingStatus(false);
      } else {
        setLoadingStatus(false);
        setUser(res.data.user);
        setTweets(res.data.tweets);
        setAuthentication(true);
        setAuthUrl(null);
      }
    });
  }, []);
  if (isAuthenticated) return <HelpDesk user={user} />;
  return <LandingPage isLoading={isLoading} authUrl={authUrl} />;
}

export default App;
