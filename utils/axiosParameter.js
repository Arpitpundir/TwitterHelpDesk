const oauthSignature = require("oauth-signature");
const crypto = require("crypto");
exports.generateAxiosParameters = (
  url,
  method,
  accessToken,
  accessSecret,
  axiosParams
) => {
  const consumerKey = process.env.API_KEY,
    nonceValue = genNonce(),
    timeStamp = getTimeStamp(),
    signatureMethod = "HMAC-SHA1",
    oauthVersion = "1.0";
  axiosPrams = axiosParams === null ? {} : axiosParams;
  const parameters = {
    oauth_consumer_key: consumerKey,
    oauth_token: accessToken,
    oauth_nonce: nonceValue,
    oauth_timestamp: timeStamp,
    oauth_signature_method: signatureMethod,
    oauth_version: oauthVersion,
    ...axiosParams,
  };

  const signature = oauthSignature.generate(
    method,
    url,
    parameters,
    process.env.API_KEY_SECRET,
    accessSecret,
    { encodeSignature: false }
  );

  const currentParameters = {
    baseURL: url,
    method: method,
    headers: {
      /* OAuth oauth_consumer_key="xvz1evFS4wEEPTGEFPHBog", oauth_nonce="kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg", 
      oauth_signature="tnnArxj06cWHq44gCs1OSKk%2FjLY%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1318622958",
       oauth_token="370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb", oauth_version="1.0"*/
      Authorization: `OAuth oauth_consumer_key=${encodeURIComponent(
        consumerKey
      )}, oauth_token=${encodeURIComponent(
        accessToken
      )}, oauth_signature_method="HMAC-SHA1", oauth_timestamp=${encodeURIComponent(
        timeStamp
      )}, oauth_nonce=${encodeURIComponent(
        nonceValue
      )}, oauth_version="1.0", oauth_signature=${encodeURIComponent(
        signature
      )}`,
    },
    withCredentials: true,
  };

  return currentParameters;
};

const genNonce = () => crypto.randomBytes(16).toString("base64");
const getTimeStamp = () => Math.ceil(new Date().getTime() / 1000);
