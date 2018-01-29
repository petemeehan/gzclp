import {
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';

StatusBar.setBarStyle('light-content');

const DEVICE_W = Dimensions.get('window').width;

console.log((0.03125+0.015625) * DEVICE_W);

export const colours = {
  primaryColour: '#fa375a',
  lightGrey: '#eee',
  mediumGrey: '#999',
  darkGrey: '#666',
  successful: '#4cd964',
  //successful: '#fa375a',
  failed: '#999',
};

export const styles = StyleSheet.create({
  header: {
    backgroundColor: colours.primaryColour
  },
  settingsIcon: {
    marginLeft: 15,
    height: 30,
    width: 30
  },
  navArrow: {
    fontSize: 22,
    color: colours.mediumGrey
  },
  genericContainer: {
    //borderWidth: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 2,
  },
  menuText: {
    fontSize: 18,
  },
  allText: {
    color: 'red'
  },


  nextSessionTitle: {
    color: colours.primaryColour,
    marginBottom: 5,
    fontSize: 17,
    fontWeight: 'bold',
  },
  completedSessionTitle: {
    marginBottom: 5,
    fontSize: 15,
    fontWeight: 'bold',
  },
  progressDataContainer: {
    paddingHorizontal: 15,
  },
  progressDataTitle: {
    marginVertical: 10,
  },
  progressDataContent: {
    fontFamily: 'Courier New',
  },

  liftContainer: {
    //borderWidth: 1,
    backgroundColor: '#fff',
    marginBottom: 2,
  },
  liftInfoContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  liftName: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  liftDetails: {
    marginVertical: 5,
  },
  liftButtonsContainer: {
    marginLeft: 15,
    marginRight: -2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    //borderWidth: 1
  },
  // Container for underlying circle which gives "border" effect
  liftButtonContainer: {
    marginRight: 10,
    marginTop: 7,
    alignItems: 'center',
    justifyContent: 'center',
    //borderWidth: 1
  },


  liftButtonClickable: {
    borderColor: colours.primaryColour,
    borderWidth: 1.25,
    //margin: 0.015625 * DEVICE_W,
    width: 0.15 * DEVICE_W,
    height: 0.15 * DEVICE_W,
    borderRadius: 0.15 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liftButtonNotClickable: {
    backgroundColor: colours.lightGrey,
    //margin: 0.015625 * DEVICE_W,
    width: 0.15 * DEVICE_W,
    height: 0.15 * DEVICE_W,
    borderRadius: 0.15 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liftButtonSuccessful: {
    backgroundColor: colours.primaryColour,
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liftButtonAllSuccessful: {
    backgroundColor: colours.successful,
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liftButtonFailed: {
    backgroundColor: colours.failed,
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /**
  liftButtonBorderSuccessful: {
    borderColor: colours.primaryColour,
    borderWidth: 1.5,
    width: 0.175 * DEVICE_W,
    height: 0.175 * DEVICE_W,
    borderRadius: 0.175 * DEVICE_W / 2,
    position: 'absolute',
  },
  liftButtonBorderFailed: {
    borderColor: colours.failed,
    borderWidth: 1.5,
    width: 0.175 * DEVICE_W,
    height: 0.175 * DEVICE_W,
    borderRadius: 0.175 * DEVICE_W / 2,
    position: 'absolute',
  },
  liftButtonBorderAllSuccessful: {
    borderColor: colours.successful,
    borderWidth: 1.5,
    width: 0.175 * DEVICE_W,
    height: 0.175 * DEVICE_W,
    borderRadius: 0.175 * DEVICE_W / 2,
    position: 'absolute',
  },
  **/
  liftButtonTextClickable: {
    color: colours.primaryColour,
  },
  liftButtonTextNotClickable: {
    color: colours.mediumGrey,
  },
  liftButtonTextSuccessful: {
    color: '#fff',
  },
  liftButtonTextFailed: {
    color: '#fff',
  },


  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.darkGrey,
    paddingHorizontal: (0.03125+0.015625) * DEVICE_W,
    paddingVertical: 2,
  },
  timerNumbers: {
    width: 50,
    color: 'white',
    fontSize: 18,
  },
  timerText: {
    color: 'white',
  }
});
