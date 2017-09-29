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
    let currentText = this.state.pressStatus ? '✓' : this.props.reps;
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


class WorkoutA1 extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Workout A1`,
  });
  render() {
    console.log(DEVICE_W);
    const {navigate} = this.props.navigation;
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.liftName}>T1 Squat</Text>
        <View style={styles.setButtonContainer}>
          <SetButton reps='3' />
          <SetButton reps='3' />
          <SetButton reps='3' />
          <SetButton reps='3' />
          <SetButton reps='3+' />
        </View>

        <Text style={styles.liftName}>T2 Bench</Text>
        <View style={styles.setButtonContainer}>
          <SetButton reps='10' />
          <SetButton reps='10' />
          <SetButton reps='10' />
        </View>

        <Text style={styles.liftName}>T3 Lat Pulldown</Text>
        <View style={styles.setButtonContainer}>
          <SetButton reps='15' />
          <SetButton reps='15' />
          <SetButton reps='15+' />
        </View>

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
        <Text style={styles.liftName}>T1 OHP</Text>
        <View style={styles.setButtonContainer}>
          <SetButton reps='3' />
          <SetButton reps='3' />
          <SetButton reps='3' />
          <SetButton reps='3' />
          <SetButton reps='3+' />
        </View>

        <Text style={styles.liftName}>T2 Deadlift</Text>
        <View style={styles.setButtonContainer}>
          <SetButton reps='10' />
          <SetButton reps='10' />
          <SetButton reps='10' />
        </View>

        <Text style={styles.liftName}>T3 Dumbbell Row</Text>
        <View style={styles.setButtonContainer}>
          <SetButton reps='15' />
          <SetButton reps='15' />
          <SetButton reps='15+' />
        </View>

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
        <Text style={styles.liftName}>T1 Bench</Text>
        <View style={styles.setButtonContainer}>
          <SetButton reps='3' />
          <SetButton reps='3' />
          <SetButton reps='3' />
          <SetButton reps='3' />
          <SetButton reps='3+' />
        </View>

        <Text style={styles.liftName}>T2 Squat</Text>
        <View style={styles.setButtonContainer}>
          <SetButton reps='10' />
          <SetButton reps='10' />
          <SetButton reps='10' />
        </View>

        <Text style={styles.liftName}>T3 Lat Pulldown</Text>
        <View style={styles.setButtonContainer}>
          <SetButton reps='15' />
          <SetButton reps='15' />
          <SetButton reps='15+' />
        </View>

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
        <Text style={styles.liftName}>T1 Deadlift</Text>
        <View style={styles.setButtonContainer}>
          <SetButton reps='3' />
          <SetButton reps='3' />
          <SetButton reps='3' />
          <SetButton reps='3' />
          <SetButton reps='3+' />
        </View>

        <Text style={styles.liftName}>T2 OHP</Text>
        <View style={styles.setButtonContainer}>
          <SetButton reps='10' />
          <SetButton reps='10' />
          <SetButton reps='10' />
        </View>

        <Text style={styles.liftName}>T3 Dumbbell Row</Text>
        <View style={styles.setButtonContainer}>
          <SetButton reps='15' />
          <SetButton reps='15' />
          <SetButton reps='15+' />
        </View>

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
