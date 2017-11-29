import React from 'react';
import {
  Text,
  View,
  ScrollView,
  Button,
  Image,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import styles from './styles';

const primaryColour = '#fa375a';



// Global variable to store program data and methods to edit the program
var gzclp = {};

/*-------------------- PROGRAM PROPERTIES --------------------*/

// To store all data that is subject to change
gzclp.state = {};

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



/*-------------------- PROGRAM HELPER METHODS --------------------*/

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
 * To add new lift to program, gives it a unique ID as a key along with
 * its other descriptors, adds it to the list of lifts so that its progress
 * may be tracked, and also adds its ID to the 'sessions' array which dictates
 * which lift is performed in which session
 */
gzclp.addLiftToProgram = function(tier, name, increment, startingWeight, sessions) {
  var newLift = gzclp.createNewLift(tier, name, increment, startingWeight);
  var nextLiftId = gzclp.getNextLiftId();

  gzclp.addLift(nextLiftId, newLift);
  gzclp.addLiftToSessions(sessions, nextLiftId);
  gzclp.setNextLiftID(gzclp.getNextLiftId() + 1);
}

/*
 * Given a lift's ID, removes lift from list of lifts and also all
 * references to it in the sessions
 */
gzclp.removeLiftFromProgram = function(id) {
  delete gzclp.getLifts()[id];

  for (var session = 0; session < gzclp.getNumberOfSessions(); session++) {
    gzclp.removeLiftIdFromSessions(id, session)
  }
}

/*
 * Given a lift's ID, and either a session number (0-3) or array of session numbers,
 * adds that ID to the corresponding session(s)
 */
gzclp.addLiftToSessions = function(sessions, id) {
  if (sessions instanceof Array) {
    for (var i = 0; i < sessions.length; i++) {
      gzclp.addLiftToSession(sessions[i], id);
    }
  } else {
    gzclp.addLiftToSession(sessions, id);
  }
}
gzclp.addLiftToSession = function(id, liftID) {
  gzclp.getSessionLifts(id).push(liftID);
}


/*
 * Given a lift's ID, and either a session number (0-3) or array of session numbers,
 * removes that ID from the corresponding session(s)
 */
gzclp.removeLiftIdFromSessions = function(id, sessions) {
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
    () => console.log("Program state data saved")
  )
}
/*
 * Load stringified program state object and reparse it as an object
 */
gzclp.loadProgramState = async function() {
  var programStateString = await AsyncStorage.getItem(
    'programState',
    () => console.log("Program state data loaded")
  );
  return JSON.parse(programStateString)
}
/*
 * Clear all saved data
 */
gzclp.deleteSavedProgramState = async function() {
  await AsyncStorage.removeItem('programState', () => console.log("Program state data deleted"))
}

/*
 * Returns current progress in the program as formatted string
 */
gzclp.outputProgramStateAsString = function() {
  var output = '';

  for (var liftID in gzclp.state.lifts) {
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
  }
  output += '\nNumber of completed sessions: ' + gzclp.getAllCompletedSessions().length

  return output;
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
  let newWeight = gzclp.getNextAttemptWeight(liftID) + gzclp.getLiftIncrement(liftID);
  gzclp.setNextAttemptWeight(liftID, newWeight);
  //gzclp.addToLiftPreviousAttempts(liftID, newWeight, currentRepSchemeIndex);
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
  const tier = gzclp.getLiftTier(liftID);

  // If failed on last rep scheme of cycle, weight is deloaded. Otherwise, it stays the same
  var newWeight;
  if (gzclp.getNextAttemptRepSchemeIndex(liftID) == gzclp.getNumberOfRepSchemes(tier) - 1) {
    if (tier == 'T1') {
      newWeight = roundDownToNearestIncrement(
        gzclp.getNextAttemptWeight(liftID) * gzclp.T1_DELOAD_FACTOR, gzclp.SMALLEST_INCREMENT
      );
    }
    if (tier == 'T2') {
      newWeight = roundDownToNearestIncrement(
        gzclp.getNextAttemptWeight(liftID) * gzclp.T2_DELOAD_FACTOR, gzclp.SMALLEST_INCREMENT
      );
    }
    if (tier == 'T3') {
      newWeight = gzclp.getNextAttemptWeight(liftID);
    }
  } else {
    newWeight = gzclp.getNextAttemptWeight(liftID);
  }

  let newRepSchemeIndex = (gzclp.getNextAttemptRepSchemeIndex(liftID) + 1) % gzclp.getNumberOfRepSchemes(tier);

  gzclp.setNextAttemptWeight(liftID, newWeight);
  gzclp.setNextAttemptRepSchemeIndex(liftID, newRepSchemeIndex);
  //gzclp.addToLiftPreviousAttempts(liftID, newWeight, newRepSchemeIndex);
}



