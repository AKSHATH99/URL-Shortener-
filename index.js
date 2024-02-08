const express = require("express");

const urlRoute = require("./routes/url");
const { connectToMongoDB } = require("./connect");
const app = express();
const port = 8000;
const URL = require("./models/url");
const shortid = require("shortid");

connectToMongoDB("mongodb://127.0.0.1:27017/SHORTURL").then(() =>
  console.log("DB CONNECTED ")
);

app.use(express.json());
app.use("/url", urlRoute);
app.get("/:shortId", async (req, res) => {
    try {
      const shortId = req.params.shortId;
      const entry = await URL.findOneAndUpdate(
        { shortId },
        {
          $push: {
            visitHistory: {
              timestamp: Date.now(),
            },
          },
        }
      );
  
      if (!entry) {
        // If entry is null, no record found with the specified shortId
        return res.status(404).json({ error: "URL not found" });
      }
  
      res.redirect(entry.redirectURL);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
app.listen(port, () => console.log(`'Server started at '${port}`));
