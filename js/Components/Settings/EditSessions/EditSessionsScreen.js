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
      const liftIDs = gzclp.getSessionLifts(i);
      gzclp.sortLiftIDsByTier(liftIDs);
      const lifts = liftIDs.map(id => gzclp.getLiftTier(id) + ' ' + gzclp.getLiftName(id));

      menuItems.push(
        <MenuItem
          title={gzclp.getSessionName(i)}
          subtextArray={lifts}
          onPress={() => navigate('EditSessionsPicker', { sessionID: i })}
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
