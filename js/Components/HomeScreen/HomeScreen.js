import React from 'react';
import {
  View,
  ScrollView,
  Button,
  Image,
  TouchableOpacity,
} from 'react-native';

import { styles, colours } from '../../styles';
import { gzclp } from '../../gzclp';

import NextSessionButton from './NextSessionButton';
import CompletedSessionResult from './CompletedSessionResult';
import ProgramState from './ProgramState';



export default class extends React.Component {
  constructor(props) {
    super(props);
    // Initialise program state with default values
    gzclp.resetProgramState();

    this.state = {isProgramStateVisible: false};
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'GZCLP',
    headerTintColor: '#fff',
    headerStyle: styles.header,
    headerLeft: <TouchableOpacity
      onPress={() => navigation.navigate('Settings')}
    >
      <Image
        style={styles.settingsIcon}
        source={require('../../../Icons/settings.png')}
      />
    </TouchableOpacity>,
  });

  componentDidMount() {
    // Overwrite initial default program state values with stored ones, if they exist
    this.loadSavedData();
  }

  async loadSavedData() {
    var storedProgramState;

    try {
      storedProgramState = await gzclp.loadProgramState();
      if (storedProgramState !== null) {
        gzclp.setProgramState(storedProgramState);
        gzclp.refreshComponent(this);
      } else console.log("(No sessions completed)")
    } catch (error) {
      console.log("Error retrieving data");
    }
  }

  handleShowProgramStateButton() {
    this.setState({isProgramStateVisible: !this.state.isProgramStateVisible})
  }

  // Remove stored data and reset program state to initial values
  async handleResetButtonPress() {
    try {
      await gzclp.deleteSavedProgramState();
      gzclp.resetProgramState();
      gzclp.refreshComponent(this);
    } catch (error) {
      console.log("Error removing data");
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    // Populate an array of CompletedSessionResult components to render
    var previousSessionResults = [];
    const previousSessions = gzclp.getAllCompletedSessions();
    for (var i = 0; i < previousSessions.length; i++) {
      previousSessionResults.push(
        <CompletedSessionResult
          key={i}
          sessionID={i}
        />
      );
    }

    return (
      <View style={{flex: 1}}>
        <NextSessionButton navigate={navigate} onGoBack={() => gzclp.refreshComponent(this)} />

        <ScrollView style={{marginTop: 10}}>
          {previousSessionResults.reverse()}
        </ScrollView>

        {this.state.isProgramStateVisible ? <ProgramState /> : null}

        <Button
          title={this.state.isProgramStateVisible ? 'Hide Current Progress' : 'Show Current Progress'}
          color={colours.primaryColour}
          onPress={() => this.handleShowProgramStateButton()}
        />

        <Button
          title='Reset Everything'
          color='#777'
          onPress={() => this.handleResetButtonPress()}
        />
      </View>
    );
  }
}
