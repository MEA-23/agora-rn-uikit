import React, {useContext} from 'react';
import {View} from 'react-native';
import styles from '../Style';
import EndCall from './Local/EndCall';
import LocalAudioMute from './Local/LocalAudioMute';
import LocalSpeakerToggle from './Local/LocalSpeakerToggle';
import RemoteControls from './RemoteControls';
import {MaxUidConsumer} from '../Contexts/MaxUidContext';
import PropsContext, {Layout} from '../Contexts/PropsContext';
import {ClientRoleType} from 'react-native-agora';

interface ControlsPropsInterface {
  /**
   * Render the remote controls row above the local controls. (default: true)
   */
  showButton?: boolean;
}

/**
 * Control bar for audio-only calls: mute and speaker/earpiece routing, with no
 * camera buttons. Use with `enableVideoOnHost: false`, or compose it yourself.
 */
const LocalControlsAudio: React.FC<ControlsPropsInterface> = props => {
  const {styleProps, rtcProps} = useContext(PropsContext);
  const {localBtnContainer} = styleProps || {};
  const showButton = props.showButton !== undefined ? props.showButton : true;
  return (
    <>
      <View style={{...styles.Controls, ...(localBtnContainer as object)}}>
        {rtcProps.role !== ClientRoleType.ClientRoleAudience && (
          <>
            <LocalAudioMute />
            <LocalSpeakerToggle />
          </>
        )}
        <EndCall />
      </View>
      {showButton ? (
        <MaxUidConsumer>
          {users => (
            <View
              style={{
                ...styles.Controls,
                bottom: styles.Controls.bottom + 70,
              }}>
              {rtcProps.layout !== Layout.Grid && (
                <RemoteControls user={users[0]} showRemoteSwap={false} />
              )}
            </View>
          )}
        </MaxUidConsumer>
      ) : (
        <></>
      )}
    </>
  );
};

export default LocalControlsAudio;
