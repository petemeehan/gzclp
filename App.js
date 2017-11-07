import React from 'react';
import {
  Text,
  View,
  ScrollView,
  Button,
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
gzclp.MINIMUM_INCREMENT = 2.5;

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

/*
 * Used for initialising program data
 * Each element is in the format [tier, exercise, increment, starting weight, session(s)]
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
 *  gzclp.state.lifts = {
 *    0: {
 *      tier: 'T1',
 *      exercise: 'Squat',
 *      increment: 5,
 *      workouts: [
 *        {
 *          weight: 20,
 *          repScheme: 0
 *        }, {
 *          weight: 25,
 *          repScheme: 0
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
gzclp.state.sessionCounter = 0;



/*-------------------- PROGRAM HELPER METHODS --------------------*/

/*
 * Given defining variables, creates and returns a 'lift' object
 */
gzclp.createNewLift = function(tier, exercise, increment, startingWeight) {
  return {
    tier,
    exercise,
    increment,
    workouts: [
      {
        weight: startingWeight,
        repScheme: 0,
      }
    ]
  }
}

/*
 * To add new lift to program, gives it a unique ID as a key along with
 * its other descriptors, adds it to the list of lifts so that its progress
 * may be tracked, and also adds its ID to the 'sessions' array which dictates
 * which lift is performed in which session
 */
gzclp.addLiftToProgram = function(tier, exercise, increment, startingWeight, sessions) {
  var newLift = gzclp.createNewLift(tier, exercise, increment, startingWeight);
  var nextLiftId = gzclp.getNextLiftId();

  gzclp.addLift(nextLiftId, newLift);
  gzclp.addLiftToSessions(sessions, nextLiftId);
  gzclp.setNextLiftId(gzclp.getNextLiftId() + 1);
}

/*
 * Given a lift's ID, removes lift from list of lifts and also all
 * references to it in the sessions
 */
gzclp.removeLiftFromProgram = function(id) {
  delete gzclp.getLifts()[id];

  for (var session = 0; session < gzclp.state.sessions.length; session++) {
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
 * Given a lift's ID, weight and rep scheme, creates a workout object associated
 * with that lift and adds it to the array of that lift's previous workouts
 */
gzclp.addWorkout = function(id, weight, repScheme) {
  let workouts = gzclp.state.lifts[id].workouts;
  workouts.push({weight, repScheme});
}

/*
 * Resets all state data to its original default values
 */
gzclp.resetProgramState = function() {
  gzclp.setSessionCounter(0);
  gzclp.setNextLiftId(0);
  gzclp.setLifts({});

  for (var i = 0; i < gzclp.state.sessions.length; i++) {
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

  for (var id in gzclp.state.lifts) {
    let tier = gzclp.getTier(id);
    let exercise = gzclp.getExercise(id);
    let repScheme = gzclp.getCurrentRepScheme(id);
    let repSchemeArray = gzclp.getRepScheme(tier, repScheme);
    let weight = gzclp.getCurrentWeight(id);
    output += (
      tier + ' ' +
      gzclp.getRepScheme(tier, repScheme).length + '×' +
      gzclp.getRepScheme(tier, repScheme)[0] + ' \t' +
      weight + 'kg\t ' +
      exercise +
      '\n'
    );
  }
  return output;
}



/*-------------------- PROGRAM PROGRESSION METHODS --------------------*/

/*
 * After every session, increment the session counter so that the next session
 * is loaded next time
 */
gzclp.incrementSessionCounter = function() {
  gzclp.setSessionCounter((gzclp.getSessionCounter() + 1) % gzclp.state.sessions.length);
}

/*
 * On successful completion of a lift (a workout), continue with same rep scheme
 * but increment the weight
 */
gzclp.handleSuccessfulLift = function(id) {
  let repScheme = gzclp.getCurrentRepScheme(id);
  let newWeight = gzclp.getCurrentWeight(id) + gzclp.getIncrement(id);
  gzclp.addWorkout(id, newWeight, repScheme);
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
gzclp.handleFailedLift = function(id) {
  const tier = gzclp.getTier(id);

  // If failed on last rep scheme of cycle, weight is deloaded. Otherwise, it stays the same
  var newWeight = gzclp.getCurrentWeight(id);
  if (gzclp.getCurrentRepScheme(id) == gzclp.getNumberOfRepSchemes(tier) - 1) {
    if (tier == 'T1') {
      newWeight = roundDownToNearestIncrement(
        gzclp.getCurrentWeight(id) * 0.85, gzclp.MINIMUM_INCREMENT  // TODO: change to constant
      );
    }
    if (tier == 'T2') {
      newWeight = roundDownToNearestIncrement(
        gzclp.getCurrentWeight(id) * 0.85, gzclp.MINIMUM_INCREMENT   // TODO: change to constant
      );
    }
  }

  let newRepScheme = (gzclp.getCurrentRepScheme(id) + 1) % gzclp.getNumberOfRepSchemes(tier);
  gzclp.addWorkout(id, newWeight, newRepScheme);
}



/*-------------------- GETTERS AND SETTERS --------------------*/

gzclp.getNumberOfRepSchemes = function(tier) { return gzclp.REP_SCHEMES[tier].length; }
gzclp.getRepScheme = function(tier, i) { return gzclp.REP_SCHEMES[tier][i]; }

gzclp.getProgramState = function() { return gzclp.state; }
gzclp.setProgramState = function(programState) { gzclp.state = getCopyOfObject(programState); }

gzclp.getLifts = function() { return gzclp.state.lifts; }
gzclp.setLifts = function(obj) { gzclp.state.lifts = obj; }
gzclp.addLift = function(id, lift) { gzclp.state.lifts[id] = lift; }

gzclp.getSession = function(i) { return gzclp.state.sessions[i]; }
gzclp.getSessionName = function(i) { return gzclp.getSession(i).name; }
gzclp.getSessionLifts = function(i) { return gzclp.getSession(i).lifts; }
gzclp.setSessionLifts = function(i, arr) { gzclp.getSession(i).lifts = arr; }
gzclp.addLiftToSession = function(i, id) { gzclp.getSessionLifts(i).push(id); }

gzclp.getSessionCounter = function() { return gzclp.state.sessionCounter; }
gzclp.setSessionCounter = function(num) { gzclp.state.sessionCounter = num; }

gzclp.getNextLiftId = function() { return gzclp.state.nextLiftId; }
gzclp.setNextLiftId = function(num) { gzclp.state.nextLiftId = num; }

gzclp.getTier = function(id) { return gzclp.state.lifts[id].tier; }
gzclp.getExercise = function(id) { return gzclp.state.lifts[id].exercise; }
gzclp.getIncrement = function(id) { return gzclp.state.lifts[id].increment; }
gzclp.getWorkouts = function(id) { return gzclp.state.lifts[id].workouts; }

gzclp.getCurrentWeight = function(id) {
  let workouts = gzclp.getWorkouts(id);
  return workouts[workouts.length - 1].weight;
}
gzclp.getCurrentRepScheme = function(id) {
  let workouts = gzclp.getWorkouts(id);
  return workouts[workouts.length - 1].repScheme;
}

gzclp.setTier = function(id, tier) { gzclp.state.lifts[id].tier = tier; }
gzclp.setExercise = function(id, exercise) { gzclp.state.lifts[id].tier = exercise; }
gzclp.setIncrement = function(id, increment) { gzclp.state.lifts[id].tier = increment; }


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
  }

  static navigationOptions = {
    title: 'GZCLP',
    headerTintColor: '#fff',
    headerStyle: { backgroundColor: primaryColour },
  };

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
      }
    } catch (error) {
      console.log("Error retrieving data");
    }
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

    return (
      <View>
        <NextSessionButton navigate={navigate} onGoBack={() => refresh(this)} />

        <ProgramState />

        <Button
          title='Reset All Progress'
          color='#777'
          onPress={() => this.handleResetButtonPress()}
        />
      </View>
    );
  }
}



