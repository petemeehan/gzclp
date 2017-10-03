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
    1: {
      sets: 5,
      reps: 3,
    },
    2: {
      sets: 6,
      reps: 2,
    },
    3: {
      sets: 10,
      reps: 1,
    },
    isAmrap: true,
  },
  T2: {
    1: {
      sets: 3,
      reps: 10,
    },
    2: {
      sets: 3,
      reps: 8,
    },
    3: {
      sets: 3,
      reps: 6,
    },
    isAmrap: false,
  },
  T3: {
    1: {
      sets: 3,
      reps: 15,
    },
    isAmrap: true,
  },
}

const workingWeights = {
  T1: {
    squat: {
      label: 'Squat',
      weight: 50,
    },
    deadlift: {
      label: 'Deadlift',
      weight: 60,
    },
    bench: {
      label: 'Bench Press',
      weight: 40,
    },
    ohp: {
      label: 'Overhead Press',
      weight: 30,
    },
  },
  T2: {
    squat: {
      label: 'Squat',
      weight: 40,
    },
    deadlift: {
      label: 'Deadlift',
      weight: 50,
    },
    bench: {
      label: 'Bench Press',
      weight: 30,
    },
    ohp: {
      label: 'Overhead Press',
      weight: 20,
    },
  },
  T3: {
    latPulldown: {
      label: 'Lat Pulldown',
      weight: 20,
    },
    dbRow: {
      label: 'Dumbbell Row',
      weight: 10,
    },
  },
}


class Lift extends React.Component {
  constructor(props) {
    super(props);
    this.state = { lastClickedButton: 0 };
  }

  render() {
    var tier = this.props.tier,
        repScheme = this.props.repScheme,
        exercise = this.props.exercise;

    var sets = REP_SCHEMES[tier][repScheme].sets,
        reps = REP_SCHEMES[tier][repScheme].reps,
        isAmrap = REP_SCHEMES[tier].isAmrap;

    var weight = workingWeights[tier][exercise].weight;

    // Populate an array of SetButtons for display, and if the rep scheme calls
    // for an AMRAP final set, pass the isAmrap prop with TRUE value
    var setButtons = [];
    for (var i = 1; i <= sets; i++) {
      setButtons.push(
        <SetButton id={i} key={i} reps={reps} isAmrap={i == sets ? isAmrap : false}
          isActive={i <= this.state.lastClickedButton + 1}
          isClicked={i <= this.state.lastClickedButton}
          setLastClickedButton={(lastClickedButton) => this.setState( {lastClickedButton} )}
        />
      );
    }

    return (
      <View style={styles.liftContainer}>
        <View style={styles.liftInfoContainer}>
          <LiftInfo tier={tier} exercise={exercise} weight={weight} sets={sets} reps={reps} isAmrap={isAmrap}  />
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
        id = this.props.id;

    // If button is clicked, display a tick. Otherwise display number of reps.
    // And if set is an AMRAP set, display a '+' sign with the number
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
          if (isActive) { setLastClickedButton(!isClicked ? id : id - 1) }
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
  render() {
    const {navigate} = this.props.navigation;
    return (
      <ScrollView style={styles.container}>
        <Lift tier='T1' repScheme='1' exercise='squat' />
        <Lift tier='T2' repScheme='1' exercise='bench' />
        <Lift tier='T3' repScheme='1' exercise='latPulldown' />

        <Button
          onPress={() => navigate('B1')}
          title="Done"
        />
      </ScrollView>
    );
  }
}

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


const App = StackNavigator({
  A1: { screen: WorkoutA1 },
  B1: { screen: WorkoutB1 },
  A2: { screen: WorkoutA2 },
  B2: { screen: WorkoutB2 },
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
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setButtonInactive: {
    borderColor: '#bbb',
    borderWidth: 1,
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
  },
  setButtonTextInactive: {
    color: '#bbb',
  },
  setButtonTextClicked: {
    color: '#fff',
  }
});
