import {
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';

const primaryColour = '#fa375a';
const allSuccessfulColour = '#00aaff'
const lightGrey = '#eee';
const mediumGrey = '#aaa';
const darkGrey = '#666';

const DEVICE_W = Dimensions.get('window').width;
const DEVICE_H = Dimensions.get('window').height;

StatusBar.setBarStyle('light-content');

export default StyleSheet.create({
  settingsIcon: {
    marginLeft: (0.03125+0.015625) * DEVICE_W,
  },
  nextSessionContainer: {
    //borderWidth: 1,
    backgroundColor: '#fff',
    paddingLeft: (0.03125+0.015625) * DEVICE_W,
    paddingRight: (0.03125+0.015625) * DEVICE_W / 2,
    paddingVertical: 10,
  },
  nextSessionTitle: {
    color: primaryColour,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressDataContainer: {
    paddingHorizontal: (0.03125+0.015625) * DEVICE_W,
  },
  progressDataTitle: {
    marginVertical: 10
  },
  progressDataContent: {
    fontFamily: 'Courier New',
  },
  liftContainer: {
    backgroundColor: '#fff',
    marginBottom: 1,
  },
  liftInfoContainer: {
    marginHorizontal: (0.03125+0.015625) * DEVICE_W,
    marginTop: 5 + 0.015625 * DEVICE_W,
    marginBottom: 5,
  },
  liftName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  liftDetails: {
    marginVertical: 5,
  },
  liftButtonsContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    marginHorizontal: 0.03125 * DEVICE_W,
    flexWrap: 'wrap',
    //borderWidth: 1
  },
  liftButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    //borderWidth: 1
  },

  liftButtonClickable: {
    borderColor: primaryColour,
    borderWidth: 1.25,
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liftButtonNotClickable: {
    backgroundColor: lightGrey,
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liftButtonSuccessful: {
    backgroundColor: primaryColour,
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liftButtonAllSuccessful: {
    backgroundColor: allSuccessfulColour,
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liftButtonFailed: {
    backgroundColor: mediumGrey,
    //borderColor: primaryColour,
    //borderWidth: 1.25,
    margin: 0.015625 * DEVICE_W,
    width: 0.15625 * DEVICE_W,
    height: 0.15625 * DEVICE_W,
    borderRadius: 0.15625 * DEVICE_W / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  liftButtonBorderClickable: {
    //borderColor: primaryColour,
    //borderWidth: 1.5,
    width: 0.175 * DEVICE_W,
    height: 0.175 * DEVICE_W,
    borderRadius: 0.175 * DEVICE_W / 2,
    position: 'absolute',
  },
  liftButtonBorderNotClickable: {
    //borderColor: '#fff',
    //borderWidth: 1.5,
    width: 0.175 * DEVICE_W,
    height: 0.175 * DEVICE_W,
    borderRadius: 0.175 * DEVICE_W / 2,
    position: 'absolute',
  },
  liftButtonBorderSuccessful: {
    borderColor: primaryColour,
    borderWidth: 1.5,
    width: 0.175 * DEVICE_W,
    height: 0.175 * DEVICE_W,
    borderRadius: 0.175 * DEVICE_W / 2,
    position: 'absolute',
  },
  liftButtonBorderFailed: {
    borderColor: mediumGrey,
    borderWidth: 1.5,
    width: 0.175 * DEVICE_W,
    height: 0.175 * DEVICE_W,
    borderRadius: 0.175 * DEVICE_W / 2,
    position: 'absolute',
  },
  liftButtonBorderAllSuccessful: {
    borderColor: allSuccessfulColour,
    borderWidth: 1.5,
    width: 0.175 * DEVICE_W,
    height: 0.175 * DEVICE_W,
    borderRadius: 0.175 * DEVICE_W / 2,
    position: 'absolute',
  },

  liftButtonTextClickable: {
    color: primaryColour,
  },
  liftButtonTextNotClickable: {
    color: mediumGrey,
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
    backgroundColor: darkGrey,
    paddingHorizontal: (0.03125+0.015625) * DEVICE_W,
    paddingVertical: 2,
  },
  timerNumbers: {
    width: 50,
    color: '#fff',
    fontSize: 15,
  },
  timerText: {
    color: '#fff',
  }
});