/*-------------------- GETTERS & SETTERS --------------------*/

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
gzclp.setProgramState = function(programState) { gzclp.state = getCopyOfObject(programState); }

gzclp.getLifts = function() { return gzclp.state.lifts; }
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

gzclp.getNextAttemptWeight = function(id) { return gzclp.state.lifts[id].nextAttempt.weight; }
gzclp.getNextAttemptRepSchemeIndex = function(id) { return gzclp.state.lifts[id].nextAttempt.repSchemeIndex; }
gzclp.setNextAttemptWeight = function(id, weight) { gzclp.state.lifts[id].nextAttempt.weight = weight; }
gzclp.setNextAttemptRepSchemeIndex = function(id, repSchemeIndex) { gzclp.state.lifts[id].nextAttempt.repSchemeIndex = repSchemeIndex; }

gzclp.setLiftTier = function(id, tier) { gzclp.state.lifts[id].tier = tier; }
gzclp.setLiftName = function(id, name) { gzclp.state.lifts[id].tier = name; }
gzclp.setLiftIncrement = function(id, increment) { gzclp.state.lifts[id].tier = increment; }

gzclp.getAllCompletedSessions = function() { return gzclp.state.completedSessions};
gzclp.getCompletedSession = function(id) { return gzclp.state.completedSessions[id]};
gzclp.setCompletedSessions = function(completedSessions) { gzclp.state.completedSessions = completedSessions; }
gzclp.addCompletedSession = function(completedSession) { gzclp.state.completedSessions.push(completedSession); }



/*-------------------- SMALL HELPER FUNCTIONS --------------------*/

function refresh(component) {
  component.setState({});
}

function getCopyOfObject( obj ) {
  return JSON.parse(JSON.stringify(obj));
}

function roundDownToNearestIncrement( number, increment ) {
  return Math.floor(number * (1/increment)) / (1/increment);
}



/*-------------------- APP COMPONENTS --------------------*/

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    // Initialise program state with default values
    gzclp.resetProgramState();

    this.state = {isProgramStateVisible: false};
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'GZCLP',
    headerTintColor: '#fff',
    headerStyle: { backgroundColor: primaryColour },
    headerLeft: <TouchableOpacity
      onPress={() => navigation.navigate('Settings')}
    >
      <Image
        style={styles.settingsIcon}
        source={require('./settings.png')}
      />
    </TouchableOpacity>,
  });

  componentDidMount() {
    // Overwrite initial default program state values with stored ones, if they exist
    this.loadSavedData();
  }

  async loadSavedData() {
    var storedProgramState;

    try {
      storedProgramState = await gzclp.loadProgramState();
      if (storedProgramState !== null) {
        gzclp.setProgramState(storedProgramState);
        refresh(this);
      } else console.log("no progress yet")
    } catch (error) {
      console.log("Error retrieving data");
    }
  }

  handleShowProgramStateButton() {
    this.setState({isProgramStateVisible: !this.state.isProgramStateVisible})
  }

  // Remove stored data and reset program state to initial values
  async handleResetButtonPress() {
    try {
      await gzclp.deleteSavedProgramState();
      gzclp.resetProgramState();
      refresh(this);
    } catch (error) {
      console.log("Error removing data");
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    // Populate an array of CompletedSessionResult components to render
    var previousSessionResults = [];
    const previousSessions = gzclp.getAllCompletedSessions();
    for (var i = 0; i < previousSessions.length; i++) {
      previousSessionResults.push(
        <CompletedSessionResult
          key={i}
          sessionID={i}
        />
      );
    }

    return (
      <View style={{flex: 1}}>
        <NextSessionButton navigate={navigate} onGoBack={() => refresh(this)} />

        <ScrollView style={{marginTop: 10}}>
          {previousSessionResults.reverse()}
        </ScrollView>

        {this.state.isProgramStateVisible ? <ProgramState /> : null}

        <Button
          title={this.state.isProgramStateVisible ? 'Hide Current Progress' : 'Show Current Progress'}
          color={primaryColour}
          onPress={() => this.handleShowProgramStateButton()}
        />

        <Button
          title='Reset All Progress'
          color='#777'
          onPress={() => this.handleResetButtonPress()}
        />
      </View>
    );
  }
}



