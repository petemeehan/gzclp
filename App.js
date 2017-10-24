

import React from 'react';
import {
  Text,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import styles from './styles';

const primaryColour = '#fa375a';

const SESSIONS = [
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

const REP_SCHEMES = {
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

const MINIMUM_INCREMENT_STEP = 2.5;
const INITIAL_PROGRAM_STATE = {
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
// Global variable to store current state of program
var programState = getCopyOfObject(INITIAL_PROGRAM_STATE);



class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
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
      storedProgramState = await AsyncStorage.getItem('programState', () => console.log("Program state data retrieved"));
      if (storedProgramState !== null) {
        programState = JSON.parse(storedProgramState);
        refresh(this);
      }
    } catch (error) {
      console.log("Error retrieving data");
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
          onPress={async () => {
            // Remove stored data and reset program state to initial values
            try {
              await AsyncStorage.removeItem('programState', () => console.log("Data removed"));
              programState = getCopyOfObject(INITIAL_PROGRAM_STATE);
              refresh(this);
            } catch (error) {
              console.log("Error removing data");
            }
          }}
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
      session: SESSIONS[programState.sessionCounter],
      onGoBack: () => onGoBack()
    });
  }

  render() {
    // lifts is an array where each element is a 2-element array
    // that specifies each lifts Tier (first element) and Exercise (second element)
    var lifts = SESSIONS[programState.sessionCounter].lifts;
    // Populate arrays of data to display in the Next Session component
    var tiers = [];
    var labels = [];
    var weights = [];
    var repSchemes = [];
    lifts.forEach((lift, index) => {
      let liftData = programState[ lift[0] ][ lift[1] ];

      tiers.push(
        <Text key={index}>
          {lift[0]}
        </Text>
      );
      labels.push(
        <Text key={index}>
          {liftData['label']}
        </Text>
      );
      weights.push(
        <Text key={index}>
          {liftData['weight']} kg
        </Text>
      );
      repSchemes.push(
        <Text key={index}>
          {REP_SCHEMES[ lift[0] ][ liftData['repScheme'] ].length}×
          {REP_SCHEMES[ lift[0] ][ liftData['repScheme'] ][0]}
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
            <Text style={styles.nextSessionTitle}>{'Next Session: ' + SESSIONS[programState.sessionCounter].label}</Text>

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
    var output = '';

    for (var tier in programState) {
      for (var exercise in programState[tier]) {
        var lift = programState[tier][exercise];
        output += (
          tier + ' ' +
          REP_SCHEMES[tier][lift.repScheme].length + '×' +
          REP_SCHEMES[tier][lift.repScheme][0] + ' \t' +
          lift.weight + 'kg\t ' +
          lift.label +
          '\n'
        );
      }
    }

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
      let todaysLift = programState[ lift[0] ][ lift[1] ];

      if (this.state[ lift[1] ]) {
        todaysLift.weight += todaysLift.increment;
      } else {
        // On failure, cycle through rep schemes based on whether lift is T1/T2/T3
        // (There are three for T1, three for T2, one for T3)
        // On failing last rep scheme, strategy varies depending on tier:
        // T1: restart new cycle on first repscheme with 85% of last weight attempted
        // T2: restart new cycle on first repscheme with weight 5kg heavier than what was last lifted on first repscheme
        // T3: no change
        if (todaysLift.repScheme == REP_SCHEMES[lift[0]].length - 1) {
          if (lift[0] == 'T1') {
            todaysLift.weight = roundDownToNearestIncrement(todaysLift.weight * 0.85, MINIMUM_INCREMENT_STEP);
          }
          if (lift[0] == 'T2') {
            todaysLift.weight = roundDownToNearestIncrement(todaysLift.weight * 0.85, MINIMUM_INCREMENT_STEP);
          }
        }
        todaysLift.repScheme = (todaysLift.repScheme + 1) % REP_SCHEMES[lift[0]].length;
      }
    });

    // Increment the session counter so sessions are cycled from A1 to B2
    // and back to A1 and so on
    programState.sessionCounter = (programState.sessionCounter + 1) % SESSIONS.length;

    // Store current state of the app
    try {
      await AsyncStorage.setItem('programState', JSON.stringify(programState), () => console.log("Program state data saved"));
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
      liftComponents.push(
        <Lift key={index} tier={lift[0]} exercise={lift[1]}
          repScheme={programState[ lift[0] ][ lift[1] ].repScheme}
          // Test for whether all sets are complete
          setLiftComplete={(isComplete) => {this.setState({[ lift[1] ]:isComplete})}}
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

  renderTimer() {
    if (this.state.isTimerVisible) {
      return (<Timer />)
    }
  }

  render() {
    var { tier, repScheme, exercise } = this.props;

    var numberOfSets = REP_SCHEMES[tier][repScheme].length;
    var repsArray = REP_SCHEMES[tier][repScheme];

    var weight = programState[tier][exercise].weight;

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

        {this.renderTimer()}
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
          {tier} {programState[tier][exercise].label}
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
    return (
      <View ref='myRef' style={styles.timerContainer}>
        <Text style={styles.timerText}>{this.convertToMinutesAndSeconds(this.state.timeElapsed)}</Text>
      </View>
    )
  }
}


// Main route of app
export default StackNavigator({
  Home: {screen: HomeScreen},
  Session: {screen: SessionScreen}
});



/*---------------HELPER FUNCTIONS---------------*/

function refresh(component) {
  component.setState({});
}

function getCopyOfObject( obj ) {
  return JSON.parse(JSON.stringify(obj));
}

function roundDownToNearestIncrement( number, increment ) {
  return Math.floor(number * (1/increment)) / (1/increment);
}
