var allowStartingTimer;
var timesArray = JSON.parse(loadLocal(timesArrayKey, "[]"));
if (timesArray == null) // todo fix when figure out why JSON.parse("[]") returns 0
    timesArray = [];
var lastScramble = "";
var lastCase = 0;
var hintCase = 0;

/// invokes generateScramble() and sets scramble string
function showScramble() {
    window.allowStartingTimer = false;
    var s;
    if (window.selCases.length == 0) {
        s = "click \"select cases\" above and pick some olls to practice";
        document.getElementById("selInfo").innerHTML = "";
    }
    else {
        s = generateScramble();
        window.allowStartingTimer = true;
    }

    document.getElementById("scramble").innerHTML = "<span onclick='showHint(this, " + window.lastCase + ")'>" + s + "</span>";
}

function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function confirmUnsel(i) {
    if (confirm("Do you want to unselect this case?")) {
        var index = window.selCases.indexOf(i);
        if (index != -1)
            window.selCases.splice(index, 1);
        else
            document.getElementById("last_scramble").innerHTML = "wasn\'t  removed lol";
        document.getElementById("last_scramble").innerHTML = i + " was removed";
        showScramble();
    }
}

function displayPracticeInfo() {
    var caseCount = window.selCases.length;
    var s = "";
    if (recapArray.length == 0)
        s += "<b><a onclick='changeMode(\"recap\")'>Train</a> " + caseCount + " Cases</b>";
    else {
        s += "<b><a onclick='changeMode(\"train\")'>Recap</a> " + recapArray.length + " Cases</b>";
    }

    document.getElementById("selInfo").innerHTML = s;
}

function generateScramble() {
    if (window.lastScramble != "")
        document.getElementById("last_scramble").innerHTML = "<span>last scramble: " + window.lastScramble +
            " <span onclick='showHint(this," + lastCase + ")' class='caseNameStats'>(" + algsInfo[lastCase]["name"] + ")</span></span><span class='material-symbols-outlined inlineButton' onclick='confirmUnsel(" + lastCase + ")'>close</span>";
    displayPracticeInfo();
    // get random case
    var caseNum = 0;
    if (recapArray.length == 0) { // train
        if (window.history.state == 'recap') {
            window.history.replaceState('train', '', baseUrl + "?train")
        }
        if (currentSettings['weightedChoice']) {
            var selCasesCounts = []; // count how often each case has appeared already
            for (var i = 0; i < window.selCases.length; i++) {
                var count = 0;
                var currentCase = window.selCases[i];
                for (var j = 0; j < window.timesArray.length; j++) {
                    if (window.timesArray[j]["case"] == currentCase)
                        count += 1;
                }
                selCasesCounts.push(count);
            }

            var expectedCount = 0; // calculate how often each case "should have" appeared
            for (var i = 0; i < selCasesCounts.length; i++) {
                expectedCount += selCasesCounts[i];
            }
            var expectedCount = expectedCount / window.selCases.length;

            var selCaseWeights = []; // calculate the weights with which the next case is to be chosen. weights are arranged cumulatively
            for (var i = 0; i < selCasesCounts.length; i++) {
                if (i == 0)
                    selCaseWeights.push(3.5 ** (- (selCasesCounts[i] - expectedCount)));
                else
                    selCaseWeights.push(selCaseWeights[i - 1] + 3.5 ** (- (selCasesCounts[i] - expectedCount)));
            }
            caseNum = weightedRandomElement(selCases, selCaseWeights)

            //console.log(selCasesCounts, expectedCount, selCaseWeights, caseNum);
        }

        else // random choice of next case
            caseNum = randomElement(window.selCases);
    } else { // recap
        // select the case
        caseNum = randomElement(recapArray);
        // remove it from the array
        const index = recapArray.indexOf(caseNum);
        recapArray.splice(index, 1);
    }
    var alg = randomElement(window.scramblesMap[caseNum]);
    var rotation = randomElement(["", " U", " U'"]);
    var preRotation = randomElement(["", "U ", "U' "]);
    var finalAlg = preRotation + alg + rotation;

    window.lastScramble = finalAlg;
    window.lastCase = caseNum;

    return finalAlg;
}

