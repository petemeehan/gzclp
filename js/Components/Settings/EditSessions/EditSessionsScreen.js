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
      menuItems.push(
        <MenuItem
          menuItemText={gzclp.getSessionName(i)}
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
