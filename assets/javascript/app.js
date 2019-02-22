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


$("#submit").on("click", function (event) {
    event.preventDefault();

    var frequency = $('#frequency').val().trim();
    var firstTrainTime = $('#fist-train-time').val().trim();
    if ((moment(firstTrainTime, "HH:mm", true).isValid()) && (Number.isInteger(Number(frequency)))) {
        var destination = $('#destination').val().trim();
        var trainName = $('#train-name').val().trim();
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency
        });

        $('#train-input').trigger("reset");
    } else {
        alert('Input validation failed. Please check your inputs and try again.')
    }
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
    var trainTimeCalculated = train.firstTrainTime.split(':');
    var currentTime = moment().toObject();
    var diffTime = moment().diff(moment(trainTime, "HH:mm").subtract(1, "years"), "minutes");
    var timeRemaining = diffTime % trainFreq;
    var minutesUntilNextTrain = trainFreq - timeRemaining;
    var nextTrain = moment().add(minutesUntilNextTrain, "minutes");

    if (Number(trainTimeCalculated[0])>currentTime.hours){
        nextTrain = moment(trainTime, "HH:mm");
        var timeNow =moment();
        var nextTrainArrival =moment().set({'hour': trainTimeCalculated[0], 'minute': trainTimeCalculated[1]});
        var adjustedTime=moment.duration(nextTrainArrival.diff(timeNow));
        // minutesUntilNextTrain= moment.duration(nextTrainArrival.diff(timeNow));
        minutesUntilNextTrain= adjustedTime._data.hours*60 + adjustedTime._data.minutes;
    }

    // Render
    var existingTrainRow = $('#' + trainKey);
    var trainRow = existingTrainRow.length
        ? existingTrainRow
        : $('<tr>').attr('id', trainKey);

    trainRow.empty();
    trainRow.append($("<td>").text(trainName));
    trainRow.append($("<td>").text(trainDest));
    trainRow.append($("<td>").text(train.frequency));
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
