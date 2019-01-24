import React from 'react';
import {
  View,
  ScrollView,
  Text,
} from 'react-native';

import { gzclp } from 'gzclp/js/gzclp';
import { styles, colours } from 'gzclp/js/styles';



export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: 'Privacy',
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <ScrollView>
        <View style={styles.genericContainer}>
          <Text style={styles.heading}>
            Privacy Policy
          </Text>

          <Text style={styles.paragraph}>
            No personal data is collected, used or stored. At all.
          </Text>

          <Text style={styles.paragraph}>
            This privacy policy was last updated on January 1, 2019. The privacy policy may change from time to time for any reason, but if any material changes are made, I will place a prominent notice on the application.
          </Text>
        </View>
      </ScrollView>
    )
  }
}