/*        TIMER        */

var startMilliseconds, stopMiliseconds; // date and time when timer was started
var allowed = true; // allowed var is for preventing auto-repeat when you hold a button
var running = false; var waiting = false;
var timer = null;
var timerActivatingButton = 32; // 17 for ctrl
var timeout;

function msToHumanReadable(duration) {
    if (!Number.isFinite(duration))
        return "-";
    var milliseconds = parseInt((duration % 1000) / 10)
        , seconds = parseInt((duration / 1000) % 60)
        , minutes = parseInt((duration / (1000 * 60)) % 60)
        , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10 && (minutes > 0 || hours > 0)) ? "0" + seconds : seconds;
    milliseconds = (milliseconds < 10) ? "0" + milliseconds : milliseconds;

    hoursString = (hours == 0) ? "" : hours + ":";
    minutesString = (minutes == 0) ? "" : minutes + ":";

    return hoursString + minutesString + seconds + "." + milliseconds;
}

function displayTime() {
    if (running) {
        var d = new Date();
        var diff = d.getTime() - window.startMilliseconds;
        if (diff >= 0)
            timer.innerHTML = msToHumanReadable(diff);
    }
}

function handleTouchEnd() {
    if (!window.allowStartingTimer)
        return; // preventing auto-repeat
    if (!running && !waiting) {
        timerStart();
    }
    else {
        timerAfterStop();
    }
}

function handleTouchStart() {
    if (running)
        timerStop();
    else {
        timerSetReady(); // set green back
    }
}

function timerStop() {
    waiting = true;
    running = false;
    clearTimeout(timeout);

    var d = new Date();
    stopMiliseconds = d.getTime();
    timer.innerHTML = msToHumanReadable(stopMiliseconds - startMilliseconds);
    timer.style.color = "#850000";

    appendStats();
    showScramble();
}

function timerSetReady() {
    waiting = false;
    timer.innerHTML = "0.00";
    timer.style.color = "#008500";
}

function timerStart() {
    var d = new Date();
    startMilliseconds = d.getTime();
    running = true;
    timeout = setInterval(displayTime, 10);
    timer.style.color = currentSettings['colors']['--text'];
}

function timerAfterStop() {
    timer.style.color = currentSettings['colors']['--text'];
}


// http://stackoverflow.com/questions/1787322/htmlspecialchars-equivalent-in-javascript
function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}

/// [0: ResultInstance, 1: ResultInstance, ...]

// invoked right after the timer stopped
function appendStats() {
    // assuming the time can be grabbed from timer label, and the case - window.lastCase
    window.timesArray.push(makeResultInstance());
    displayStats();
}

/// removes time from array and invokes displayStats()
function removeTime(i) {
    window.timesArray.splice(i, 1);
    displayStats();
}


function updateInstancesIndeces() {
    for (var i = 0; i < window.timesArray.length; i++)
        window.timesArray[i]["index"] = i;
}

/// requests confirmation and deletes result
function confirmRem(i) {
    var inst = window.timesArray[i];
    if (confirm("Are you sure you want to remove this time?\n\n" + inst["time"])) {
        removeTime(i);
        updateInstancesIndeces();
        displayStats();
    }
}

function confirmRemLast() {
    var i = window.timesArray.length;
    if (i != 0)
        confirmRem(i - 1);
}

/// requests confirmation and empty times array (clear session)
function confirmClear() {
    if (confirm("Are you sure you want to clear session?")) {
        window.timesArray = [];
        document.getElementById('infoHeader').innerHTML = ('')
        displayStats();
    }
}

function renderHint(i) {
    document.getElementById("boxTitle").innerHTML = '#' + i + " " + algsInfo[i]["name"];
    var algsStr = "Algorithms:<br/>"
    for(const alg of algsInfo[i]["a"]) {
        algsStr += alg + "<br/>"
    }
    document.getElementById('prevButton').style.opacity = i == 1 ? 0 : 1;
    document.getElementById('nextButton').style.opacity = i == Object.keys(algsInfo).length ? 0 : 1;
    document.getElementById("boxalg").innerHTML = algsStr;
    document.getElementById("boxsetup").innerHTML = "Setup:<br/>" + scramblesMap[i][0];
    document.getElementById("boxImg").src = "pic/" + i + ".svg";
}

