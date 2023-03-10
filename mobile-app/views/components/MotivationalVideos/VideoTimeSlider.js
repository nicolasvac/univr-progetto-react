import {StyleSheet, View, Text} from 'react-native';
import {Slider} from 'react-native-elements';
import React from 'react';
import colors from '../../../color';

function VideoTimeSlider(props) {
  // Estrai le props per leggibilità
  let minTime = 0;
  let totalTime = props.videoTotalTime;
  let currentTime = props.videoCurrentTime;

  // Trasforma i secondi in DateTime formattabili all'utente testualmente
  let totalTimeText =
    totalTime != null
      ? new Date(totalTime * 1000).toISOString().slice(11, 19)
      : '00:00';
  let currentTimeText =
    currentTime != null
      ? new Date(currentTime * 1000).toISOString().slice(11, 19)
      : '00:00';

  // Tieni una variabile per mantenere traccia di dove salta il video.
  let internalValueChange = currentTime;

  // Nascondi lo slider se non abbiamo nessun valore.
  if (currentTime === 0 && totalTime === 0) {
    return <View />;
  }

  return (
    <View style={styles.row}>
      {/* Visualizza il tempo corrente del video */}
      <Text style={styles.currentTime}>{currentTimeText}</Text>
      {/* Visualizza lo slider aggiornato in base al tempo corrente */}
      <Slider
        style={styles.timeSlider}
        minimumValue={minTime}
        thumbTintColor={colors.lightBlue}
        thumbStyle={styles.thumbStyle}
        maximumValue={totalTime}
        value={internalValueChange}
        onValueChange={value => {
          internalValueChange = value;
        }}
        onSlidingComplete={value => {
          // Aggiorna la percentuale di completamento solamente a fine slide, così da non intasare il listener
          console.log(
            'CAMBIO AVANZAMENTO VIDEO TRAMITE SLIDER',
            internalValueChange,
          );
          props.onValueChange(internalValueChange);
        }}
      />
      {/* Visualizza il tempo totale del video */}
      <Text style={styles.totalTime}>{totalTimeText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  currentTime: {
    color: 'black',
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
    marginRight: 5,
  },
  totalTime: {
    color: 'black',
    fontSize: 16,
    flex: 1,
    marginRight: 10,
    marginLeft: 5,
  },
  timeSlider: {
    flex: 3,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  thumbStyle: {
    height: 25,
    width: 25,
  },
});

export default VideoTimeSlider;
