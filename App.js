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
} from 'react-native';
import { StackNavigator } from 'react-navigation';


const DEVICE_W = Dimensions.get('window').width;
const DEVICE_H = Dimensions.get('window').height;

const REP_SCHEMES = {
  T1: {
    1: [3,3,3,3,3],
    2: [2,2,2,2,2,2],
    3: [1,1,1,1,1,1,1,1,1,1],
    isAmrap: true,
  },
  T2: {
    1: [10,10,10],
    2: [8,8,8],
    3: [6,6,6],
    isAmrap: false,
  },
  T3: {
    1: [15,15,25],
    isAmrap: false,
  },
}

var currentProgramState = {
  T1: {
    squat: {
      label: 'Squat',
      weight: 50,
      repScheme: 1,
      increment: 5,
    },
    deadlift: {
      label: 'Deadlift',
      weight: 60,
      repScheme: 1,
      increment: 5,
    },
    bench: {
      label: 'Bench Press',
      weight: 40,
      repScheme: 1,
      increment: 2.5,
    },
    ohp: {
      label: 'Overhead Press',
      weight: 30,
      repScheme: 1,
      increment: 2.5,
    },
  },
  T2: {
    squat: {
      label: 'Squat',
      weight: 40,
      repScheme: 1,
      increment: 2.5,
    },
    deadlift: {
      label: 'Deadlift',
      weight: 50,
      repScheme: 1,
      increment: 2.5,
    },
    bench: {
      label: 'Bench Press',
      weight: 30,
      repScheme: 1,
      increment: 2.5,
    },
    ohp: {
      label: 'Overhead Press',
      weight: 20,
      repScheme: 1,
      increment: 2.5,
    },
  },
  T3: {
    latPulldown: {
      label: 'Lat Pulldown',
      weight: 20,
      repScheme: 1,
      increment: 10,
    },
    dbRow: {
      label: 'Dumbbell Row',
      weight: 10,
      repScheme: 1,
      increment: 4,
    },
  },
}


class Lift extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastClickedButton: 0,
    };
  }

  componentDidUpdate() {
    //console.log(this.state);
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

    var sets = REP_SCHEMES[tier][repScheme].length,
        reps = REP_SCHEMES[tier][repScheme],
        isAmrap = REP_SCHEMES[tier].isAmrap;

    var weight = currentProgramState[tier][exercise].weight;


    // Populate an array of SetButtons to display, and if the rep scheme calls for
    // AMRAP final set, pass the isAmrap prop with TRUE value for the last set button
    var setButtons = [];
    for (var i = 1; i <= sets; i++) {
      setButtons.push(
        <SetButton key={i} id={i} reps={reps[i - 1]} isAmrap={i == sets ? isAmrap : false}
          // Keep track of whether each button is in inactive/active/clicked state
          isActive={i <= this.state.lastClickedButton + 1}
          isClicked={i <= this.state.lastClickedButton}
          // Keep track of which button was last clicked, so buttons can only be clicked in order
          setLastClickedButton={(lastClickedButton) => {
            this.setState({lastClickedButton})
          }}
          // When all sets are complete (ie. all buttons are clicked), set whole
          // lift to be complete in parent 'Workout' component
          setLiftComplete={(id) => {
            this.props.setLiftComplete( this.isLastButtonClicked(id, sets) );
          }}
        />
      );
    }

    return (
      <View style={styles.liftContainer}>
        <View style={styles.liftInfoContainer}>
          <LiftInfo tier={tier} exercise={exercise} weight={weight} sets={sets} reps={reps[0]} isAmrap={isAmrap}  />
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
        reps = this.props.reps,
        isAmrap = this.props.isAmrap;

    return (
      <View>
        <Text style={styles.liftName}>
          {tier} {currentProgramState[tier][exercise].label}
        </Text>
        <Text style={styles.liftDetails}>
          {weight}kg  {sets} x {reps}{isAmrap ? '+' : ''}
        </Text>
    </View>
    )
  }
}


