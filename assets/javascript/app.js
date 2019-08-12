// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyCULLFZvd9aMYaSFG5ugOIJ67Dpq1H2i7o",
  authDomain: "okay-9bb19.firebaseapp.com",
  databaseURL: "https://okay-9bb19.firebaseio.com",
  projectId: "okay-9bb19",
  storageBucket: "",
  messagingSenderId: "63929520916",
  appId: "1:63929520916:web:b7c2ae48878d8985"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Employees
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainStartTime = moment($("#start-input").val().trim(), "HH:mm:ss").format("X");
  var trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding employee data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    start: trainStartTime,
    frequency: trainFrequency
  };

  // Uploads train data to the database
  database.ref("/train").push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.start);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref("/train").on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainStartTime = childSnapshot.val().start;
  var trainFrequency = childSnapshot.val().frequency;

  // Employee Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainStartTime);
  console.log(trainFrequency);

  // Prettify the employee start
  var trainStartTimePretty = moment.unix(trainStartTime).format("HH:mm:ss");
  console.log("trainStartimepretty" + trainStartTimePretty);

  // Calculate the next arrival using hardcore math
  // To calculate the minutes until next arrival
  var sinceDeparture = moment().diff(moment(trainStartTime, "X"), "minutes");
  console.log("sinceDeparture" + sinceDeparture);

  //Get the remainder 
  // var remainder = 
  // console.log("remainder" + remainder);

  //The remainder of division of since-departure-time by frequency informs us
  //How much time remains until the train next arrives
  var minsSinceLastTrain = sinceDeparture % trainFrequency;
  var minsToNextTrain = trainFrequency - minsSinceLastTrain;
  //remainder * trainFrequency;
  console.log("minssincelasttrain " + minsSinceLastTrain);
  console.log("minstonexttrain " + minsToNextTrain);

  //The time until the next train arrives plus current time gives us
  //the next train's arrival time
  var nextTrainTime = moment().add(minsToNextTrain, 'm').format('HH:mm');
  // var nextTrainTime = timeNow.duration().add(minsToNextTrain, 'm')
  console.log("nexttraintime " + nextTrainTime);
  console.log("timenow " + moment().format('HH:mm'));


  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(nextTrainTime),
    $("<td>").text(minsToNextTrain)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});

// Example Time Math
// -----------------------------------------------------------------------------
// Assume Employee start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use meets this test case