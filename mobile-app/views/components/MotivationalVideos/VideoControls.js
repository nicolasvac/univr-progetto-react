import color from '../../../color';
import PauseIcon from '../../../icons/pause.svg';
import PlayIcon from '../../../icons/play.svg';
import ForwardIcon from '../../../icons/forward-10-seconds.svg';
import BackwardIcon from '../../../icons/backward-10-seconds.svg';
import MuteIcon from '../../../icons/mute.svg';
import UnmuteIcon from '../../../icons/unmute.svg';
import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';

function VideoControls(props) {
  // Estrai le props per leggibilità
  const isPlaying = props.isPlaying;
  const isMuted = props.isMuted;

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => {
          // Comunica alla vista superiore di mutare / smutare il video.
          props.onVideoMuteChange(!isMuted);
        }}
        android_ripple={{color: color.edalabBlue, borderless: false}}
        backgroundColor={color.lightBlue}
        borderRadius={7}
        width={60}
        padding={5}
        alignItems={'center'}
        margin={10}>
        {isMuted ? (
          <MuteIcon height={'25'} width={'40'} fill={'black'} />
        ) : (
          <UnmuteIcon height={'25'} width={'40'} fill={'black'} />
        )}
      </Pressable>
      <Pressable
        onPress={() => {
          // Comunica alla vista superiore di andare indietro di 10 secondi.
          props.onVideoTimeChange(-10);
        }}
        android_ripple={{color: color.edalabBlue, borderless: false}}
        backgroundColor={color.lightBlue}
        borderRadius={7}
        width={60}
        padding={5}
        alignItems={'center'}
        margin={10}>
        <BackwardIcon height={'25'} width={'40'} />
      </Pressable>
      <Pressable
        onPress={() => {
          // Comunica alla vista superiore di avviare / stoppare il video player.
          props.onPlayingChange(!isPlaying);
        }}
        android_ripple={{color: color.edalabBlue, borderless: false}}
        backgroundColor={color.lightBlue}
        borderRadius={7}
        width={60}
        padding={5}
        alignItems={'center'}
        margin={10}>
        {isPlaying ? (
          <PauseIcon height={'25'} width={'40'} fill={'black'}/>
        ) : (
          <PlayIcon height={'25'} width={'40'} fill={'black'}/>
        )}
      </Pressable>
      <Pressable
        onPress={() => {
          // Comunica alla vista superiore di andare avanti di 10 secondi.
          props.onVideoTimeChange(+10);
        }}
        android_ripple={{color: color.edalabBlue, borderless: false}}
        backgroundColor={color.lightBlue}
        borderRadius={7}
        width={60}
        padding={5}
        alignItems={'center'}
        margin={10}>
        <ForwardIcon height={'25'} width={'40'} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default VideoControls;
