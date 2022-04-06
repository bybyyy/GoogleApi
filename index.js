const express = require('express');
const {google} = require("googleapis")
const app = express();
const path = require('path');

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", async (req, res) => {
	// const {times} = req.body.times;
	const {times, River, date, TimeStarted, Species, Tag, NewRecapture, SurfaceSubsurface, Measurement, Sex, Spines, BrianOK, Notes} = req.body;
	console.log(times, River, date, TimeStarted, Species, Tag, NewRecapture, SurfaceSubsurface, Measurement, Sex, Spines, BrianOK, Notes);
	//const { times, River, date, TimeStarted, Species, Tag#, New/Recapture, Surface/Subsurface, Measurement, Sex, Spines, BrianOK, Notes} = req.body;

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  
  const client = await auth.getClient(); // Create client

  const googleSheet = google.sheets({ version: "v4", auth: client }); //Googlesheet api
  const spreadsheetId = "137iLinoT66M2jRge5GhHsh7LX1qPsE-KTwbC0aQLKow";
  
  // Get metadata about spreadsheet
  const metaData = await googleSheet.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  // Read rows from spreadsheet
  const getRows = await googleSheet.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1!A:A",
  });

  // Write row(s) to spreadsheet
  await googleSheet.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:L",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[times, River, date, TimeStarted, Species, Tag, NewRecapture, SurfaceSubsurface, Measurement, Sex, Spines, BrianOK, Notes]],
      //values: [[times, River, date, TimeStarted, species, Tag#, New/Recapture, Surface/Subsurface, measurement, sex, spines, BrianOK, Notes]],
    },
  })

  //res.send("Successfully submitted! Thank you!");
  res.sendFile(path.join(__dirname, '/page2.html'));

});

app.listen(8080, (req, res) => console.log("running on 8080"));