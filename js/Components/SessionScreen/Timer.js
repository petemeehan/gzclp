import React from 'react';
import {
  View,
  Text,
} from 'react-native';

import { styles } from '../../styles';
import { gzclp } from '../../gzclp';



export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {timeElapsed: 0};

    setInterval( () => {
      if (this.refs.myRef) {    // Check component exists first as it may have been disabled
        this.setState((prevState) => {
          return { timeElapsed: prevState.timeElapsed + 1 };
        });
      }
    }, 1000);
  }

  convertToMinutesAndSeconds(time) {
    var minutes = Math.floor(time / 60);
    var seconds = time % 60;
    // Prefix single-digit seconds with a 0
    var paddedSeconds = seconds.toString().length == 1 ? '0' + seconds : seconds;

    return minutes + ':' + paddedSeconds;
  }

  render() {
    var tier = this.props.tier;
    var time = gzclp.getRestTime(tier);

    return (
      <View ref='myRef' style={styles.timerContainer}>
        <Text style={styles.timerNumbers}>{this.convertToMinutesAndSeconds(this.state.timeElapsed)}</Text>
        <Text style={styles.timerText}>Rest for {time} minutes</Text>
      </View>
    )
  }
}