class NextSessionButton extends React.Component {
  constructor(props) {
    super(props);
  }

  handlePress() {
    const { navigate, onGoBack } = this.props;

    navigate('Session', {
      session: gzclp.getSession( gzclp.getSessionCounter() ),
      onGoBack: () => onGoBack()
    });
  }

  render() {
    // lifts is an array where each element is a lift's ID
    var sessionLifts = gzclp.getSessionLifts( gzclp.getSessionCounter() );
    // Populate arrays of data to display in the Next Session component
    var tiers = [];
    var labels = [];
    var weights = [];
    var repSchemes = [];

    sessionLifts.forEach( (id, index) => {
      let tier = gzclp.getTier(id);
      let exercise = gzclp.getExercise(id);

      tiers.push(
        <Text key={index}>
          {tier}
        </Text>
      );
      labels.push(
        <Text key={index}>
          {gzclp.getExercise(id)}
        </Text>
      );
      weights.push(
        <Text key={index}>
          {gzclp.getCurrentWeight(id)} kg
        </Text>
      );
      repSchemes.push(
        <Text key={index}>
          {gzclp.REP_SCHEMES[ tier ][ gzclp.getCurrentRepScheme(id) ].length}×
          {gzclp.REP_SCHEMES[ tier ][ gzclp.getCurrentRepScheme(id) ][0]}
        </Text>
      );
    });

    return (
      <TouchableOpacity
        style={styles.nextSessionContainer}
        activeOpacity={0.8}
        // Navigate to session screen and pass as two parameters the required session
        // and the callback function that will refresh the home screen when session is finished
        onPress={() => this.handlePress()}
      >
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Text style={styles.nextSessionTitle}>
              {'Next Session: ' + gzclp.getSessionName( gzclp.getSessionCounter() )}
            </Text>

            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
    this.state = {};
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Session ' + navigation.state.params.session.label,
    headerTintColor: '#fff',
    headerStyle: { backgroundColor: primaryColour },
  });

