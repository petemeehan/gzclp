import React from 'react';
import {
  View,
} from 'react-native';

import { styles } from '../../js/styles';
import { gzclp } from '../../js/gzclp';

import LiftButton from './LiftButton';
import LiftInfo from './LiftInfo';
import Timer from './Timer';



export default class extends React.Component {
  constructor(props) {
    super(props);

    // Initiate an array to be used to keep track of state of lift buttons
    // (which represent each set)
    // ie. whether they have been clicked, and if they have been set to
    // successful/failed/incomplete
    // Each element is an integer 0, 1 or 2:
    // 0 - incomplete
    // 1 - successful
    // 2 - failed
    let numberOfSets = gzclp.getNumberOfSets(props.tier, props.repSchemeIndex);
    var buttonStates = [];
    for (var i = 0; i < numberOfSets; i++) {
      buttonStates[i] = 0;
    }

    this.state = {
      buttonStates,
      isTimerVisible: false,
      areAllSetsSuccessful: false,
    };
  }

  getNumberOfSets() {
    return this.state.buttonStates.length;
  }

  componentDidUpdate() {
    //console.log(this.state);
  }

  // Each button, which represents a set, should be clickable
  // if ANY of these conditions are true:
  // 1. The set immediately preceeding it is completed
  // 2. The current set has already been completed
  // 3. Any of the following sets are completed
  isButtonClickable(id) {
    var test = false;

    let numberOfSets = this.getNumberOfSets();
    for (var i = -1; i < numberOfSets - id; i++) {
      test = test || this.state.buttonStates[id + i] != 0;
    }
    return test;
  }

  setWhetherTimerVisible(buttonID) {
    let numberOfSets = this.getNumberOfSets();

    // Timer isn't affected by selecting set as failed
    if (this.state.buttonStates[buttonID] != 2) {   // TODO: generalise
      // Before activating timer, disable it first to force it to restart after each set
      this.setState({isTimerVisible: false}, () => {
        // Check that sets aren't all completed, as no need for timer after that
        let allSetsAreComplete = true;
        for (var i = 0; i < numberOfSets; i++) {
          let buttonState = this.state.buttonStates[i];
          if (buttonState == 0) {
            allSetsAreComplete = false;
            break;
          }
        }
        if (!allSetsAreComplete) {
          this.setState({isTimerVisible: this.state.buttonStates[buttonID] == 1});
        }
      });
    }
  }

  // States represent the following:
  // 0 - Incomplete lift (not all sets attempted
  // 1 - Successful lift (all sets successful)
  // 2 - Failed lift (all sets attempted but not all successful)
  // TODO generalise this and define possible states as gzclp constants
  determineLiftResult() {
    var liftResult;

    var isComplete = true;
    var isFailed = false;

    for (var i = 0; i < this.getNumberOfSets(); i++) {
      let buttonState = this.state.buttonStates[i];

      if (buttonState == 0) {
        isComplete = false;
        break;
      } else if (buttonState == 2) {
        isFailed = true;
      }
    }

    liftResult = isComplete ? (isFailed ? 2 : 1) : 0;

    // Check if all sets successful, so visual feedback can be given
    if (liftResult == 1) {
      this.setState({ areAllSetsSuccessful: true })
    } else {
      this.setState({ areAllSetsSuccessful: false })
    }

    return liftResult;
  }

  render() {
    var {
      tier,
      repSchemeIndex,
      name,
      weight
    } = this.props;   // TODO: are these needed, surely only id is

    let numberOfSets = this.getNumberOfSets();
    let displayedRepsPerSet = gzclp.getDisplayedRepsPerSet(tier, repSchemeIndex);

    // Populate an array of LiftButtons to display
    var liftButtons = [];
    for (var id = 0; id < numberOfSets; id++) {
      liftButtons.push(
        <LiftButton
          key={id} // Required by React as every element requires a unique key
          id={id}
          reps={gzclp.getNumberOfRepsInASet(tier, repSchemeIndex, id)}
          isClickable={this.isButtonClickable(id, numberOfSets)}
          buttonState={this.state.buttonStates[id]}

          // True if all sets were completed successfully
          areAllSetsSuccessful={this.state.areAllSetsSuccessful}

          // This prop declares a function that is passed to and called by the child component LiftButton
          handleButtonClick={(clickedButtonID) => {
            // Keep track of which button was last clicked, so buttons can only be clicked in order
            this.setState(prevState => {
              let buttonStates = prevState.buttonStates;
              buttonStates[clickedButtonID] = (buttonStates[clickedButtonID] + 1) % 3;  // TODO Generalise
              return { buttonStates };
            }, () => {
              this.setWhetherTimerVisible(clickedButtonID);
              // When all sets are complete (ie. all buttons are clicked), set
              // lift as complete (by updating state) in parent component, Session
              this.props.setLiftResult( this.determineLiftResult() );
            });

          }}
        />
      );
    }

    return (
      <View style={styles.liftContainer}>
        <View style={styles.liftInfoContainer}>
          <LiftInfo
            tier={tier} name={name} weight={weight}
            sets={numberOfSets} reps={displayedRepsPerSet}
          />
        </View>

        <View style={styles.liftButtonsContainer}>
          {liftButtons}
        </View>

        {this.state.isTimerVisible ? <Timer tier={tier} /> : null}
      </View>
    );
  }
}
