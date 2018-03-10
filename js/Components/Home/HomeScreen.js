import React from 'react';
import {
  View,
  ScrollView,
  Button,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  TextInput,
} from 'react-native';

import { styles, colours } from 'gzclp/js/styles';
import { gzclp } from 'gzclp/js/gzclp';

import NextSessionButton from './NextSessionButton';
import CompletedSessionResult from './CompletedSessionResult';
import ProgramState from './ProgramState';

import { cogIcon } from 'gzclp/js/Components/Common/Icons';


export default class extends React.Component {
  constructor(props) {
    super(props);
    // Initialise program state with default values
    gzclp.resetProgramState();

    this.state = {isProgramStateVisible: false};
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'GZCLP',
    headerLeft: <TouchableOpacity
      style={{width: 40, height: 40, justifyContent: 'center', alignItems: 'center'}}
      onPress={() => navigation.navigate('SettingsStack', navigation.state.params)}
    >
      {cogIcon}
    </TouchableOpacity>,
  });

  componentWillMount() {
    // Overwrite initial default program state values with stored ones, if they exist
    this.loadSavedData();

    // Put refreshHomeScreen function into navigation.state.params
    // so it can be invoked in navigationOptions and then passed to Settings screen
    this.props.navigation.setParams( {refreshHomeScreen: () => gzclp.refreshComponent(this)})
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
        <Text style={styles.menuHeading}>NEXT SESSION</Text>
        <NextSessionButton
          navigate={navigate}
          refreshHomeScreen={() => gzclp.refreshComponent(this)}
        />

        {previousSessionResults.length > 0 ? <Text style={styles.menuHeading}>PREVIOUS SESSIONS</Text> : null}
        <ScrollView>
          {previousSessionResults.reverse()}
        </ScrollView>


        {this.state.isProgramStateVisible ? <ProgramState /> : null}
        <Button
          title={this.state.isProgramStateVisible ? 'Hide current program state' : 'Show current program state'}
          color={colours.primaryColour}
          onPress={() => this.handleShowProgramStateButton()}
        />
      </View>
    );
  }
}
