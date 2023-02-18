import color from '../../../color';
import Pause from '../../../icons/pause.svg';
import Play from '../../../icons/play.svg';
import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';

function VideoControls(props) {
  const isPlaying = props.isPlaying;

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => {
          props.onVideoTimeChange(-5);
        }}
        android_ripple={{color: color.edalabBlue, borderless: false}}
        backgroundColor={color.lightBlue}
        borderRadius={7}
        width={60}
        padding={5}
        alignItems={'center'}
        margin={10}>
        {isPlaying ? (
          <Pause height={'25'} width={'40'} fill={'white'}/>
        ) : (
          <Play height={'25'} width={'40'} fill={'white'}/>
        )}
      </Pressable>
      <Pressable
        onPress={() => {
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
          <Pause height={'25'} width={'40'} fill={'white'}/>
        ) : (
          <Play height={'25'} width={'40'} fill={'white'}/>
        )}
      </Pressable>
      <Pressable
        onPress={() => {
          props.onVideoTimeChange(+5);
        }}
        android_ripple={{color: color.edalabBlue, borderless: false}}
        backgroundColor={color.lightBlue}
        borderRadius={7}
        width={60}
        padding={5}
        alignItems={'center'}
        margin={10}>
        {isPlaying ? (
          <Pause height={'25'} width={'40'} fill={'white'}/>
        ) : (
          <Play height={'25'} width={'40'} fill={'white'}/>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default VideoControls;
