var database = firebase.database();

function timeClock() {
    var currentTime = moment().format("dddd hh:mm.ss");
    currentTime.toString();
    $("#current-time").html(currentTime);
}

timeClock();

setInterval(function () {
    timeClock();
}, 1000);

// Handle train adding
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

    $('#train-input').trigger("reset");
});

function calculateAndRenderSchedule(childSnapshot) {
    var trainKey = childSnapshot.key;
    var train = childSnapshot.val();
    console.log(trainKey, train);

    // Calculate
    var trainName = train.trainName;
    var trainDest = train.destination;
    var trainFreq = Number(train.frequency);
    var trainTime = train.firstTrainTime;
    var diffTime = moment().diff(moment(trainTime, "HH:mm").subtract(1, "years"), "minutes");
    var timeRemaining = diffTime % trainFreq;
    var minutesUntilNextTrain = trainFreq - timeRemaining;
    var nextTrain = moment().add(minutesUntilNextTrain, "minutes");

    // Render
    var existingTrainRow = $('#' + trainKey);
    var trainRow = existingTrainRow.length
        ? existingTrainRow
        : $('<tr>').attr('id', trainKey);

    trainRow.empty();
    trainRow.append($("<td>").text(trainName));
    trainRow.append($("<td>").text(trainDest));
    trainRow.append($("<td>").text(trainFreq));
    trainRow.append($("<td>").text(moment(nextTrain).format("hh:mm")));
    trainRow.append($("<td>").text(minutesUntilNextTrain));

    $("#schedule").append(trainRow);
}

// Fires for each train returned by Firebase.
database.ref().on("child_added", function (childSnapshot) {
    console.log("child_added event fired.", childSnapshot);

    calculateAndRenderSchedule(childSnapshot);

    setInterval(function () {
        calculateAndRenderSchedule(childSnapshot);
    }, 5000);
});

// set ending time to to midnight of that same day or for one day later

// populate the times that the train will come during that period in a for loop

// post times to the corresponding element in the html

