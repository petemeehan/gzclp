import { AsyncStorage } from 'react-native';

export const gzclp = {};



/*-------------------- PROGRAM PROPERTIES --------------------*/

// To store all data that is subject to change
gzclp.state = gzclp.state || {};

// Depends on equipment user has access to - 2.5kg is often smallest possible increment
gzclp.SMALLEST_INCREMENT = 2.5;

// The factors by which the working weights are reduced after finishing a cycle
gzclp.T1_DELOAD_FACTOR = 0.85
gzclp.T2_DELOAD_FACTOR = 0.85

gzclp.REP_SCHEMES = {
  T1: [
    ['3','3','3','3','3+'],
    ['2','2','2','2','2','2+'],
    ['1','1','1','1','1','1','1','1','1','1+'],
  ],
  T2: [
    ['10','10','10'],
    ['8','8','8'],
    ['6','6','6'],
  ],
  T3: [
    ['15','15','25'],
  ]
}

gzclp.REST_TIMES = {
  T1: [3, 5],
  T2: [2, 3],
  T3: [1, 2]
}

gzclp.INCREMENTS = [0.5, 1, 2.5 , 5, 10];

/*
 * Used for initialising program data
 * Each element is in the format [tier, name, increment, starting weight, session(s)]
 */
gzclp.DEFAULT_LIFTS = [
  ['T1', 'Squat',           5,    20,   0],
  ['T1', 'Deadlift',        5,    20,   3],
  ['T1', 'Bench Press',     2.5,  20,   2],
  ['T1', 'Overhead Press',  2.5,  20,   1],
  ['T2', 'Squat',           2.5,  20,   2],
  ['T2', 'Deadlift',        2.5,  20,   1],
  ['T2', 'Bench Press',     2.5,  20,   0],
  ['T2', 'Overhead Press',  2.5,  20,   3],
  ['T3', 'Lat Pulldown',    5,    20,   [0,2]],
  ['T3', 'Dumbbell Row',    5,    20,   [1,3]],
];

/*
 * Lifts are stored in following format:
 *  {
 *    0: {
 *      tier: 'T1',
 *      name: 'Squat',
 *      increment: 5,
 *      nextAttempt: {
 *        weight: 30,
 *        repSchemeIndex: 0
 *      }
 *      previousAttempts: [
 *        {
 *          weight: 20,
 *          repSchemeIndex: 0
 *        }, {
 *          weight: 25,
 *          repSchemeIndex: 0
 *        }, ...
 *      ]
 *    },
 *    1: { ...
 *  }
 */
gzclp.state.lifts = {};

// For assigning unique IDs to new lifts
gzclp.state.nextLiftId = 0;

// For keeping track of which lifts are in each session
gzclp.state.sessions = [
  { name: 'A1', lifts: [] },
  { name: 'B1', lifts: [] },
  { name: 'A2', lifts: [] },
  { name: 'B2', lifts: [] },
]

// To keep track of which session is next
gzclp.state.nextSessionID = 0;

// For keeping a record of completed sessions
// Stored in the following format:
//  [
//    {
//       liftID: liftResult
//       liftID: liftResult
//       liftID: liftResult
//    },
//    {
//       liftID: liftResult
//       liftID: liftResult
//       liftID: liftResult
//    },
//    ...
//  ]
gzclp.state.completedSessions = [];



/*-------------------- GETTERS & SETTERS --------------------*/

gzclp.getIncrements = function() { return gzclp.INCREMENTS }

gzclp.getNumberOfRepSchemes = function(tier) { return gzclp.REP_SCHEMES[tier].length; }
gzclp.getRepScheme = function(tier, repSchemeIndex) { return gzclp.REP_SCHEMES[tier][repSchemeIndex]; }
gzclp.getNumberOfSets = function(tier, repSchemeIndex) { return gzclp.getRepScheme(tier, repSchemeIndex).length; }
gzclp.getNumberOfRepsInASet = function(tier, repSchemeIndex, setIndex) { return gzclp.getRepScheme(tier, repSchemeIndex)[setIndex] }

