const axios = require("axios");
const catchAsync = require("./../utils/catchAsync");
const { generateAxiosParameters } = require("./../utils/axiosParameter");

exports.registerWebhook = catchAsync(async (req, res, next) => {
  const webHookList = await axios({
    baseURL: "https://api.twitter.com/1.1/account_activity/all/webhooks.json",
    menthod: "GET",
    headers: {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    },
  });

  console.log("webhooklist", webHookList.data.environments);

  if (webHookList.data.environments[0].webhooks.length !== 0) {
    await axios(
      generateAxiosParameters(
        `https://api.twitter.com/1.1/account_activity/all/dev/webhooks/${webHookList.data.environments[0].webhooks[0].id}.json`,
        "DELETE",
        process.env.ACCESS_TOKEN,
        process.env.ACCESS_TOKEN_SECRET
      )
    );
  }

  const webHook = await axios(
    generateAxiosParameters(
      `https://api.twitter.com/1.1/account_activity/all/dev/webhooks.json?url=${encodeURIComponent(
        process.env.WEBHOOK_URL
      )}`,
      "POST",
      process.env.ACCESS_TOKEN,
      process.env.ACCESS_TOKEN_SECRET,
      {
        url: process.env.WEBHOOK_URL,
      }
    )
  );
  console.log("webhook", webHook);

  res.locals.webhookId = webHook.data.id;
  next();
});

exports.subscribeUser = catchAsync(async (req, res, next) => {
  const subscriberList = await axios({
    baseURL:
      "https://api.twitter.com/1.1/account_activity/all/dev/subscriptions/list.json",
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    },
  });

  let isUserSubscribed = false;
  console.log("subList", subscriberList.data);

  subscriberList.data.subscriptions.forEach((user) => {
    if (user.user_id === res.locals.user.twitterId) {
      isUserSubscribed = true;
    }
  });

  if (!isUserSubscribed) {
    await axios(
      generateAxiosParameters(
        "https://api.twitter.com/1.1/account_activity/all/dev/subscriptions.json",
        "POST",
        req.cookies.twitterCookie.accessToken,
        req.cookies.twitterCookie.accessSecret
      )
    );
    console.log("newSubscript");
  }

  res.status(200).json({
    user: res.locals.user,
    isAuthenticated: true,
  });
});