const NextSessionButton = props => {
  function handlePress() {
    const { navigate, onGoBack } = props;

    // Navigate to Session screen, which will display according to provided parameters
    navigate('Session', {
      sessionID: gzclp.getCurrentSessionID(),
      onGoBack: () => onGoBack()
    });
  }

  // lifts is an array where each element is a lift's ID
  const sessionLifts = gzclp.getSessionLifts( gzclp.getCurrentSessionID() );
  // Populate arrays of data to display in the Next Session component
  var tiers = [];
  var labels = [];
  var weights = [];
  var repSchemes = [];

  sessionLifts.forEach( (liftID, i) => {
    let tier = gzclp.getLiftTier(liftID);
    let name = gzclp.getLiftName(liftID);

    tiers.push(
      <Text key={i}>
        {tier}
      </Text>
    );
    labels.push(
      <Text key={i}>
        {gzclp.getLiftName(liftID)}
      </Text>
    );
    weights.push(
      <Text key={i}>
        {gzclp.getNextAttemptWeight(liftID)} kg
      </Text>
    );
    repSchemes.push(
      <Text key={i}>
        {gzclp.getNumberOfSets( tier, gzclp.getNextAttemptRepSchemeIndex(liftID) )}
        ×
        {gzclp.getDisplayedRepsPerSet( tier, gzclp.getNextAttemptRepSchemeIndex(liftID) )}
      </Text>
    );
  });

  return (
    <TouchableOpacity
      style={styles.sessionContainer}
      activeOpacity={0.8}
      // Navigate to session screen and pass as two parameters the required session
      // and the callback function that will refresh the home screen when session is finished
      onPress={() => handlePress()}
    >
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View>
          <Text style={styles.nextSessionTitle}>
            {'Next Session: ' + gzclp.getSessionName( gzclp.getCurrentSessionID() )}
          </Text>

          <View style={{flexDirection: 'row'}}>
            <View style={{width: 25}}>{tiers}</View>
            <View style={{width: 120}}>{labels}</View>
            <View style={{width: 50, alignItems: 'flex-end', marginRight: 20}}>{weights}</View>
            <View>{repSchemes}</View>
          </View>
        </View>

        <View style={{justifyContent: 'center'}}>
          <Text style={{fontSize: 20, color: primaryColour}}>＞</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}



const CompletedSessionResult = props => {
  const sessionID = props.sessionID;

  const session = gzclp.getCompletedSession(sessionID);
  const liftIDs = Object.keys(session);
  const liftResults = Object.values(session);

  const resultStrings = ['Not Completed', '✓', '✕'];  // TODO Define as global and use everywhere

  // Populate an array to display each lift result in the session
  var lifts = [];
  for (var i = 0; i < liftIDs.length; i++) {
    let tier = gzclp.getLiftTier(liftIDs[i]);
    let name = gzclp.getLiftName(liftIDs[i]);
    let resultString = resultStrings[ liftResults[i] ];

    lifts.push(
      <View key={i} style={{flexDirection: 'row'}}>
        <Text style={{width: 25}}>{tier}</Text>
        <Text style={{width: 120}}>{name}</Text>
        <Text>{resultString}</Text>
      </View>
    )
  }

  return (
    <View style={styles.sessionContainer}>
      <Text style={styles.completedSessionTitle}>
        Session {sessionID + 1}: {gzclp.getSessionName(sessionID % gzclp.getNumberOfSessions())}
      </Text>

      {lifts}
    </View>
  )
}



const ProgramState = () => {
  var output = gzclp.outputProgramStateAsString();

  return (
    <View style={styles.progressDataContainer}>
      <Text style={styles.progressDataTitle}>Current Program State</Text>
      <Text style={styles.progressDataContent}>{output}</Text>
    </View>
  )
}



class SessionScreen extends React.Component {
  constructor(props) {
    super(props);
    // Session state used to keep track of which lifts are complete
    // eg., if lifts with IDs 2 and 5 had been completed, lift-2 successfully
    // and lift-5 not, and lift-7 was left uncompleted,
    // state object would look as follows:
    // {2: 1, 5: 2, 7: 0}
    this.state = {};
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Session ' + gzclp.getSessionName(navigation.state.params.sessionID),
    headerTintColor: '#fff',
    headerStyle: { backgroundColor: primaryColour },
  });

  componentDidMount() {
    // Initialise state
    const { params } = this.props.navigation.state;
    const lifts = gzclp.getSessionLifts(params.sessionID);
    for (var i = 0; i < lifts.length; i++) {
      this.setState( { [lifts[i]]: 0 } )
    }
  }

  componentDidUpdate() {
    //console.log(this.state);
  }

  handleLiftResult( liftID, liftResult ) {
    if (liftResult == 1) {      // TODO generalise
      gzclp.handleSuccessfulLift(liftID);
    }
    if (liftResult == 2) {
      gzclp.handleFailedLift(liftID);
    }
  }

  async handleDoneButtonPress(lifts) {
    const { goBack } = this.props.navigation;
    const { params } = this.props.navigation.state;

    // Keep a record of this session
    gzclp.addCompletedSession(this.state);   // TODO use setter method
    console.log(gzclp.getAllCompletedSessions());

    // Clicking "Done" button calls the "success" or "failure" function for each lift,
    // depending on whether all sets were successful/failed, or do nothing if incomplete
    lifts.forEach(liftID => {
      let liftResult = this.state[liftID];
      this.handleLiftResult( liftID, liftResult );
    });

    // Increment the session counter so sessions are cycled from A1 to B2
    // and back to A1 and so on
    gzclp.incrementSessionCounter();

    // Store current state of the app
    try {
      gzclp.saveProgramState();
    } catch (error) {
      console.log("Error saving data")
    }

    // Run onGoBack function to force rerender of home screen when it's navigated back to
    params.onGoBack()
    goBack();
  }

  render() {
    const { goBack } = this.props.navigation;
    const { params } = this.props.navigation.state;

    // lifts parameter is an array where each element is a lift's ID
    const lifts = gzclp.getSessionLifts(params.sessionID);

    // Populate an array of Lift components to display in this Session Screen component
    var liftComponents = [];
    lifts.forEach( (liftID, index) => {   // TODO No need for forEach, just use For Loop
      let tier = gzclp.getLiftTier(liftID);
      let name = gzclp.getLiftName(liftID);
      let repSchemeIndex = gzclp.getNextAttemptRepSchemeIndex(liftID);
      let weight = gzclp.getNextAttemptWeight(liftID);

      liftComponents.push(
        <Lift key={index} tier={tier} name={name}
          repSchemeIndex={repSchemeIndex} weight={weight}
          // Test for whether lift is
          // 1. Successful (all sets successful),
          // 2. Failed (all sets attempted but not all successful)
          // 3. Incomplete (not all sets attempted)
          setLiftResult={(liftResult) => {this.setState( { [liftID]: liftResult } )}}
        />
      )
    });

    return (
      <View style={{flex: 1}}>
        <ScrollView>
          {liftComponents}
        </ScrollView>

        <Button
          title='Done'
          color={primaryColour}
          onPress={() => this.handleDoneButtonPress(lifts)}
        />
      </View>
    );
  }
}



