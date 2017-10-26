

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
var program = {};

/*-------------------- PROGRAM PROPERTIES --------------------*/

// To store current state of all the lifts in the program
program.state = {};

// Depends on the equipment user has access to. 2.5kg is usually smallest possible increment
program.MINIMUM_INCREMENT = 2.5;

program.REP_SCHEMES = {
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

program.SESSIONS = [
  {
    label: 'A1',
    lifts: [
      ['T1', 'squat'],
      ['T2', 'bench'],
      ['T3', 'latPulldown'],
    ],
  }, {
    label: 'B1',
    lifts: [
      ['T1', 'ohp'],
      ['T2', 'deadlift'],
      ['T3', 'dbRow'],
    ],
  }, {
    label: 'A2',
    lifts: [
      ['T1', 'bench'],
      ['T2', 'squat'],
      ['T3', 'latPulldown'],
    ],
  }, {
    label: 'B2',
    lifts: [
      ['T1', 'deadlift'],
      ['T2', 'ohp'],
      ['T3', 'dbRow'],
    ],
  }
]

program.INITIAL_PROGRAM_STATE = {
  sessionCounter: 0,
  T1: {
    squat: {
      label: 'Squat',
      weight: 50,
      repScheme: 0,
      increment: 5,
    },
    deadlift: {
      label: 'Deadlift',
      weight: 60,
      repScheme: 0,
      increment: 5,
    },
    bench: {
      label: 'Bench Press',
      weight: 40,
      repScheme: 0,
      increment: 2.5,
    },
    ohp: {
      label: 'Overhead Press',
      weight: 30,
      repScheme: 0,
      increment: 2.5,
    },
  },
  T2: {
    squat: {
      label: 'Squat',
      weight: 40,
      repScheme: 0,
      increment: 2.5,
    },
    deadlift: {
      label: 'Deadlift',
      weight: 50,
      repScheme: 0,
      increment: 2.5,
    },
    bench: {
      label: 'Bench Press',
      weight: 30,
      repScheme: 0,
      increment: 2.5,
    },
    ohp: {
      label: 'Overhead Press',
      weight: 20,
      repScheme: 0,
      increment: 2.5,
    },
  },
  T3: {
    latPulldown: {
      label: 'Lat Pulldown',
      weight: 20,
      repScheme: 0,
      increment: 10,
    },
    dbRow: {
      label: 'Dumbbell Row',
      weight: 10,
      repScheme: 0,
      increment: 4,
    },
  },
}

/*-------------------- GETTERS AND SETTERS --------------------*/

program.getProgramState = function() { return program.state; }
program.setProgramState = function(programState) { program.state = getCopyOfObject(programState); }

program.getSessionCounter = function() { return program.state.sessionCounter; }
program.setSessionCounter = function(num) { program.state.sessionCounter = num; }

program.getLabel = function(tier, exercise) { return program.state[tier][exercise].label; }
program.getWeight = function(tier, exercise) { return program.state[tier][exercise].weight; }
program.getRepScheme = function(tier, exercise) { return program.state[tier][exercise].repScheme; }
program.getIncrement = function(tier, exercise) { return program.state[tier][exercise].increment; }

program.setLabel = function(tier, exercise, label) { program.state[tier][exercise].label = label; }
program.setWeight = function(tier, exercise, weight) { program.state[tier][exercise].weight = weight; }
program.setRepScheme = function(tier, exercise, repScheme) { program.state[tier][exercise].repScheme = repScheme; }
program.setIncrement = function(tier, exercise, increment) { program.state[tier][exercise].increment = increment; }

program.getProgramStateAsString = function() {
  var output = '';

  for (var tier in program.state) {
    for (var exercise in program.state[tier]) {
      var lift = program.state[tier][exercise];
      output += (
        tier + ' ' +
        program.REP_SCHEMES[tier][lift.repScheme].length + '×' +
        program.REP_SCHEMES[tier][lift.repScheme][0] + ' \t' +
        lift.weight + 'kg\t ' +
        lift.label +
        '\n'
      );
    }
  }
  return output;
}



/*-------------------- PROGRAM METHODS --------------------*/

program.addLift = function(tier, exercise, label, weight, repScheme, increment) {
  program.state[tier] = {};
  program.state[tier][exercise] = {label, weight, repScheme, increment};
}

program.removeLift = function(tier, exercise) {
  delete program.state[tier][exercise];
}

program.resetProgramState = function() {
  program.setProgramState(program.INITIAL_PROGRAM_STATE);
}

program.saveProgramState = async function() {
  await AsyncStorage.setItem(
    'programState',
    JSON.stringify(program.state),
    () => console.log("Program state data saved")
  )
}

program.loadProgramState = async function() {
  var programStateString = await AsyncStorage.getItem(
    'programState',
    () => console.log("Program state data loaded")
  );
  return JSON.parse(programStateString)
}

program.deleteSavedProgramState = async function() {
  await AsyncStorage.removeItem('programState', () => console.log("Program state data deleted"))
}



/*-------------------- PROGRAM PROGRESSION METHODS --------------------*/

program.incrementSessionCounter = function() {
  program.setSessionCounter((program.getSessionCounter() + 1) % program.SESSIONS.length);
}

program.handleSuccessfulLift = function(tier, exercise) {
  let newWeight = program.getWeight(tier, exercise) + program.getIncrement(tier, exercise);
  program.setWeight(tier, exercise, newWeight);
}
program.handleFailedLift = function(tier, exercise) {
  // On failure, cycle through rep schemes based on whether lift is T1/T2/T3
  // (There are three for T1, three for T2, one for T3)
  // On failing last rep scheme, strategy varies depending on tier:
  // T1: restart new cycle on first repscheme with 85% of last weight attempted
  // T2: restart new cycle on first repscheme with weight 5kg heavier than what was last lifted on first repscheme
  // (TODO: this is currently implemented same as for T1, as previous sessions are not yet recorded)
  // T3: no change
  if (program.getRepScheme(tier, exercise) == program.REP_SCHEMES[tier].length - 1) {  // Check if we're on last rep scheme in cycle
    if (tier == 'T1') {
      let newWeight = roundDownToNearestIncrement(
        program.getWeight(tier, exercise) * 0.85, program.MINIMUM_INCREMENT
      );
      program.setWeight(tier, exercise, newWeight);
    }
    if (tier == 'T2') {
      let newWeight = roundDownToNearestIncrement(
        program.getWeight(tier, exercise) * 0.85, program.MINIMUM_INCREMENT
      );
      program.setWeight(tier, exercise, newWeight);
    }
  }
  let newRepScheme = (program.getRepScheme(tier, exercise) + 1) % program.REP_SCHEMES[tier].length;
  program.setRepScheme(tier, exercise, newRepScheme);
}



/*-------------------- APP COMPONENTS --------------------*/

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    // Initialise program state with default values
    program.resetProgramState();
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
      storedProgramState = await program.loadProgramState();
      if (storedProgramState !== null) {
        program.setProgramState(storedProgramState);
        refresh(this);
      }
    } catch (error) {
      console.log("Error retrieving data");
    }
  }

  // Remove stored data and reset program state to initial values
  async handleResetButtonPress() {
    try {
      await program.deleteSavedProgramState();
      program.resetProgramState();
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
      session: program.SESSIONS[program.getSessionCounter()],
      onGoBack: () => onGoBack()
    });
  }

  render() {
    // lifts is an array where each element is a 2-element array
    // that specifies each lifts Tier (first element) and Exercise (second element)
    var lifts = program.SESSIONS[program.getSessionCounter()].lifts;
    // Populate arrays of data to display in the Next Session component
    var tiers = [];
    var labels = [];
    var weights = [];
    var repSchemes = [];

    lifts.forEach((lift, index) => {
      let tier = lift[0];
      let exercise = lift[1];

      tiers.push(
        <Text key={index}>
          {tier}
        </Text>
      );
      labels.push(
        <Text key={index}>
          {program.getLabel(tier, exercise)}
        </Text>
      );
      weights.push(
        <Text key={index}>
          {program.getWeight(tier, exercise)} kg
        </Text>
      );
      repSchemes.push(
        <Text key={index}>
          {program.REP_SCHEMES[ tier ][ program.getRepScheme(tier, exercise) ].length}×
          {program.REP_SCHEMES[ tier ][ program.getRepScheme(tier, exercise) ][0]}
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
            <Text style={styles.nextSessionTitle}>{'Next Session: ' + program.SESSIONS[program.getSessionCounter()].label}</Text>

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
    var output = program.getProgramStateAsString();

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

    // lifts parameter is in the form of an array where each element is a 2-element array
    // that specifies each lifts Tier (first element) and Exercise (second element)
    const lifts = params.session.lifts;

    // If all sets of a lift complete, clicking "Done" button increments that lift for next time
    // If not, the lift moves onto its next rep scheme for next time
    lifts.forEach((lift) => {
      let tier = lift[0];
      let exercise = lift[1];

      if (this.state[ exercise ]) {
        program.handleSuccessfulLift(tier, exercise);
      } else {
        program.handleFailedLift(tier, exercise);
      }
    });

    // Increment the session counter so sessions are cycled from A1 to B2
    // and back to A1 and so on
    program.incrementSessionCounter();

    // Store current state of the app
    try {
      program.saveProgramState();
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
    lifts.forEach((lift, index) => {
      let tier = lift[0];
      let exercise = lift[1];

      liftComponents.push(
        <Lift key={index} tier={tier} exercise={exercise}
          repScheme={program.getRepScheme(tier, exercise)}
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
    var { tier, repScheme, exercise } = this.props;

    var weight = program.getWeight(tier, exercise);

    let repsArray = program.REP_SCHEMES[tier][repScheme];
    let numberOfSets = repsArray.length;

    // Populate an array of SetButtons to display
    var setButtons = [];
    for (var i = 1; i <= numberOfSets; i++) {
      setButtons.push(
        <SetButton key={i} id={i} reps={repsArray[i - 1]}
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
          <LiftInfo tier={tier} exercise={exercise} weight={weight} sets={numberOfSets} reps={repsArray[0]} />
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
          {tier} {program.getLabel(tier, exercise)}
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



/*-------------------- HELPER FUNCTIONS --------------------*/

function refresh(component) {
  component.setState({});
}

function getCopyOfObject( obj ) {
  return JSON.parse(JSON.stringify(obj));
}

function roundDownToNearestIncrement( number, increment ) {
  return Math.floor(number * (1/increment)) / (1/increment);
}
