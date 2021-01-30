const db = require("./../server");
const AppError = require("./../utils/AppError");
const { promisify } = require("util");
const crypto = require("crypto-random-string");
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
    console.log(res.locals.accessToken, res.locals.accessSecret)
    next();
  } else {
    throw new Error("Bad Authentication");
  }
});

/*
const signInToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: `${process.env.JWT_EXPIRES_IN}d`,
    }
  );
};
exports.signInToken = signInToken;
const createSendToken = (user, statusCode, req, res) => {
  const token = signInToken(user.id);
  console.log(token);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.createSendToken = createSendToken;
exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);

    const token = signInToken(newUser.id);

    const verificationToken = await VerificationToken.create({
      userId: newUser.id,
      token: token,
    });

    const url = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/user/verify?token=${verificationToken.token}`;
    await new Email(newUser, url).sendWelcome();

    // console.log("sjksl", newUser.dataValues)
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};
*/
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
/*

exports.logout = async (req, res, next) => {
  try {
    res.cookie("jwt", "loggedout", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};



exports.verify = catchAsync(async (req, res, next) => {
  const { token } = req.query;

  // 1) verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 2) Check if user still exists
  const user = await User.findByPk(decoded.id);

  if (!user) {
    return next(new AppError("User do not exist", 401));
  }

  if (!(await VerificationToken.findOne({ where: { token: token } }))) {
    return next(new AppError("No records found. Please Signup again.", 401));
  }

  await User.update(
    {
      isVerified: true,
    },
    {
      where: {
        id: decoded.id,
      },
    }
  );

  return res.redirect("http://localhost:3000");
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findByPk(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
*/