class Lift extends React.Component {
  constructor(props) {
    super(props);

    // Initiate an array to be used to keep track of state of lift buttons
    // (which represent each set)
    // ie. whether they have been clicked, and if they have been set to
    // successful/failed/incomplete
    // Each element is an integer 0, 1 or 2:
    // 0 - incomplete
    // 1 - successful
    // 2 - failed
    let numberOfSets = gzclp.getNumberOfSets(props.tier, props.repSchemeIndex);
    var buttonStates = [];
    for (var i = 0; i < numberOfSets; i++) {
      buttonStates[i] = 0;
    }

    this.state = {
      buttonStates,
      isTimerVisible: false,
      areAllSetsSuccessful: false,
    };
  }

  getNumberOfSets() {
    return this.state.buttonStates.length;
  }

  componentDidUpdate() {
    //console.log(this.state);
  }

  // Each button, which represents a set, should be clickable
  // if ANY of these conditions are true:
  // 1. The set immediately preceeding it is completed
  // 2. The current set has already been completed
  // 3. Any of the following sets are completed
  isButtonClickable(id) {
    var test = false;

    let numberOfSets = this.getNumberOfSets();
    for (var i = -1; i < numberOfSets - id; i++) {
      test = test || this.state.buttonStates[id + i] != 0;
    }
    return test;
  }

