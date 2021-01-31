const catchAsync = require("./../utils/catchAsync");
const Twitter = require("node-twitter-api");
const { generateAxiosParameters } = require("./../utils/axiosParameter");
const axios = require("axios");
const User = require("./../models/UserModel");

var twitter = new Twitter({
  consumerKey: process.env.API_KEY,
  consumerSecret: process.env.API_KEY_SECRET,
  callback: process.env.CALLBACK_URL,
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies && req.cookies.twitterCookie) {
    //get accessToken and accessSecret from cookies
    const accessToken = req.cookies.twitterCookie.accessToken,
      accessSecret = req.cookies.twitterCookie.accessSecret;
    console.log(accessToken, accessSecret);
    //get credentials of this user from twitter
    const userTwitterProfileData = await axios(
      generateAxiosParameters(
        "https://api.twitter.com/1.1/account/verify_credentials.json",
        "GET",
        accessToken,
        accessSecret
      )
    );

    console.log(userTwitterProfileData.data);

    //see if this user is already in DB
    const userProfileDataDb = await User.find({
      twitterId: userTwitterProfileData.data.id_str,
    });

    if (userProfileDataDb.length === 0) {
      //user does not exist so create a new user

      const newHelpdeskUser = await User.create({
        twitterId: userTwitterProfileData.data.id_str,
        name: userTwitterProfileData.data.name,
      });
      res.locals.user = newHelpdeskUser;
      next();
    } else {
      //this user already exists so just retrun data of this user
      res.locals.user = userProfileDataDb[0];
      next();
    }
  } else {
    //so there are no cookies so either this is a new user or an old user who dont have cookie, so login this user again and send
    getRequestToken(req, res, next);
  }
});

exports.protect = catchAsync(async (req, res, next) => {
  if (req.cookies && req.cookies.twitterCookie) {
    //get accessToken and accessSecret from cookies
    res.locals.accessToken = req.cookies.twitterCookie.accessToken;
    res.locals.accessSecret = req.cookies.twitterCookie.accessSecret;
    console.log(res.locals.accessToken, res.locals.accessSecret);
    next();
  } else {
    throw new Error("Bad Authentication");
  }
});

const getRequestToken = (req, res, next) => {
  try {
    twitter.getRequestToken(function (err, requestToken, requestSecret) {
      if (err) {
        console.log(err);
        next(error);
      } else {
        res.status(200).json({
          isAuthenticated: false,
          requestToken,
        });
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAccessToken = (req, res, next) => {
  var requestToken = req.query.oauth_token,
    verifier = req.query.oauth_verifier;

  twitter.getAccessToken(requestToken, requestToken, verifier, function (
    err,
    accessToken,
    accessSecret
  ) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      twitter.verifyCredentials(accessToken, accessSecret, function (
        err,
        user
      ) {
        if (err) res.status(500).send(err);
        else {
          const accessData = {
            accessToken,
            accessSecret,
          };
          res.cookie("twitterCookie", accessData);
          res.status(301).redirect(process.env.HOME_PAGE);
        }
      });
    }
  });
};

const getuserProfile = (req, res, next) => {
  twitter.verifyCredentials(accessToken, accessSecret, function (err, user) {
    if (err) res.status(500).send(err);
    else {
      const accessData = {
        accessToken,
        accessSecret,
      };
      res.cookie("twitterCookie", accessData);
      res.status(200).json({
        user,
      });
    }
  });
};