class SetButton extends React.Component {
  render() {
    var reps = this.props.reps,
        isAmrap = this.props.isAmrap,
        isClicked = this.props.isClicked,
        isActive = this.props.isActive,
        setLastClickedButton = this.props.setLastClickedButton,
        setLiftComplete = this.props.setLiftComplete,
        id = this.props.id;

    // If button is clicked, display a tick. Otherwise display number of reps.
    // And if set is an AMRAP set, display a '+' sign next the rep number
    var buttonText = isClicked ? '✓' : reps + (isAmrap ? '+' : '');

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


class Workout extends React.Component {
  constructor(props) {
    super(props);
    // Workout state used to keep track of which lifts are complete
    this.state = {};
  }

  render() {
    const {navigate} = this.props.navigation;

    // lifts prop is in the form of an array where each element is a 2-element array
    // that specifies each lifts Tier (first element) and Exercise (second element)
    var lifts = this.props.lifts;
    var nextSession = this.props.nextSession;

    // Populate an array of Lift components to display, with the props passed to
    // this Workout component
    var liftComponents = [];
    lifts.forEach((lift, index) => {
      liftComponents.push(
        <Lift key={index} tier={lift[0]} exercise={lift[1]}
          repScheme={currentProgramState[ lift[0] ][ lift[1] ].repScheme}
          // Test for whether all sets are complete
          setLiftComplete={(isComplete) => {this.setState({[ lift[1] ]:isComplete})}}
        />
      )
    });

    return (
      <ScrollView style={styles.container}>
        {liftComponents}

        <Button
          title="Done"
          onPress={() => {
            //this.setState({});  // Uncomment if testing without navigating as this forces rerender

            // If a lift is complete, clicking "Done" button increments that lift for next time
            lifts.forEach((lift) => {
              if (this.state[ lift[1] ]) {
                let todaysLift = currentProgramState[ lift[0] ][ lift[1] ];
                todaysLift.weight += todaysLift.increment;
              }
            });

            navigate(nextSession);
          }}
        />
      </ScrollView>
    );
  }
}


const App = StackNavigator({
  A1: {
    screen: props => <Workout {...props} {...{
      lifts:[
        ['T1', 'squat'],
        ['T2', 'bench'],
        ['T3', 'latPulldown']
      ],
      nextSession: 'B1'
    }} />,
    navigationOptions: {title: "Workout A1"}
  },

  B1: {
    screen: props => <Workout {...props} {...{
      lifts:[
        ['T1', 'ohp'],
        ['T2', 'deadlift'],
        ['T3', 'dbRow']
      ],
      nextSession: 'A2',
    }} />,
    navigationOptions: {title: "Workout B1"}
  },

  A2: {
    screen: props => <Workout {...props} {...{
      lifts:[
        ['T1', 'bench'],
        ['T2', 'squat'],
        ['T3', 'latPulldown']
      ],
      nextSession: 'B2',
    }} />,
    navigationOptions: {title: "Workout A2"}
  },

  B2: {
    screen: props => <Workout {...props} {...{
      lifts:[
        ['T1', 'deadlift'],
        ['T2', 'ohp'],
        ['T3', 'dbRow']
      ],
      nextSession: 'A1',
    }} />,
    navigationOptions: {title: "Workout B2"}
  },
});
export default App;




const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
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
    borderColor: '#fa375a',
    borderWidth: 1.5,
    //backgroundColor: '#ff728c',
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setButtonInactive: {
    //borderColor: '#bbb',
    backgroundColor: '#eee',
    //borderWidth: 1,
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setButtonClicked: {
    backgroundColor: '#fa375a',
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setButtonTextActive: {
    color: '#fa375a',
    //color: '#fff',
  },
  setButtonTextInactive: {
    //color: '#bbb',
    color: '#777'
  },
  setButtonTextClicked: {
    color: '#fff',
  }
});