  setWhetherTimerVisible(buttonID) {
    let numberOfSets = this.getNumberOfSets();

    // Timer isn't affected by selecting set as failed
    if (this.state.buttonStates[buttonID] != 2) {   // TODO: generalise
      // Before activating timer, disable it first to force it to restart after each set
      this.setState({isTimerVisible: false}, () => {
        // Check that sets aren't all completed, as no need for timer after that
        let allSetsAreComplete = true;
        for (var i = 0; i < numberOfSets; i++) {
          let buttonState = this.state.buttonStates[i];
          if (buttonState == 0) {
            allSetsAreComplete = false;
            break;
          }
        }
        if (!allSetsAreComplete) {
          this.setState({isTimerVisible: this.state.buttonStates[buttonID] == 1});
        }
      });
    }
  }

  // States represent the following:
  // 0 - Incomplete lift (not all sets attempted
  // 1 - Successful lift (all sets successful)
  // 2 - Failed lift (all sets attempted but not all successful)
  // TODO generalise this and define possible states as gzclp constants
  determineLiftResult() {
    var liftResult;

    var isComplete = true;
    var isFailed = false;

    for (var i = 0; i < this.getNumberOfSets(); i++) {
      let buttonState = this.state.buttonStates[i];

      if (buttonState == 0) {
        isComplete = false;
        break;
      } else if (buttonState == 2) {
        isFailed = true;
      }
    }

    liftResult = isComplete ? (isFailed ? 2 : 1) : 0;

    // Check if all sets successful, so visual feedback can be given
    if (liftResult == 1) {
      this.setState({ areAllSetsSuccessful: true })
    } else {
      this.setState({ areAllSetsSuccessful: false })
    }

    return liftResult;
  }

  render() {
    var {
      tier,
      repSchemeIndex,
      name,
      weight
    } = this.props;   // TODO: are these needed, surely only id is

    let numberOfSets = this.getNumberOfSets();
    let displayedRepsPerSet = gzclp.getDisplayedRepsPerSet(tier, repSchemeIndex);

    // Populate an array of LiftButtons to display
    var liftButtons = [];
    for (var id = 0; id < numberOfSets; id++) {
      liftButtons.push(
        <LiftButton
          key={id} // Required by React as every element requires a unique key
          id={id}
          reps={gzclp.getNumberOfRepsInASet(tier, repSchemeIndex, id)}
          isClickable={this.isButtonClickable(id, numberOfSets)}
          buttonState={this.state.buttonStates[id]}

          // True if all sets were completed successfully
          areAllSetsSuccessful={this.state.areAllSetsSuccessful}

          // This prop declares a function that is passed to and called by the child component LiftButton
          handleButtonClick={(clickedButtonID) => {
            // Keep track of which button was last clicked, so buttons can only be clicked in order
            this.setState(prevState => {
              let buttonStates = prevState.buttonStates;
              buttonStates[clickedButtonID] = (buttonStates[clickedButtonID] + 1) % 3;  // TODO Generalise
              return { buttonStates };
            }, () => {
              this.setWhetherTimerVisible(clickedButtonID);
              // When all sets are complete (ie. all buttons are clicked), set
              // lift as complete (by updating state) in parent component, Session
              this.props.setLiftResult( this.determineLiftResult() );
            });

          }}
        />
      );
    }

    return (
      <View style={styles.liftContainer}>
        <View style={styles.liftInfoContainer}>
          <LiftInfo
            tier={tier} name={name} weight={weight}
            sets={numberOfSets} reps={displayedRepsPerSet}
          />
        </View>

        <View style={styles.liftButtonsContainer}>
          {liftButtons}
        </View>

        {this.state.isTimerVisible ? <Timer tier={tier} /> : null}
      </View>
    );
  }
}


