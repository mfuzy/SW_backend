const express = require("express");
const webpush = require("web-push");

const app = express();

// set static path
//app.use(express.static(path.join(__dirname, "client")));

//kluce vygenerovane v terminali: ./node_modules/.bin/web-push generate-vapid-keys
//sluzia na identifikaciu toho, komu sa posielaju push notifikacie
const publicVapidKey = "BGOEJ3Rf9--QkRRZqx9bQP2WQhs-VPmMvg-mIgtvMl8vLa2l7eemlw3PUwgJMyWyy1S86TA7sxf7VKfyMrI0_A8";
const privateVapidKey = "kInyK6C3S0shAHpZiHf5KxlVl20eHFLmphsgPjYN5nI";

webpush.setVapidDetails("mailto:test@test.com", publicVapidKey, privateVapidKey);

// home page

app.get("/", (req, res, next) => {
  res.status(200).send("OK");
});

// subscribe route
app.post("/subscribe", (req, res, next) => {
  // get subscribe object
  const subscription = req.body;

  // send 201 - resource created
  res.status(201).json({});

  // create payload
  const payload = JSON.stringify({
    title: "push test",
    body: "test push notification",
    icon: "http://image.ibb.co/frYOFd/tmlogo.png",
  });

  // push notification (server -> service worker -> browser)
  webpush.sendNotification(subscription, payload).catch((err) => {
    console.error(err);
  });
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