  async handleDoneButtonPress() {
    const { goBack } = this.props.navigation;
    const { params } = this.props.navigation.state;

    // lifts parameter is an array where each element is a lift's ID
    const lifts = params.session.lifts;

    // If all sets of a lift complete, clicking "Done" button increments that lift for next time
    // If not, the lift moves onto its next rep scheme for next time
    lifts.forEach(id => {
      let tier = gzclp.getTier(id);
      let exercise = gzclp.getExercise(id);

      if (this.state[ exercise ]) {
        gzclp.handleSuccessfulLift(id);
      } else {
        gzclp.handleFailedLift(id);
      }
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

    // lifts parameter is in the form of an array where each element is a 2-element array
    // that specifies each lifts Tier (first element) and Exercise (second element)
    const lifts = params.session.lifts;

    // Populate an array of Lift components to display in this SessionScreen component
    var liftComponents = [];
    lifts.forEach( (id, index) => {
      let tier = gzclp.getTier(id);
      let exercise = gzclp.getExercise(id);
      let repScheme = gzclp.getCurrentRepScheme(id);
      let weight = gzclp.getCurrentWeight(id);

      liftComponents.push(
        <Lift key={index} tier={tier} exercise={exercise}
          repScheme={repScheme} weight={weight}
          // Test for whether all sets are complete
          setLiftComplete={(isComplete) => {this.setState({[ exercise ]:isComplete})}}
        />
      )
    });

    return (
      <View>
        <ScrollView>
          {liftComponents}
        </ScrollView>

        <Button
          title='Done'
          color={primaryColour}
          onPress={() => this.handleDoneButtonPress()}
        />
    </View>
    );
  }
}



class Lift extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastClickedButton: 0,
      isTimerVisible: false,
    };
  }

  // If last set button is clicked, pass this to parent so it knows
  // all sets are complete and lift was successful
  areAllSetButtonsClicked(id, sets) {
    return (id == sets)
  }

  // Display timer for this lift and pass it the corresponding tier as a prop,
  // so it knows how long to tell user to rest
  renderTimer(tier) {
    if (this.state.isTimerVisible) {
      return (<Timer tier={tier} />)
    }
  }

  render() {
    var { tier, repScheme, exercise, weight } = this.props;   // TODO: are these needed, surely only id is

    let repSchemeArray = gzclp.getRepScheme(tier, repScheme);
    let numberOfSets = repSchemeArray.length;

    // Populate an array of SetButtons to display
    var setButtons = [];
    for (var i = 1; i <= numberOfSets; i++) {
      setButtons.push(
        <SetButton key={i} id={i} reps={repSchemeArray[i - 1]}
          // Keep track of whether each button is in inactive/active/clicked state
          isActive={i <= this.state.lastClickedButton + 1}
          isClicked={i <= this.state.lastClickedButton}
          // Keep track of which button was last clicked, so buttons can only be clicked in order
          setLastClickedButton={(lastClickedButton) => {
            this.setState({lastClickedButton})
          }}
          // When all sets are complete (ie. all buttons are clicked), set whole
          // lift to be complete in parent 'Session' component
          setLiftComplete={(id) => {
            this.props.setLiftComplete( this.areAllSetButtonsClicked(id, numberOfSets) );
          }}

          // If activating timer, disable it first to force it to restart after each set
          // Also check if set is last one, as no need for timer after that
          activateTimer={(isTimerVisible, id) => {
            this.setState({isTimerVisible: false}, () => {
              //if (!this.areAllSetButtonsClicked(i, numberOfSets)) {  //NOTE need to check again why this doesnt work
              if (!this.areAllSetButtonsClicked(id, numberOfSets)) {
                this.setState({isTimerVisible})
              }
            }
          )}}
        />
      );
    }

    return (
      <View style={styles.liftContainer}>
        <View style={styles.liftInfoContainer}>
          <LiftInfo tier={tier} exercise={exercise} weight={weight} sets={numberOfSets} reps={repSchemeArray[0]} />
        </View>

        <View style={styles.setButtonContainer}>
          {setButtons}
        </View>

        {this.renderTimer(tier)}
      </View>
    );
  }
}