// TODO control layout using flexbox (space-between), not by setting exact widths
const LiftButton = props => {
  var {
    id,
    reps,
    isClickable,
    buttonState,
    handleButtonClick,
    areAllSetsSuccessful,
  } = props;

  var isClicked = buttonState != 0;
  var isSuccessful = buttonState == 1;

  // If button is clicked, display a tick either a tick or cross depending on
  // whether lift is successful or failed. Otherwise display number of reps
  var buttonText = isClicked ? (isSuccessful ? '✓' : '✕') : reps;

  // Apply style depending on whether button is inactive, active, or clicked
  // And, if clicked, successful or unsuccessful
  var currentStyle, currentTextStyle, currentBorderStyle;
  if (isClicked) {
    if (isSuccessful) {
      currentStyle = styles.liftButtonSuccessful;
      currentTextStyle = styles.liftButtonTextSuccessful;
      currentBorderStyle = styles.liftButtonBorderSuccessful;
    } else {
      currentStyle = styles.liftButtonFailed;
      currentTextStyle = styles.liftButtonTextFailed;
      currentBorderStyle = styles.liftButtonBorderFailed;
    }
  } else if (isClickable) {
    currentStyle = styles.liftButtonClickable;
    currentTextStyle = styles.liftButtonTextClickable;
    currentBorderStyle = styles.liftButtonBorderClickable;
  } else {
    currentStyle = styles.liftButtonNotClickable;
    currentTextStyle = styles.liftButtonTextNotClickable;
    currentBorderStyle = styles.liftButtonBorderNotClickable;
  }
  if (areAllSetsSuccessful) {
    //currentStyle = styles.liftButtonAllSuccessful;
    //currentBorderStyle = styles.liftButtonBorderAllSuccessful;
  }

  return (
    <View style={styles.liftButtonContainer}>
      <View style={currentBorderStyle}></View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={currentStyle}
        onPress={() => {
          if (isClickable) {
            handleButtonClick(id);
          }
        }}
      >
        <Text style={currentTextStyle}>
          {buttonText}
        </Text>
      </TouchableOpacity>

      {//<View style={styles.liftButtonBorderAllSuccessful}></View>}
    }
    </View>
  )
}



const LiftInfo = props => {
    var {
      tier,
      name,
      weight,
      sets,
      reps
    } = props;

    return (
      <View>
        <Text style={styles.liftName}>
          {tier} {name}
        </Text>
        <Text style={styles.liftDetails}>
          {weight} kg   {sets}×{reps}
        </Text>
      </View>
    )
}



class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {timeElapsed: 0};

    setInterval( () => {
      if (this.refs.myRef) {    // Check component exists first as it may have been disabled
        this.setState((prevState) => {
          return { timeElapsed: prevState.timeElapsed + 1 };
        });
      }
    }, 1000);
  }

  convertToMinutesAndSeconds(time) {
    var minutes = Math.floor(time / 60);
    var seconds = time % 60;
    // Prefix single-digit seconds with a 0
    var paddedSeconds = seconds.toString().length == 1 ? '0' + seconds : seconds;

    return minutes + ':' + paddedSeconds;
  }

  render() {
    var tier = this.props.tier;
    var time = gzclp.getRestTime(tier);

    return (
      <View ref='myRef' style={styles.timerContainer}>
        <Text style={styles.timerNumbers}>{this.convertToMinutesAndSeconds(this.state.timeElapsed)}</Text>
        <Text style={styles.timerText}>Rest for {time} minutes</Text>
      </View>
    )
  }
}



class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings ',
    headerTintColor: '#fff',
    headerStyle: { backgroundColor: primaryColour },
  };

  render() {
    return (
      null
    )
  }
}



/*-------------------- REACT NAVIGATION NAVIGATOR --------------------*/

export default StackNavigator({
  Home: {screen: HomeScreen},
  Session: {screen: SessionScreen},
  Settings: {screen: SettingsScreen}
});
