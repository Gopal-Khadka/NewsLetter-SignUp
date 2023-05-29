const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
const port = 3000;
const apiKey = "ad23f9ecb94257facbc1e3afb4ef04b8b-us21"; // mailchimp api Key
const list_id = "d2ae47f49e"; // mailchimp list id

app.use(express.static("public")); // uses this folder fo css and images
app.use(bodyParser.urlencoded({ extended: true })); // uses bodyparser module to get data from form

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

app.post("/", (req, res) => {
  const { fname, lname, email } = req.body; // getting user inputs
  const data = {
    // parameters to post to api
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data); // making json --> string
  const url = "https://us21.api.mailchimp.com/3.0/lists/" + list_id; // endpoint of api
  const option = {
    method: "POST", // method for making request to api
    auth: "henry1:" + apiKey, // authorization (HTTP Auth)
  };
  const request = https.request(url, option, (response) => {
    response.statusCode == 200 // checking for any error
      ? res.sendFile(__dirname + "/success.html") // rendering web pages
      : res.sendFile(__dirname + "/failure.html"); // rendering web pages [mess with apiKey to get this]

    // response.on("data", (data) => {
    //   console.log(JSON.parse(data)); // checking received data
    // });
  });
  request.write(jsonData); // sending/posting data given by user
  request.end(); // ending request
});

app.post("/failure", (req, res) => { // handling failures and try again
  res.redirect("/");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`)); // starting server
