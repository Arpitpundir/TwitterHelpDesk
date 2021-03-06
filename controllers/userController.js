const { generateAxiosParameters } = require("./../utils/axiosParameter");
const catchAsync = require("./../utils/catchAsync");
const axios = require("axios");
const twitter = require("twitter");

exports.replyToTweet = catchAsync(async (req, res, next) => {
  var client = new twitter({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_KEY_SECRET,
    access_token_key: res.locals.accessToken,
    access_token_secret: res.locals.accessSecret,
  });

  client.post("statuses/update", { status: req.body.replyText }, function (
    error,
    tweet,
    response
  ) {
    if (!error) {
      console.log(tweet);
      res.status(200).json({
        status: "sent",
      });
    } else {
      console.log(error);
    }
  });
});
