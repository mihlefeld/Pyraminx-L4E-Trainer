const timesArrayKey = "l4eTimesArray";
const selectionArrayKey = "l4eSelection";

var selCases = [];

var algsGroups = {
    "Group A": [1, 2, 3, 4, 5],
    "Group B": [6, 7, 8, 9, 10],
    "Group C": [11, 12, 13, 14, 15],
    "Group D": [16, 17, 18, 19, 20],
    "Group E": [21, 22, 23, 24, 25],
    "Group F": [26, 27, 28, 29, 30],
    "Group G": [31, 32, 33, 34, 35]
};

var optionalGroups = [];

var optionalAlgsCount = 0;

var algsInfo = {
    "1": {
        "name": "unnamed",
        "a": [
            "R U' R'",
            "B R U' R' U B'",
            "(U') B R' L' R L B'",
            "B' R U' R' U B"
        ],
        "s": "L U' B' U B L'"
    },
    "2": {
        "name": "unnamed",
        "a": [
            "L R' L' R",
            "B L R' L' R B'",
            "B' L R' L' R B",
            "(U) L' B' U B U' L"
        ],
        "s": "L B L B' U' L"
    },
    "3": {
        "name": "unnamed",
        "a": [
            "R U R'",
            "B L' R' L R B'",
            "(U) B U' R U R' B'",
            "(U) B' U' R U R' B"
        ],
        "s": "L B' U' B U L'"
    },
    "4": {
        "name": "unnamed",
        "a": [
            "(U) L' B L' B' L'",
            "(U') R' B' R' B R'",
            "L R' L' R' U' R'",
            "(U) L' U' L' R' L' R"
        ],
        "s": "B R B R B' R B'"
    },
    "5": {
        "name": "unnamed",
        "a": [
            "R' L R L'",
            "B R' L R L' B'",
            "B' R' L R L' B",
            "(U) L B L B' U' L"
        ],
        "s": "L' B' U B U' L"
    },
    "6": {
        "name": "unnamed",
        "a": [
            "L R' L' R' U R'",
            "(U) R U B' R B R",
            "(U) R U' R L R L'",
            "(U') R' B' R' B U' R'"
        ],
        "s": "R' L R' U R' U' L'"
    },
    "7": {
        "name": "unnamed",
        "a": [
            "B U' B' U' B U' B'",
            "B' U' B U' B' U' B",
            "L U' L' U' L U' L'",
            "L' U' L U' L' U' L"
        ],
        "s": "R U R' U R U R'"
    },
    "8": {
        "name": "unnamed",
        "a": [
            "R B U B' U R'",
            "(U') R U' B U B' U' R'",
            "B L' B U B R' L R",
            "B L' U B R' L R B"
        ],
        "s": "R B' L' R' B' U L B'"
    },
    "9": {
        "name": "unnamed",
        "a": [
            "(U') L R L U' L' R' L'",
            "(U') L' U' B' U' B U L",
            "R U B U' B' U' R'",
            "R U R' U' L' U' L"
        ],
        "s": "L' U' L U R U R'"
    },
    "10": {
        "name": "unnamed",
        "a": [
            "(U') L R' L' R L' U L",
            "(U) L' B L' B' L U' L",
            "(U') L' U L U' R U' R'",
            "L' U L' B L B' L"
        ],
        "s": "L R' L' R L' U L"
    },
    "11": {
        "name": "unnamed",
        "a": [
            "(U) L B L B' U L",
            "(U') L' U L' R' L' R",
            "(U') L' U' B L' B' L'",
            "R' L R L U' L"
        ],
        "s": "R' U' L' U L' R L'"
    },
    "12": {
        "name": "unnamed",
        "a": [
            "(U') R U' R' L' U' L",
            "L' U' L U R U' R'",
            "(U') L B L B' L R U' R'",
            "(U) L B' U' B U L U' L"
        ],
        "s": "L' U L U R' L R L'"
    },
    "13": {
        "name": "unnamed",
        "a": [
            "R U' R' U L' U' L",
            "B L R' B U R B L'",
            "B L' B R U R' B L",
            "(U) B L' B R' L B U' R"
        ],
        "s": "B' L' B' R U' R' L B'"
    },
    "14": {
        "name": "unnamed",
        "a": [
            "L R B' R B L' R",
            "R U R' U R U' R'",
            "(U) R U R' U' R U' R'",
            "(U') R U' R' U R U R'"
        ],
        "s": "R U' R' U R U R'"
    },
    "15": {
        "name": "unnamed",
        "a": [
            "(U) B U' L U L' U B'",
            "(U') B U' L U' L' U B'",
            "(U) B' U R' U R U' B",
            "(U') B' U R' U' R U' B"
        ],
        "s": "L U' R U' R' U L'"
    },
    "16": {
        "name": "unnamed",
        "a": [
            "B L U L' U' B'",
            "B' U' R' U R B",
            "(U') L R U R' U' L'",
            "(U') L' U' B' U B L"
        ],
        "s": "R U B U' B' R'"
    },
    "17": {
        "name": "unnamed",
        "a": [
            "L B L B' L",
            "(U) R B' R B R",
            "(U) R U R L R L'",
            "(U') R' L R L U L"
        ],
        "s": "B R' B R' B' R' B'"
    },
    "18": {
        "name": "unnamed",
        "a": [
            "(U) B U L U' L' B'",
            "(U) B' R' U' R U B",
            "L U R U' R' L'",
            "L' B' U' B U L"
        ],
        "s": "R B U B' U' R'"
    },
    "19": {
        "name": "unnamed",
        "a": [
            "(U') L' B' U' B L",
            "(U') R B U' B' R'",
            "(U') L' U L R U' R'",
            "(U) L' U' L R U R'"
        ],
        "s": "B L B' U B L' B'"
    },
    "20": {
        "name": "unnamed",
        "a": [
            "(U') L' U' L",
            "(U) B U L' U' L B'",
            "(U') B' R L R' L' B",
            "(U) B' U L' U' L B"
        ],
        "s": "R U B U B' R'"
    },
    "21": {
        "name": "unnamed",
        "a": [
            "L B L B U' B L",
            "R B U' B R B R",
            "B R B U' R B' R B'",
            "B' L B' L U' B L B"
        ],
        "s": "R' L R' L U L' R' L'"
    },
    "22": {
        "name": "unnamed",
        "a": [
            "(U') L R' B L B' L R",
            "(U') L' U L U L' U' L",
            "L' U L U' L' U' L",
            "(U) L' U' L U L' U L"
        ],
        "s": "L' U' L U L' U L"
    },
    "23": {
        "name": "unnamed",
        "a": [
            "(U') L B L B U B L",
            "R B U B R B R",
            "R U R' U L' U L",
            "B R B U R B' R B'"
        ],
        "s": "B' L' B' U' L' B L' B"
    },
    "24": {
        "name": "unnamed",
        "a": [
            "L' U L",
            "B L' U L U' B'",
            "(U) B' L R L' R' B",
            "B' L' U L U' B"
        ],
        "s": "R B U' B' U' R'"
    },
    "25": {
        "name": "unnamed",
        "a": [
            "L' B' U B' L' B' L'",
            "R' B' R' B' U B' R'",
            "B R' B R' U B' R' B'",
            "B' L' B' U L' B L' B"
        ],
        "s": "R U' B' R B L R L'"
    },
    "26": {
        "name": "unnamed",
        "a": [
            "L' B' U B L",
            "R B U B' R'",
            "(U) R U R' L' U' L",
            "R U' R' L' U L"
        ],
        "s": "B L B' U' B L' B'"
    },
    "27": {
        "name": "unnamed",
        "a": [
            "(U) R U' B U' B' R'",
            "R U B U' B' U R'",
            "B' L' U R' B L U R",
            "B' R' L' R B' U' L B'"
        ],
        "s": "R' B L R' B' U R' L'"
    },
    "28": {
        "name": "unnamed",
        "a": [
            "(U') L' B' U' B' L' B' L'",
            "(U') L' U' L U' R U' R'",
            "R' B' R' B' U' B' R'",
            "B R' B R' U' B' R' B'"
        ],
        "s": "B' L B' L U B L B"
    },
    "29": {
        "name": "unnamed",
        "a": [
            "(U) L' U B' U B L",
            "(U') L' U' B' U B U' L",
            "(U') B L R L' B U R' B",
            "(U') B R U' L B' R' U' L'"
        ],
        "s": "B' R B' U' B' L R' L'"
    },
    "30": {
        "name": "unnamed",
        "a": [
            "(U') L' U L U' R U R'",
            "(U) B' L' B' R U' R' L B'",
            "(U) B' R B' L R' B' U L'",
            "(U') B' R B' L' U' L B' R'"
        ],
        "s": "B R B L' U L R' B"
    },
    "31": {
        "name": "unnamed",
        "a": [
            "(U) L' B' U' B U' L",
            "(U') L' U B' U' B U L",
            "B U' R L B' R' U' L'",
            "(U) B' R B' U' B' L R' L'"
        ],
        "s": "L' B R L B U' R' B"
    },
    "32": {
        "name": "unnamed",
        "a": [
            "(U') L' U L R U R'",
            "(U) R U R' U' L' U L",
            "L R' L' R' B U B' R'",
            "(U) L U' B' U B L U L"
        ],
        "s": "R' L R L B' U' B L"
    },
    "33": {
        "name": "unnamed",
        "a": [
            "L R L U L' R' L'",
            "(U) L' U L U R U' R'",
            "L' U' B' U B U L",
            "L' U' L U R U R'"
        ],
        "s": "R U B U' B' U' R'"
    },
    "34": {
        "name": "unnamed",
        "a": [
            "B R L' U' B L U' B R'",
            "B' L' R U B' R' U B' L",
            "L' B U' R B U' R' L B",
            "L' B' U R' U R B U' L"
        ],
        "s": "R U' R' L' U B' U B L"
    },
    "35": {
        "name": "unnamed",
        "a": [
            "B U B' U B U B'",
            "B' U B U B' U B",
            "L U L' U L U L'",
            "L' U L U L' U L"
        ],
        "s": "R U' R' U' R U' R'"
    }
};