const LiftInfo = props => {
    var {
      tier,
      exercise,
      weight,
      sets,
      reps
    } = props;

    return (
      <View>
        <Text style={styles.liftName}>
          {tier} {exercise}
        </Text>
        <Text style={styles.liftDetails}>
          {weight} kg   {sets}×{reps}
        </Text>
      </View>
    )
}



const SetButton = props => {
  var {
    reps,
    isClicked,
    isActive,
    setLastClickedButton,
    setLiftComplete,
    activateTimer,
    id
  } = props;

  // If button is clicked, display a tick. Otherwise display number of reps.
  // And if set is an AMRAP set, display a '+' sign next the rep number
  var buttonText = isClicked ? '✓' : reps;

  // Apply style depending on whether button is inactive, active or clicked
  var currentStyle, currentTextStyle;
  if (isClicked) {
    currentStyle = styles.setButtonClicked;
    currentTextStyle = styles.setButtonTextClicked;
  } else if (isActive) {
    currentStyle = styles.setButtonActive;
    currentTextStyle = styles.setButtonTextActive;
  } else {
    currentStyle = styles.setButtonInactive;
    currentTextStyle = styles.setButtonTextInactive;
  }

  function handlePress() {
    // If button is clicked, and hasn't already been clicked,
    // set to "clicked" state. If it has been, undo its "clicked" state
    // and make the button to the immediate left of it the last "clicked" button
    if (isActive) {
      let lastClickedButton = isClicked ? id - 1 : id;
      setLastClickedButton(lastClickedButton);
      setLiftComplete(lastClickedButton);
      activateTimer(isClicked ? false : true, lastClickedButton);
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={currentStyle}
      onPress={() => handlePress()}
    >
      <Text style={currentTextStyle}>
        {buttonText}
      </Text>
    </TouchableOpacity>
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
    var time = '';

    if (tier == 'T1') {
      time = '3-5';
    }
    if (tier == 'T2') {
      time = '2-3';
    }
    if (tier == 'T3') {
      time = '1-2';
    }

    return (
      <View ref='myRef' style={styles.timerContainer}>
        <Text style={styles.timerNumbers}>{this.convertToMinutesAndSeconds(this.state.timeElapsed)}</Text>
        <Text style={styles.timerText}>Rest for {time} minutes</Text>
      </View>
    )
  }
}



/*-------------------- REACT NAVIGATION NAVIGATOR --------------------*/

const App = StackNavigator({
  Home: {screen: HomeScreen},
  Session: {screen: SessionScreen}
});
export default App;
