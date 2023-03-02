// const Mailjet = require("node-mailjet");
// const mailjet = Mailjet.apiConnect(
//   process.env.MJ_APIKEY_PUBLIC || "****************************1234",
//   process.env.MJ_APIKEY_PRIVATE || "****************************abcd"
// );
const apiKey = "67c4d4d645f67424a560843d6e441254";
const secretKey = "2dc3f909943025d3323595ede0d24949";
const Mailjet = require("node-mailjet");
const mailjet = Mailjet.apiConnect(apiKey, secretKey);
module.exports = function (email, subject, html, callback) {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "omenkumar2208@gmail.com",
          Name: "Omen",
        },
        To: [
          {
            Email: email,
            Name: "User",
          },
        ],
        Subject: subject,
        TextPart: "Mailjet email",
        HTMLPart: html,
        CustomID: "AppGettingStartedTest",
      },
    ],
  });
  request
    .then((result) => {
      console.log("result.body", result.body);
      callback(null, result);
    })
    .catch((err) => {
      console.log("err, err.status" + err + " " + err.statusCode);
      callback(err, null);
    });
};
