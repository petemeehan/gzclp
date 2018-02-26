import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableHighlight,
} from 'react-native';

import { gzclp } from 'gzclp/js/gzclp';
import { styles, colours } from 'gzclp/js/styles';

import MenuItem from 'gzclp/js/Components/Common/MenuItem';



export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: 'Edit Sessions',
  };

  render() {
    const { navigate } = this.props.navigation;

    const menuItems = []
    for (let i = 0; i < gzclp.getNumberOfSessions(); i++) {
      const liftIDs = gzclp.sortLiftIDsByTier( gzclp.getSessionLifts(i) );
      const lifts = liftIDs.map(id => gzclp.getLiftTier(id) + ' ' + gzclp.getLiftName(id));
      const liftsString = lifts.join('\n');

      menuItems.push(
        <MenuItem
          title={gzclp.getSessionName(i)}
          subtitle={liftsString}
          onPress={() => navigate('EditSessionsPicker', {
            sessionID: i,
            refreshPreviousScreen: () => gzclp.refreshComponent(this)
          })}
          hasNavArrow={true}
          key={i}
        />
      )
    };

    return (
      <ScrollView>
        {menuItems}
      </ScrollView>
    )
  }
}
