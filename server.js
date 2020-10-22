const express = require("express");
const cors = require("cors");
const webpush = require("web-push");
const bodyParser = require("body-parser");

const app = express();

// kluce vygenerovane v terminali: ./node_modules/.bin/web-push generate-vapid-keys - treba predtym nainstalovat webpush
// sluzia na identifikaciu toho, komu sa posielaju push notifikacie
// tento public kluc je pouzity aj vo frontende - service-worker pri subscribe
const publicVapidKey = "BGOEJ3Rf9--QkRRZqx9bQP2WQhs-VPmMvg-mIgtvMl8vLa2l7eemlw3PUwgJMyWyy1S86TA7sxf7VKfyMrI0_A8";
const privateVapidKey = "kInyK6C3S0shAHpZiHf5KxlVl20eHFLmphsgPjYN5nI";

// setting our previously generated VAPID keys
webpush.setVapidDetails("mailto:test@test.com", publicVapidKey, privateVapidKey);

// cors
app.use(cors());

// body-parser
app.use(bodyParser.json());

// function for send push notifications
const sendNotifications = (subscription, dataToSend = "") => {
  webpush
    .sendNotification(subscription, dataToSend)
    .then(() => {
      console.log("notification send");
    })
    .catch((err) => {
      console.error(err);
    });
};

// dummy database (only in memory store) for save subscription
const dummyDB = { subscription: null };

// only for test, in real app here should be db logic to save it:
const saveToDatabase = (subscription) => {
  dummyDB.subscription = subscription;
};

// home page
app.get("/", (req, res, next) => {
  res.status(200).send("Home page");
});

// subscribe route
app.post("/subscribe", (req, res, next) => {
  console.log("subscribe post");
  // get subscribe object - this should be stored somewhere safely in the backend (database), because we will need this subscription later to send push messages to the users browser
  const subscription = req.body;

  // save subscription to dummy database
  saveToDatabase(subscription);

  // send 201 - resource created
  res.status(201).json({ message: "success subscribe" });
});

// route for test send notifications
app.get("/send-notification", (req, res, next) => {
  // get subscription from dummy database
  const subscription = dummyDB.subscription;

  // create payload for push notification
  const payload = JSON.stringify({
    title: "push test",
    body: "bla bla bla bla",
    icon: "http://image.ibb.co/frYOFd/tmlogo.png",
  });

  sendNotifications(subscription, payload);

  res.status(200).json({ message: "push notification send!" });
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
