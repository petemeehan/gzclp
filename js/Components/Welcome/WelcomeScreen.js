import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import { gzclp } from 'gzclp/js/gzclp';
import { styles, colours } from 'gzclp/js/styles';



export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // If app has been opened before skip this screen
    const { navigate } = this.props.navigation;
    if (!gzclp.isFirstTime()) {
      navigate('MainStack');
    }
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colours.primaryColour}}>

        <View style={{marginVertical: 10, alignItems: 'center'}}>
          <Text style={{fontSize: 25, fontWeight: 'bold', color: 'white'}}>Welcome to GZCLP</Text>
          <Text style={{fontSize: 20, fontStyle: 'italic', color: 'white'}}>GZCL Linear Program</Text>
        </View>

        {
          //TODO Make this a component
        }
        <View style={{marginTop: 40, backgroundColor: 'white', borderWidth: 1, borderColor: 'white'}}>
          <TouchableOpacity
            style={{backgroundColor: colours.primaryColour, padding: 8}}
            onPress={() => this.props.navigation.navigate('StartingWeights')}
            activeOpacity={0.8}
          >
            <Text style={{fontSize: 18, color: 'white'}}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