// For displaying typical reps per set (eg. "5 x 3+")
gzclp.getDisplayedRepsPerSet = function(tier, repSchemeIndex) {
  let repScheme = gzclp.getRepScheme(tier, repSchemeIndex);
  return repScheme[repScheme.length - 1];
}

gzclp.getRestTime = function(tier) {
  var restTime = gzclp.REST_TIMES[tier];
  var string = restTime[0] + '-' + restTime[1];
  return string;
}

gzclp.getProgramState = function() { return gzclp.state; }
gzclp.setProgramState = function(programState) { gzclp.state = gzclp.getCopyOfObject(programState); }

gzclp.getAllLifts = function() { return gzclp.state.lifts; }
gzclp.addLift = function(id, lift) { gzclp.state.lifts[id] = lift; }

gzclp.getSession = function(id) { return gzclp.state.sessions[id]; }
gzclp.getNumberOfSessions = function() { return gzclp.state.sessions.length; }
gzclp.getSessionName = function(id) { return gzclp.getSession(id).name; }
gzclp.getSessionLifts = function(id) { return gzclp.getSession(id).lifts; }
gzclp.setSessionLifts = function(id, arr) { gzclp.getSession(id).lifts = arr; }

gzclp.getCurrentSessionID = function() { return gzclp.state.nextSessionID; }
gzclp.setCurrentSessionID = function(num) { gzclp.state.nextSessionID = num; }

gzclp.getNextLiftId = function() { return gzclp.state.nextLiftId; }
gzclp.setNextLiftID = function(num) { gzclp.state.nextLiftId = num; }

gzclp.getLiftTier = function(id) { return gzclp.state.lifts[id].tier; }
gzclp.getLiftName = function(id) { return gzclp.state.lifts[id].name; }
gzclp.getLiftIncrement = function(id) { return gzclp.state.lifts[id].increment; }

gzclp.setLiftTier = function(id, tier) { gzclp.state.lifts[id].tier = tier; }
gzclp.setLiftName = function(id, name) { gzclp.state.lifts[id].name = name; }
gzclp.setLiftIncrement = function(id, increment) { gzclp.state.lifts[id].increment = increment; }

gzclp.getNextAttemptWeight = function(id) { return gzclp.state.lifts[id].nextAttempt.weight; }
gzclp.getNextAttemptRepSchemeIndex = function(id) { return gzclp.state.lifts[id].nextAttempt.repSchemeIndex; }
gzclp.setNextAttemptWeight = function(id, weight) { gzclp.state.lifts[id].nextAttempt.weight = weight; }
gzclp.setNextAttemptRepSchemeIndex = function(id, repSchemeIndex) { gzclp.state.lifts[id].nextAttempt.repSchemeIndex = repSchemeIndex; }

gzclp.getAllCompletedSessions = function() { return gzclp.state.completedSessions};
gzclp.getCompletedSession = function(id) { return gzclp.state.completedSessions[id]};
gzclp.setCompletedSessions = function(completedSessions) { gzclp.state.completedSessions = completedSessions; }
gzclp.addCompletedSession = function(completedSession) { gzclp.state.completedSessions.push(completedSession); }



/*-------------------- MAIN PROGRAM METHODS --------------------*/

/*
 * Given defining variables, creates and returns a 'lift' object
 */
gzclp.createNewLift = function(tier, name, increment, weight) {
  return {
    tier,
    name,
    increment,
    nextAttempt: {
      weight,
      repSchemeIndex: 0,
    },
    previousAttempts: []
  }
}

/*
 * To add new lift to program. Gives it a unique ID as a key along with
 * its other descriptors, adds it to the list of lifts so that its progress
 * may be tracked, and also adds its ID to the 'sessions' array which dictates
 * which lift is performed in which session
 */
gzclp.addLiftToProgram = function(tier, name, increment, startingWeight, sessions) {
  var newLift = gzclp.createNewLift(tier, name, increment, startingWeight);
  var nextLiftId = gzclp.getNextLiftId().toString();

  gzclp.addLift(nextLiftId, newLift);
  gzclp.addLiftToSessions(sessions, nextLiftId);
  gzclp.setNextLiftID(gzclp.getNextLiftId() + 1);
}

