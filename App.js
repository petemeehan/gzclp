import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
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

class WorkoutA1 extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Workout A1`,
  });
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={styles.liftName}>T1 Squat</Text>
        <Text style={styles.liftName}>T2 Bench</Text>
        <Text style={styles.liftName}>T3 Lat Pulldown</Text>
        <Button
          onPress={() => navigate('B1')}
          title="Done"
        />
      </View>
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
      <View style={styles.container}>
        <Text style={styles.liftName}>T1 OHP</Text>
        <Text style={styles.liftName}>T2 Deadlift</Text>
        <Text style={styles.liftName}>T3 Dumbbell Row</Text>
        <Button
          onPress={() => navigate('A2')}
          title="Done"
        />
      </View>
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
      <View style={styles.container}>
        <Text style={styles.liftName}>T1 Bench</Text>
        <Text style={styles.liftName}>T2 Squat</Text>
        <Text style={styles.liftName}>T3 Lat Pulldown</Text>
        <Button
          onPress={() => navigate('B2')}
          title="Done"
        />
      </View>
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
      <View style={styles.container}>
        <Text style={styles.liftName}>T1 Deadlift</Text>
        <Text style={styles.liftName}>T2 OHP</Text>
        <Text style={styles.liftName}>T3 Dumbbell Row</Text>
        <Button
          onPress={() => navigate('A1')}
          title="Done"
        />
      </View>
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
    paddingHorizontal: 10,
    paddingVertical: 20,
    fontSize: 16,
  }
});
