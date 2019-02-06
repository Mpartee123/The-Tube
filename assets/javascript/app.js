var database = firebase.database();

function timeClock() {
    var currentTime = moment().toString();
    $("#current-time").html(currentTime);
    // console.log(currentTime);
    setTimeout(function () {
        timeClock()
    }, 1000);
}

timeClock();

$("#submit").on("click", function (event) {

    event.preventDefault();

    var trainName = $('#train-name').val().trim();
    var destination = $('#destination').val().trim();
    var firstTrainTime = $('#fist-train-time').val().trim();
    var frequency = $('#frequency').val().trim();

    console.log(trainName);
    console.log(destination);
    console.log(firstTrainTime);
    console.log(frequency);

    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency
    });

});

database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().firstTrainTime);
    console.log(childSnapshot.val().frequency);

    var trainName = childSnapshot.val().trainName;

    var trainDest = childSnapshot.val().destination;
    console.log(trainDest);

    var trainFreq = Number(childSnapshot.val().frequency);
    console.log(trainFreq);

    var trainTime = childSnapshot.val().firstTrainTime;
    console.log(trainName);

    var firstTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years")._i;
    console.log(firstTimeConverted);

    var currentTime = moment();
    console.log("currentTime " + moment(currentTime).format("hh:mm"));

    // var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var diffTime = moment().diff(moment(trainTime, "HH:mm").subtract(1, "years"), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    var timeRemaining = diffTime % trainFreq;
    console.log(timeRemaining);

    var minutesUntilNextTrain = trainFreq - timeRemaining;
    console.log("MINUTES TILL TRAIN: " + minutesUntilNextTrain);

    var nextTrain = moment().add(minutesUntilNextTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

// get information from html input
    var trainInfo = $("<tr>");
    trainInfo.append($("<td>").text(trainName));
    trainInfo.append($("<td>").text(trainDest));
    trainInfo.append($("<td>").text(trainFreq));
    trainInfo.append($("<td>").text(moment(nextTrain).format("hh:mm")));
    trainInfo.append($("<td>").text(minutesUntilNextTrain));

    $("#schedule").append(trainInfo);
});

// set ending time to to midnight of that same day or for one day later

// populate the times that the train will come during that period in a for loop

// post times to the corresponding element in the html

