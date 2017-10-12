import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
  AsyncStorage
} from 'react-native';
import { StackNavigator } from 'react-navigation';

const appColour = '#fa375a';
const DEVICE_W = Dimensions.get('window').width;
const DEVICE_H = Dimensions.get('window').height;

StatusBar.setBarStyle('light-content');

const SESSIONS = [
  {
    name: 'A1',
    lifts: [
      ['T1', 'squat'],
      ['T2', 'bench'],
      ['T3', 'latPulldown'],
    ],
  }, {
    name: 'B1',
    lifts: [
      ['T1', 'ohp'],
      ['T2', 'deadlift'],
      ['T3', 'dbRow'],
    ],
  }, {
    name: 'A2',
    lifts: [
      ['T1', 'bench'],
      ['T2', 'squat'],
      ['T3', 'latPulldown'],
    ],
  }, {
    name: 'B2',
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



// NOTE: THIS DATA STRUCSH WILL BE REFACTORED AS A CLASS LATER
const INITIAL_SESSION_COUNTER = 0;
const INITIAL_PROGRAM_STATE = {
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
var sessionCounter = INITIAL_SESSION_COUNTER;
var programState = INITIAL_PROGRAM_STATE;



class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isFirstSession: true };
  }

  static navigationOptions = {
    title: 'GZCLP',
    headerTintColor: '#fff',
    headerStyle: { backgroundColor: appColour },
  };

  async componentDidMount() {
    // Overwrite initial default program state values with stored ones, if they exist
    try {
      const storedSessionCounter = await AsyncStorage.getItem('sessionCounter', () => console.log("Session counter data retrieved"));
      const storedProgramState = await AsyncStorage.getItem('programState', () => console.log("Program state data retrieved"));

      if (storedSessionCounter !== null) {
        sessionCounter = JSON.parse(storedSessionCounter);
        this.setState({isFirstSession: false});
        console.log("Last session: " + sessionCounter);
      }
      if (storedProgramState !== null) {
        programState = JSON.parse(storedProgramState);
      }
    } catch (error) {
      console.log("Error retrieving data");
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View>
        <Button
          title={this.state.isFirstSession ? 'Proceed to First Session': "Continue Last Session"}
          color={appColour}
          onPress={() => {
            navigate('Session', SESSIONS[sessionCounter]);
          }}
        />
        <Button
          title='Reset All Progress'
          color='#777'
          onPress={async () => {
            // Remove stored data and rest program state to initial values
            try {
              await AsyncStorage.multiRemove(['sessionCounter','programState'], () => console.log("Data removed"));
              sessionCounter = INITIAL_SESSION_COUNTER;
              programState = INITIAL_PROGRAM_STATE;
              this.setState({isFirstSession: true});
              console.log("Last session: " + sessionCounter);
            } catch (error) {
              console.log("Error removing data");
            }
          }}
        />
      </View>
    );
  }
}



class SessionScreen extends React.Component {
  constructor(props) {
    super(props);
    // Session state used to keep track of which lifts are complete
    this.state = {};
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Session ' + navigation.state.params.name,
    headerTintColor: '#fff',
    headerStyle: { backgroundColor: appColour }
  });

  render() {
    const { navigate } = this.props.navigation;
    const { params } = this.props.navigation.state;

    // lifts prop is in the form of an array where each element is a 2-element array
    // that specifies each lifts Tier (first element) and Exercise (second element)
    var lifts = params.lifts;

    // Populate an array of Lift components to display, with the props passed to
    // this Session component
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
      <View style={styles.container}>
        <ScrollView>
          {liftComponents}
        </ScrollView>

        <Button
          title='Done'
          color={appColour}
          onPress={async () => {
            this.setState({});  // Uncomment if testing without navigating as this forces rerender

            // If all sets of a lift complete, clicking "Done" button increments that lift for next time
            // If not, the lift moves onto its next rep scheme for next time
            lifts.forEach((lift) => {
              let todaysLift = programState[ lift[0] ][ lift[1] ];

              if (this.state[ lift[1] ]) {
                todaysLift.weight += todaysLift.increment;
              } else {
                // Cycle through rep schemes based on whether lift is T1/T2/T3
                // (There are three each for T1 and T2, one for T3)
                todaysLift.repScheme = (todaysLift.repScheme + 1) % REP_SCHEMES[lift[0]].length;
              }
            });

            // Increment the session counter so sessions are cycled from A1 to B2
            // and back to A1 and so on
            sessionCounter = (sessionCounter + 1) % SESSIONS.length;

            navigate('Session', SESSIONS[sessionCounter]);

            // Store current state of the app
            try {
              await AsyncStorage.setItem('sessionCounter', JSON.stringify(sessionCounter), () => console.log("Session counter data saved"));
              await AsyncStorage.setItem('programState', JSON.stringify(programState), () => console.log("Program state data saved"));
            } catch (error) {
              console.log("Error saving data")
            }
          }}
        />
    </View>
    );
  }
}



