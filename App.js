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


class Lift extends React.Component {
  constructor(props) {
    super(props);

    this.state = { lastClickedButton: 0 };
  }

  render() {
    var sets = REP_SCHEMES[this.props.tier][this.props.repScheme].sets;
    var reps = REP_SCHEMES[this.props.tier][this.props.repScheme].reps;
    var isAmrap = REP_SCHEMES[this.props.tier].isAmrap;

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
      <View>
        <Text style={styles.liftName}>
          {this.props.tier} {this.props.exercise}
        </Text>
        <View style={styles.setButtonContainer}>
          {setButtons}
        </View>
      </View>
    );
  }
}


class SetButton extends React.Component {
  render() {
    var isClicked = this.props.isClicked,
        isActive = this.props.isActive,
        setLastClickedButton = this.props.setLastClickedButton,
        id = this.props.id;

    // If button is clicked, display a tick. Otherwise display number of reps.
    // And if set is an AMRAP set, display a '+' sign with the number
    var buttonText = isClicked ?
      '✓' : this.props.reps + (this.props.amrap ? '+' : '');

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
        <Lift tier='T1' repScheme='1' exercise='Squat' />
        <Lift tier='T2' repScheme='1' exercise='Bench Press' />
        <Lift tier='T3' repScheme='1' exercise='Lat Pulldown' />

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
        <Lift tier='T1' repScheme='1' exercise='OHP' />
        <Lift tier='T2' repScheme='1' exercise='Deadlift' />
        <Lift tier='T3' repScheme='1' exercise='Dumbbell Row' />

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
        <Lift tier='T1' repScheme='1' exercise='Bench' />
        <Lift tier='T2' repScheme='1' exercise='Squat' />
        <Lift tier='T3' repScheme='1' exercise='Lat Pulldown' />

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
        <Lift tier='T1' repScheme='1' exercise='Deadlift' />
        <Lift tier='T2' repScheme='1' exercise='OHP' />
        <Lift tier='T3' repScheme='1' exercise='Dumbbell Row' />

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
    backgroundColor: '#fff',
  },
  liftName: {
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
  },
  setButtonContainer: {
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
