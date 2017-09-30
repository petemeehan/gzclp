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

/* Disabled home screen as not required yet
/*
class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'GZCLP',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Button
          onPress={() => navigate('A1')}
          title="Proceed to First Workout"
        />
      </View>
    );
  }
}
*/

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
    amrap: true,
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
    amrap: false,
  },
  T3: {
    1: {
      sets: 3,
      reps: 15,
    },
    amrap: true,
  },
}


class SetButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pressStatus: false };
  }

  onPressButton() {
    this.setState(
      previousState => {
        return { pressStatus: !(previousState.pressStatus) };
      }
    );
  }

  render() {
    let currentStyle = this.state.pressStatus ?
      styles.setButtonSuccess : styles.setButtonBlank;
    let currentTextStyle = this.state.pressStatus ?
      styles.setButtonTextSuccess : styles.setButtonTextBlank;
    let currentText = this.state.pressStatus ?
      '✓' : this.props.reps + (this.props.amrap ? '+' : '');
    return (
      <TouchableOpacity
        style={currentStyle}
        onPress={this.onPressButton.bind(this)}
      >
        <Text style={currentTextStyle}>{currentText}</Text>
      </TouchableOpacity>
    )
  }
}


class Lift extends React.Component {
  render() {
    let sets = REP_SCHEMES[this.props.tier][this.props.repScheme].sets;
    let reps = REP_SCHEMES[this.props.tier][this.props.repScheme].reps;
    let amrap = REP_SCHEMES[this.props.tier].amrap;

    // Populate an array of SetButtons for display, and if the rep scheme calls
    // for an AMRAP final set, represent that in the final button in the array
    let setButtons = [];
    for (var i = 0; i < sets - 1; i++) {
      setButtons.push(<SetButton reps={reps} key={i} />);
    }
    setButtons.push(<SetButton reps={reps} amrap={amrap} key={i} />);

    return (
      <View>
        <Text style={styles.liftName}>{this.props.tier} {this.props.exercise}</Text>
        <View style={styles.setButtonContainer}>
          {setButtons}
        </View>
      </View>
    );
  }
}


class WorkoutA1 extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Workout A1`,
  });
  render() {
    console.log(DEVICE_W);
    const {navigate} = this.props.navigation;
    return (
      <ScrollView style={styles.container}>
        <Lift tier='T1' repScheme='1' exercise='Squat' />
        <Lift tier='T2' repScheme='1' exercise='Bench' />
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
  //Home: { screen: HomeScreen },
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
  setButtonBlank: {
    borderColor: '#fa375a',
    borderWidth: 1,
    marginHorizontal: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setButtonSuccess: {
    backgroundColor: '#fa375a',
    marginHorizontal: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setButtonTextBlank: {
    color: '#fa375a',
  },
  setButtonTextSuccess: {
    color: '#fff',
  }
});
