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
    1: [3,3,3,3,5],
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

var workingWeights = {
  T1: {
    squat: {
      label: 'Squat',
      weight: 50,
      repScheme: 1,
    },
    deadlift: {
      label: 'Deadlift',
      weight: 60,
      repScheme: 1,
    },
    bench: {
      label: 'Bench Press',
      weight: 40,
      repScheme: 1,
    },
    ohp: {
      label: 'Overhead Press',
      weight: 30,
      repScheme: 1,
    },
  },
  T2: {
    squat: {
      label: 'Squat',
      weight: 40,
      repScheme: 1,
    },
    deadlift: {
      label: 'Deadlift',
      weight: 50,
      repScheme: 1,
    },
    bench: {
      label: 'Bench Press',
      weight: 30,
      repScheme: 1,
    },
    ohp: {
      label: 'Overhead Press',
      weight: 20,
      repScheme: 1,
    },
  },
  T3: {
    latPulldown: {
      label: 'Lat Pulldown',
      weight: 20,
      repScheme: 1,
    },
    dbRow: {
      label: 'Dumbbell Row',
      weight: 10,
      repScheme: 1,
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
    console.log(this.state);
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

    var weight = workingWeights[tier][exercise].weight;


    // Populate an array of SetButtons to display, and if the rep scheme calls for
    // AMRAP final set, pass the isAmrap prop with TRUE value for the last set button
    var setButtons = [];
    for (var i = 1; i <= sets; i++) {
      setButtons.push(
        <SetButton id={i} key={i} reps={reps[i - 1]} isAmrap={i == sets ? isAmrap : false}
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
          {tier} {workingWeights[tier][exercise].label}
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
            setLastClickedButton(isClicked ? id - 1 : id);
            setLiftComplete(isClicked ? id - 1 : id);
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




class WorkoutA1 extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Workout A1`,
  });

  constructor(props) {
    super(props);

    this.state = {
      squat: false,
      bench: false,
      latPulldown: false,
    };
  }

  render() {
    const {navigate} = this.props.navigation;

    return (
      <ScrollView style={styles.container}>
        <Lift tier='T1' repScheme='1' exercise='squat'
          setLiftComplete={(squat) => { this.setState({squat}) }}
        />
        <Lift tier='T2' repScheme='1' exercise='bench'
          setLiftComplete={(bench) => { this.setState({bench}) }}
        />
        <Lift tier='T3' repScheme='1' exercise='latPulldown'
          setLiftComplete={(latPulldown) => { this.setState({latPulldown}) }}
        />

        <Button
          title="Done"
          onPress={() => {
            this.setState({});

            if (this.state.squat) {
              workingWeights['T1']['squat']['weight'] += 5;
            }
            if (this.state.bench) {
              workingWeights['T2']['bench']['weight'] += 2.5;
            }
            if (this.state.latPulldown) {
              workingWeights['T3']['latPulldown']['weight'] += 10;
            }

            navigate('B1');
          }}
        />
      </ScrollView>
    );
  }
}

// Other workouts commented out, so testing can focus on just first workout
/*
class WorkoutB1 extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Workout B1`,
  });
  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView style={styles.container}>
        <Lift tier='T1' repScheme='1' exercise='ohp' />
        <Lift tier='T2' repScheme='1' exercise='deadlift' />
        <Lift tier='T3' repScheme='1' exercise='dbRow' />

        <Button
          onPress={() => navigate('A2')}
          title="Done"
        />
      </ScrollView>
    );
  }
}

class WorkoutA2 extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Workout A2`,
  });
  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView style={styles.container}>
        <Lift tier='T1' repScheme='1' exercise='bench' />
        <Lift tier='T2' repScheme='1' exercise='squat' />
        <Lift tier='T3' repScheme='1' exercise='latPulldown' />

        <Button
          onPress={() => navigate('B2')}
          title="Done"
        />
      </ScrollView>
    );
  }
}

class WorkoutB2 extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Workout B2`,
  });
  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView style={styles.container}>
        <Lift tier='T1' repScheme='1' exercise='deadlift' />
        <Lift tier='T2' repScheme='1' exercise='ohp' />
        <Lift tier='T3' repScheme='1' exercise='dbRow' />

        <Button
          onPress={() => navigate('A1')}
          title="Done"
        />
      </ScrollView>
    );
  }
}
*/

const App = StackNavigator({
  A1: { screen: WorkoutA1 },
  //B1: { screen: WorkoutB1 },
  //A2: { screen: WorkoutA2 },
  //B2: { screen: WorkoutB2 },
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