function showHint(element, i) {
    renderHint(i);
    hintCase = i;
    openDialog('hintWindow');
}

function previousCase() {
    hintCase = Math.max(hintCase - 1, 1);
    renderHint(hintCase);
}

function nextCase() {
    var length = Object.keys(algsInfo).length;
    hintCase = Math.min(hintCase + 1, length);
    renderHint(hintCase);
}
/// \param r - result instance (see makeResultInstance)
/// \returns html code for displaying the instance
function makeHtmlDisplayableTime(r) {
    var isMostRecent = (r == window.timesArray[window.timesArray.length - 1]);
    var classname = isMostRecent ? "timeResultBold" : "timeResult";
    resultString = "<span class='" + classname + "' title='" +
        escapeHtml(r["details"]) + "' onclick='confirmRem("
        + r["index"] + ")' >" + r["time"] + "</span>";
    return resultString;
}

/// fills resultInfo container with info about given result instance
/// \param r result instsnce (see makeResultInstance)
/// set \param r to null if you want to clear result info
/// displays averages etc.
/// fills "times" right panel with times and last result info
function displayStats() {
    saveLocal(timesArrayKey, JSON.stringify(window.timesArray));
    var len = window.timesArray.length;

    var el = document.getElementById("times");
    if (len == 0) {
        el.innerHTML = "";
        document.getElementById("infoHeader").innerHTML = '0';
        document.getElementById('numCases').innerText = '0';
        return;
    }

        // case-by-case
    var resultsByCase = {}; // [57: [...], 12: [...], ...];
    for (var i = 0; i < len; i++) {
        var currentCase = window.timesArray[i]["case"];
        if (resultsByCase[currentCase] == null)
            resultsByCase[currentCase] = [];
        resultsByCase[currentCase].push(window.timesArray[i]);
    }

    var keys = Object.keys(resultsByCase);
    keys.sort((n1,n2) => n1 - n2);

    var s = "";
    // allocate them inside times span
    for (var j = 0; j < keys.length; j++) {
        var case_ = keys[j];
        var timesString = "";
        var meanForCase = 0.0;
        var i = 0;
        for (; i < resultsByCase[case_].length; i++) {
            timesString += makeHtmlDisplayableTime(resultsByCase[case_][i]);
            if (i != resultsByCase[case_].length - 1)
                timesString += ", ";
            // avg
            meanForCase *= i / (i + 1);
            meanForCase += resultsByCase[case_][i]["ms"] / (i + 1);
        }
        s += "<div class='timeEntry'><div><span class='caseNameStats' onclick='showHint(this," + keys[j] + ")'>" + algsInfo[case_]["name"] + "</span>: " + msToHumanReadable(meanForCase) + "</div>" + timesString + "</div>";
    }
    el.innerHTML = s;
    
    document.getElementById("infoHeader").innerText = (len == 0 ? '' : len + ' ');
    document.getElementById('numCases').innerText = keys.length;
}

function makeResultInstance() {
    var currentTime = document.getElementById("timer").innerHTML;
    var details = window.lastScramble;
    var index = window.timesArray.length;

    return {
        "time": currentTime,
        "ms": timeStringToMseconds(currentTime) * 10, // *10 because current time 1.23 display only hundreths, not thousandth of a second
        "details": details,
        "index": index,
        "case": window.lastCase
    };
}

// converts timestring to milliseconds (int)
// 1:06.15 -> 6615
function timeStringToMseconds(s) {
    if (s == "")
        return -1;
    var parts = s.split(":");
    var secs = parseFloat(parts[parts.length - 1]);
    if (parts.length > 1) // minutes
        secs += parseInt(parts[parts.length - 2]) * 60;
    if (parts.length > 2) // hrs
        secs += parseInt(parts[parts.length - 3]) * 3600;
    if (isNaN(secs))
        return -1;
    return Math.round(secs * 100);
}