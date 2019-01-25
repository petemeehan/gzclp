import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import { gzclp } from 'gzclp/js/gzclp';
import { styles, colours } from 'gzclp/js/styles';

import MenuItem from 'gzclp/js/Components/Common/MenuItem';



export default class extends React.Component {
  constructor(props) {
    super(props);

    // The keys are the lift IDs, the values are the inputted 5RMs
    this.state = {};
  }

  handleDoneButton() {
    const { navigate } = this.props.navigation;

    // Remember that app has been opened once, so intro screen is skipped from now on
    gzclp.setIsFirstTime(false);
    gzclp.saveProgramState();

    // Set starting weights based on inputs, stored in state
    // T1 is set to about 90% of 5RM, and T2 is 75% of this
    Object.keys(this.state).forEach( liftID => {
      let T1Weight = this.state[liftID] * 0.9;
      T1Weight = gzclp.roundDownToNearestIncrement(T1Weight, 2.5);
      gzclp.setNextAttemptWeight(liftID, T1Weight);
      // Also set T2 versions of lifts
      // TODO Fix this 'liftID + 4' hack!!
      let T2Weight = this.state[liftID] * 0.675;
      T2Weight = gzclp.roundDownToNearestIncrement(T2Weight, 2.5);
      gzclp.setNextAttemptWeight(parseInt(liftID) + 4, T2Weight);
    });

    // Store current state of the app
    try {
      gzclp.saveProgramState();
    } catch (error) {
      console.log("Error saving data")
    }

    navigate('MainStack');
  }


  render() {
    const liftIDs_T1 = gzclp.getAllLiftIDsInTier('T1');
    const menuItemsT1 = [];

    for (let i = 0; i < liftIDs_T1.length; i++) {
      const liftID = liftIDs_T1[i];

      menuItemsT1.push(
        <MenuItem
          key={i}
          title={gzclp.getLiftName( liftID )}
          backgroundColour='transparent'
          borderColour='white'
          textColour='white'

          hasTextInput={true}
          textInputPlaceholder='20'
          textInputOnChangeText={text => {
            text = parseFloat(text);
            this.setState( {[liftID]: text} );
            // ES6 shorthand for:
            //  var obj  = {};
            //  obj[liftID] = text;
            //  this.setState( obj );
          }}
          style={{
            backgroundColor: colours.primaryColour,
            borderColor: 'white',
          }}
        />
      )
    };

    return (
      <View style={{flex: 1, justifyContent: 'center', backgroundColor: colours.primaryColour}}>

        <View style={{marginVertical: 20, paddingHorizontal: 15}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center'}}>
            Find your starting weights
          </Text>
          <Text style={{marginVertical: 10, fontSize: 15, color: 'white', textAlign: 'center'}}>
            If you've lifted before and know (or can estimate) your <Text style={{fontWeight: 'bold'}}>5-rep maxes</Text>, you can enter them here, or else leave blank to start with an empty bar
          </Text>
        </View>

        <View>
          {menuItemsT1}
        </View>

        {
          //TODO Make this a component
        }
        <View style={{marginTop: 40, alignItems: 'center'}}>
          <View style={{backgroundColor: 'white', borderWidth: 1, borderColor: 'white'}}>
            <TouchableOpacity
              style={{backgroundColor: colours.primaryColour, padding: 8}}
              onPress={() => this.handleDoneButton()}
              activeOpacity={0.8}
            >
              <Text style={{fontSize: 18, color: 'white'}}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    )
  }
}