class Lift extends React.Component {
  constructor(props) {
    super(props);
    this.state = { lastClickedButton: 0 };
  }

  // If last set button is clicked, pass this to parent so it knows
  // all sets are complete and lift was successful
  isLastButtonClicked(id, sets) {
    return (id == sets)
  }

  render() {
    var tier = this.props.tier,
        repScheme = this.props.repScheme,
        exercise = this.props.exercise;

    var numberOfSets = REP_SCHEMES[tier][repScheme].length,
        repsArray = REP_SCHEMES[tier][repScheme];

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
            this.props.setLiftComplete( this.isLastButtonClicked(id, numberOfSets) );
          }}
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
      </View>
    );
  }
}



class LiftInfo extends React.Component {
  render() {
    var tier = this.props.tier,
        exercise = this.props.exercise,
        weight = this.props.weight,
        sets = this.props.sets,
        reps = this.props.reps;

    return (
      <View>
        <Text style={styles.liftName}>
          {tier} {programState[tier][exercise].label}
        </Text>
        <Text style={styles.liftDetails}>
          {weight}kg   {sets} × {reps}
        </Text>
    </View>
    )
  }
}



class SetButton extends React.Component {
  render() {
    var reps = this.props.reps,
        isClicked = this.props.isClicked,
        isActive = this.props.isActive,
        setLastClickedButton = this.props.setLastClickedButton,
        setLiftComplete = this.props.setLiftComplete,
        id = this.props.id;

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

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={currentStyle}
        onPress={() => {
          // If button is clicked, and hasn't already been clicked,
          // set to "clicked" state. If it has been, undo its "clicked" state
          // and make the button to the left of it the last "clicked" button
          if (isActive) {
            let lastClickedButton = isClicked ? id - 1 : id;
            setLastClickedButton(lastClickedButton);
            setLiftComplete(lastClickedButton);
          }
        }}
      >
        <Text style={currentTextStyle}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    )
  }
}



const App = StackNavigator({
  Home: {screen: HomeScreen},
  Session: {screen: SessionScreen}
});
export default App;



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  liftContainer: {
    backgroundColor: '#fff',
    marginBottom: 3,
  },
  liftInfoContainer: {
    marginHorizontal: (0.03125+0.015625) * DEVICE_W,
    marginTop: 5 + 0.015625 * DEVICE_W,
    marginBottom: 5,
  },
  liftName: {
    fontSize: 16,
  },
  liftDetails: {
    marginVertical: 5,
  },
  setButtonContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    marginHorizontal: 0.03125 * DEVICE_W,
    flexWrap: 'wrap',
  },
  setButtonActive: {
    borderColor: appColour,
    borderWidth: 1.5,
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setButtonInactive: {
    backgroundColor: '#eee',
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setButtonClicked: {
    backgroundColor: appColour,
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setButtonTextActive: {
    color: appColour,
  },
  setButtonTextInactive: {
    color: '#777'
  },
  setButtonTextClicked: {
    color: '#fff',
  }
});



function getCopyOfObject( origObj ) {
  var newObj = {};
  for (var key in origObj) newObj[key] = origObj[key];
  return newObj;
}