/*
 * Given a lift's ID, removes lift from list of lifts and also all
 * references to it in the sessions
 */
gzclp.removeLiftFromProgram = function(id) {
  delete gzclp.getAllLifts()[id];

  for (var session = 0; session < gzclp.getNumberOfSessions(); session++) {
    gzclp.removeLiftFromSessions(id, session)
  }
}

/*
 * Given a lift's ID, and either a session number (0-3) or array of session numbers,
 * adds that ID to the corresponding session(s)
 */
gzclp.addLiftToSessions = function(sessionIDs, liftID) {
  if (sessionIDs instanceof Array) {
    for (var i = 0; i < sessionIDs.length; i++) {
      gzclp.addLiftToSession(sessionIDs[i], liftID);
    }
  } else {
    gzclp.addLiftToSession(sessionIDs, liftID);
  }
}
gzclp.addLiftToSession = function(sessionID, liftID) {
  gzclp.getSessionLifts(sessionID).push(liftID);
}

/*
 * Given a lift's ID, and either a session number (0-3) or array of session numbers,
 * removes that ID from the corresponding session(s)
 */
gzclp.removeLiftFromSessions = function(id, sessions) {
  if (sessions instanceof Array) {
    for (var i = 0; i < sessions.length; i++) {
      let sessionLifts = gzclp.getSessionLifts(sessions[i]);
      let index = sessionLifts.indexOf(id);
      if (index != -1) {
        sessionLifts.splice(index, 1);
      }
    }
  } else {
    let sessionLifts = gzclp.getSessionLifts(sessions);
    let index = sessionLifts.indexOf(id);
    if (index != -1) {
      sessionLifts.splice(index, 1);
    }
  }
}

/*
 * Given a lift's ID, weight and rep scheme, creates an object associated
 * with that lift attempt and adds it to the array of that lift's previous attempts
 */
gzclp.addToLiftPreviousAttempts = function(id, weight, repSchemeIndex) {
  let previousAttempts = gzclp.state.lifts[id].previousAttempts;
  previousAttempts.push({weight, repSchemeIndex});
}

/*
 * Resets all state data to its original default values
 */
gzclp.resetProgramState = function() {
  gzclp.setCurrentSessionID(0);
  gzclp.setNextLiftID(0);
  gzclp.state.lifts = {};
  gzclp.state.completedSessions = [];

  for (var i = 0; i < gzclp.getNumberOfSessions(); i++) {
    gzclp.setSessionLifts(i, []);
  }

  for (var i = 0; i < gzclp.DEFAULT_LIFTS.length; i++) {
    gzclp.addLiftToProgram(...gzclp.DEFAULT_LIFTS[i]);
  }
}

/*
 * Save entire program state object in stringified form, so that app data
 * persists when it is closed and reopened
 */
gzclp.saveProgramState = async function() {
  await AsyncStorage.setItem(
    'programState',
    JSON.stringify(gzclp.state),
    () => console.log("Program state saved")
  )
}
/*
 * Load stringified program state object and reparse it as an object
 */
gzclp.loadProgramState = async function() {
  var programStateString = await AsyncStorage.getItem(
    'programState',
    () => console.log("Program state loaded")
  );
  return JSON.parse(programStateString)
}
/*
 * Clear all saved data
 */
gzclp.deleteSavedProgramState = async function() {
  await AsyncStorage.removeItem('programState', () => console.log("Program state deleted"))
}

/*
 * Returns current progress in the program as formatted string
 */
gzclp.outputProgramStateAsString = function() {
  var output = '';
  const lifts = gzclp.getAllLifts();

  Object.keys(lifts).forEach(function(liftID) {
    let tier = gzclp.getLiftTier(liftID);
    let name = gzclp.getLiftName(liftID);
    let repSchemeIndex = gzclp.getNextAttemptRepSchemeIndex(liftID);
    let numberOfSets = gzclp.getNumberOfSets(tier, repSchemeIndex);
    let displayedRepsPerSet = gzclp.getDisplayedRepsPerSet(tier, repSchemeIndex);
    let weight = gzclp.getNextAttemptWeight(liftID);
    output += (
      tier + ' ' +
      numberOfSets + '×' +
      displayedRepsPerSet + ' \t' +
      weight + 'kg\t ' +
      name + '\n'
    );
  });
  output += '\nNumber of completed sessions: ' + gzclp.getAllCompletedSessions().length

  return output;
}

/*
 * Given a tier (eg. "T1"), returns as an array of all IDs of lifts in that tier
 */
gzclp.getAllLiftIDsInTier = function(tier) {
  var liftIDs = [];
  const lifts = gzclp.getAllLifts();

  Object.keys(lifts).forEach(function(liftID) {
    if (lifts[liftID].tier == tier) {
      liftIDs.push(liftID);
    }
  });

  return liftIDs;
}


/*-------------------- PROGRAM PROGRESSION METHODS --------------------*/

/*
 * After every session, increment the session counter so that the next session
 * is loaded next time
 */
gzclp.incrementSessionCounter = function() {
  gzclp.setCurrentSessionID((gzclp.getCurrentSessionID() + 1) % gzclp.getNumberOfSessions());
}

/*
 * On successful completion of a lift (a workout), continue with same rep scheme
 * but increment the weight
 */
gzclp.handleSuccessfulLift = function(liftID) {
  let currentWeight = gzclp.getNextAttemptWeight(liftID);
  let currentRepSchemeIndex = gzclp.getNextAttemptRepSchemeIndex(liftID);
  let newWeight = currentWeight + gzclp.getLiftIncrement(liftID);

  gzclp.addToLiftPreviousAttempts(liftID, currentWeight, currentRepSchemeIndex);
  gzclp.setNextAttemptWeight(liftID, newWeight);
}

/*
 * On failure, cycle through rep schemes based on whether lift is T1/T2/T3
 * (There are three for T1, three for T2, one for T3)
 * On failing last rep scheme, strategy varies depending on tier:
 * T1: restart new cycle on first repscheme with 85% of last weight attempted
 * T2: restart new cycle on first repscheme with weight 5kg heavier than what was last lifted on first repscheme
 * (TODO: this is currently implemented same as for T1, as previous sessions are not yet recorded)
 * T3: no change
 */
gzclp.handleFailedLift = function(liftID) {
  let tier = gzclp.getLiftTier(liftID);
  let currentWeight = gzclp.getNextAttemptWeight(liftID);
  let currentRepSchemeIndex = gzclp.getNextAttemptRepSchemeIndex(liftID);

  // If failed on last rep scheme of cycle, weight is deloaded. Otherwise, it stays the same
  var newWeight;
  if (currentRepSchemeIndex == gzclp.getNumberOfRepSchemes(tier) - 1) {
    if (tier == 'T1') {
      newWeight = gzclp.roundDownToNearestIncrement(
        currentWeight * gzclp.T1_DELOAD_FACTOR, gzclp.SMALLEST_INCREMENT
      );
    }
    if (tier == 'T2') {
      newWeight = gzclp.roundDownToNearestIncrement(
        currentWeight * gzclp.T2_DELOAD_FACTOR, gzclp.SMALLEST_INCREMENT
      );
    }
    if (tier == 'T3') {
      newWeight = currentWeight;
    }
  } else {
    newWeight = currentWeight;
  }

  let newRepSchemeIndex = (currentRepSchemeIndex + 1) % gzclp.getNumberOfRepSchemes(tier);

  gzclp.addToLiftPreviousAttempts(liftID, currentWeight, currentRepSchemeIndex);

  gzclp.setNextAttemptWeight(liftID, newWeight);
  gzclp.setNextAttemptRepSchemeIndex(liftID, newRepSchemeIndex);
}



/*-------------------- MISC HELPER FUNCTIONS --------------------*/

gzclp.refreshComponent = function(component) {
  component.setState({});
}

gzclp.getCopyOfObject = function(obj) {
  return JSON.parse(JSON.stringify(obj));
}

gzclp.roundDownToNearestIncrement = function(number, increment) {
  return Math.floor(number * (1/increment)) / (1/increment);
}
