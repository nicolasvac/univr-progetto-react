import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  FlatList,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import color from '../color';
import Hamburger from '../icons/hamburger.svg';
import Logout from '../icons/logout.svg';

import {useTranslation} from 'react-i18next';

// teniamo l'import di YoutubeIframeRef per il commento sulla variabile e intellisense
// eslint-disable-next-line no-unused-vars
import YoutubePlayer, {YoutubeIframeRef} from 'react-native-youtube-iframe';
import {get, logout} from '../api/restManager';
import LogoutOverlay from '../components/LogoutOverlay';
import ItemList from './components/MotivationalVideos/ItemList';
import VideoTimeSlider from './components/MotivationalVideos/VideoTimeSlider';
import VideoControls from './components/MotivationalVideos/VideoControls';

export default function MotivationalVideos({navigation}) {
  const {t} = useTranslation();

  /**
   * Utilizziamo questa variabile per mantenere una referenza con il video player,
   * e consentirci d'inviare comandi a componente montato.
   * @type {React.MutableRefObject<YoutubeIframeRef>}
   */
  const videoPlayerRef = useRef(null);

  const [overlayLogoutVisible, setOverlayLogoutVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [videoId, setVideoId] = useState('');
  const [videos, setVideos] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [videoTotalTime, setVideoTotalTime] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [currentVideoLink, setCurrentVideoLink] = useState(0);

  /**
   * Variabile utilizzata per tenere traccia dell'interval per aggiornare
   * il tempo corrente del video.
   * @type {number|null}
   */
  let videoCurrentTimeInterval = null;

  useEffect(() => {
    getData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout((navigation = {navigation}));
    } catch (err) {
      console.log('IMPOSSIBILE GESTIRE ERRORE LOGOUT', err);
    }
  };

  async function getData() {
    try {
      let data = await get('/multimedia');
      // console.log("$$ DBG getData success", data)
      // data = JSON.parse(JSON.stringify(data))
      if (data) {
        setData(data);
      }
    } catch (error) {
      // There was an error on the native side
      console.log('$$ DBG MotivationalVideos getData error', error);
      if (error && error.toString().includes('Signature has expired')) {
        await handleLogout();
      }
    }
  }

  const setData = videosData => {
    let d0 = [];

    console.log('RISPOSTA SUI VIDEO', videosData);

    // In caso di refresh, se non abbiamo dati non visualizzare errori.
    if (videosData == null) {
      return;
    }

    videosData.videos.forEach(element => {
      let new_item = {
        id: element.id,
        link: element.video_link,
        title: element.title,
        description: element.description,
      };
      // console.log("$$new_item",new_item)
      d0.push(new_item);
    });
    // console.log("$$List", d0)
    setVideos(d0);
    changeVideoLinkPlaying(d0[0].link);
  };

  const toggleOverlayLogOut = () => {
    setOverlayLogoutVisible(!overlayLogoutVisible);
  };

  /**
   * Questa funzione ci consente di sapere se il video player è stato caricato
   * e visualizzato come componente react.
   * @returns {boolean} False se non caricato
   */
  const isVideoPlayerAvailable = () => {
    return videoPlayerRef != null && videoPlayerRef.current != null;
  };

  /**
   * Questa funzione ritorna il riferimento al video player
   * se caricato nel componente. Sostituisce l'uso diretto della variabile
   * videoPlayerRef per evitare di dover scrivere sempre ".current",
   * inoltre aiuta l'ide a sapere i tipi.
   * @returns {YoutubeIframeRef|null} Null se non caricato
   */
  const getVideoPlayerRef = () => {
    // Se non abbiamo a disposizione ancora il player (il componente sta ancora caricando),
    // non diamo la possibilità all'utente di eseguire funzioni.
    if (isVideoPlayerAvailable()) {
      return videoPlayerRef.current;
    } else {
      return null;
    }
  };

  /**
   * Consente di cambiare il tempo di riproduzione del video.
   * @param time Tempo di cui andare avanti o indietro in secondi.
   * @returns {Promise<void>}
   */
  const changeVideoPlayerTimeIncrementally = async time => {
    // Verifica che il parametro inviato sia effettivamente un numero.
    if (isNaN(time)) {
      Alert.alert(t('error:generic'), t('error:wrongVideoTime'));
      return;
    }

    console.log('CAMBIO IL TEMPO DEL VIDEO DI', time);

    // Ottieni il riferimento al video player.
    const videoPlayer = getVideoPlayerRef();

    if (videoPlayer == null) {
      Alert.alert(t('error:generic'), t('error:videoPlayerNotReady'));
      return;
    }

    // Ottieni il tempo corrente del video (in secondi)
    const currentVideoTime = await videoPlayer.getCurrentTime();

    // Calcola il nuovo tempo a cui mandare il player
    const newVideoTime = currentVideoTime + time;

    if (newVideoTime >= videoTotalTime) {
      // Se il nuovo tempo a cui mandare il player supera la durata totale del video,
      // procediamo a far terminare il video direttamente.
      videoPlayer.seekTo(videoTotalTime);
      setPlaying(false);
      setVideoCurrentTime(videoTotalTime);
    } else if (newVideoTime <= 0) {
      // Se il nuovo tempo a cui mandare il player è inferiore o uguale a zero,
      // facciamo ripartire il video dall'inizio.
      videoPlayer.seekTo(0);
      setVideoCurrentTime(0);

      if (!playing) {
        setPlaying(true);
      }
    } else {
      // Se nessuno dei casi precedenti è vero, semplicemente cambiamo il tempo del video.
      videoPlayer.seekTo(newVideoTime);
      setVideoCurrentTime(0);
    }
  };

  const changeVideoPlayerTimeDirectly = newVideoTime => {
    // Verifica che il parametro inviato sia effettivamente un numero.
    if (isNaN(newVideoTime)) {
      Alert.alert(t('error:generic'), t('error:wrongVideoTime'));
      return;
    }

    console.log('CAMBIO IL TEMPO DEL VIDEO DIRETTO', newVideoTime);

    // Ottieni il riferimento al video player.
    const videoPlayer = getVideoPlayerRef();

    if (videoPlayer == null) {
      Alert.alert(t('error:generic'), t('error:videoPlayerNotReady'));
      return;
    }

    videoPlayer.seekTo(newVideoTime);
    setVideoCurrentTime(newVideoTime);
  };

  /**
   * Questa funzione consente di cambiare il video in esecuzione,
   * passando come parametro un nuovo link di youtube completo.
   * La funzione provvederà a estrarre il l'id del video automaticamente.
   * @param {string} newVideoLink
   */
  const changeVideoLinkPlaying = newVideoLink => {
    setCurrentVideoLink(newVideoLink);

    const newVideoId =
      newVideoLink.split('/')[2] === 'youtu.be'
        ? newVideoLink.split('/')[3]
        : newVideoLink.split('v=')[1];

    setVideoId(newVideoId);
    setVideoCurrentTime(0);
    setPlaying(true);
  };

  /**
   * Questa funzione viene invocata quando il video player è pronto.
   * Ha il compito di resettare il tempo corrente del video,
   * e d'impostare il tempo di durata totale del video, informazione
   * accessibile solo quando il video player è pronto.
   * @returns {Promise<void>}
   */
  const videoPlayerReadyEvent = async () => {
    stopCurrentTimeInterval();
    console.log('VIDEO PLAYER PRONTO');
    setVideoCurrentTime(0);
    const newVideoTotalTime = Math.round(
      await getVideoPlayerRef().getDuration(),
    );
    setVideoTotalTime(newVideoTotalTime);
    console.log('NUOVO TEMPO TOTALE VIDEO', newVideoTotalTime);
  };

  /**
   * Questa funzione viene utilizzata da FlexList per renderizzare il componente
   * del video. In particolare, una sorta di ListTile che fa vedere il nome del video
   * e consente di riprodurlo.
   * @param {object} item
   * @param {number} index
   * @returns {JSX.Element}
   */
  const renderItemList = ({item, index}) => (
    <ItemList
      item={item}
      isCurrentlyPlayed={item.link === currentVideoLink}
      onPress={link => {
        console.log('CAMBIO VIDEO IN', link);
        changeVideoLinkPlaying(link);
      }}
    />
  );

  // Calcola dinamicamente l'altezza del video player.
  // Teniamo sempre un minimo di 200px come richiesto da specifiche della libreria.
  // Se possibile, 1/4 dell'altezza rende il player carino.
  const videoPlayerHeight = Math.min(Dimensions.get('screen').height / 4, 200);

  /**
   * Questa funzione viene utilizzata per far partire un intervallo che ogni 500ms
   * prende il tempo corrente dal video e lo aggiorna nel nostro state.
   */
  const startCurrentTimeInterval = () => {
    // Non far partire un altro intervallo se già presente.
    if (videoCurrentTimeInterval != null) {
      console.log('AVVIO TIMER RICHIESTO MA GIA AVVIATO.');
      return;
    }

    console.log('AVVIO IL TIMER PER IL TEMPO CORRENTE DEL VIDEO');
    videoCurrentTimeInterval = setInterval(async () => {
      setVideoCurrentTime(await getVideoPlayerRef().getCurrentTime());
    }, 500);
  };

  /**
   * Questa funzione viene utilizzata per fermare l'intervallo
   * che tiene traccia del tempo corrente del video.
   */
  const stopCurrentTimeInterval = () => {
    console.log('FERMO IL TIMER PER IL TEMPO CORRENTE DEL VIDEO');
    clearInterval(videoCurrentTimeInterval);
    videoCurrentTimeInterval = null;
  };

  /**
   * Questa funzione viene utilizzata per gestire gli stati del video player.
   * Al cambio di alcuni stati, viene fatto partire / viene fermato il timer
   * per tenere traccia del tempo corrente del video.
   * @param {string} state
   */
  const videoPlayerOnChangeState = state => {
    console.log('CAMBIO STATE DEL VIDEO PLAYER', state);

    switch (state) {
      case 'buffering':
      case 'paused':
      case 'ended':
      case 'unstarted':
        stopCurrentTimeInterval();
        break;
      case 'playing':
        startCurrentTimeInterval();
        break;
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => navigation.openDrawer()}
            android_ripple={{color: color.edalabBlue, borderless: false}}>
            <Hamburger style={styles.topBarIcon}/>
          </Pressable>
          <Text style={styles.topBarText}>{t('nav:motivationalvideos')}</Text>
          <Pressable
            onPress={toggleOverlayLogOut}
            android_ripple={{color: color.edalabBlue, borderless: false}}>
            <Logout style={styles.topBarIcon}/>
          </Pressable>
        </View>

        <ScrollView nestedScrollEnabled={true}>
          {/* VIDEO */}

          <View style={styles.containerVideo}>
            <Pressable
              onPress={() => {
                // handle or ignore
              }}
              onLongPress={() => {
                // handle or ignore
              }}>
              {/* Blocca qualsiasi tipologia di tocco in input sul video */}
              <View pointerEvents="none">
                {/* Includi il video player di youtube */}
                <YoutubePlayer
                  ref={videoPlayerRef}
                  height={videoPlayerHeight}
                  play={playing}
                  mute={isMuted}
                  videoId={videoId}
                  onReady={videoPlayerReadyEvent}
                  onChangeState={state => videoPlayerOnChangeState(state)}
                />
              </View>
            </Pressable>
          </View>
          {/* Includi i controlli tramite slider */}
          <VideoTimeSlider
            videoCurrentTime={videoCurrentTime}
            videoTotalTime={videoTotalTime}
            onValueChange={percentage =>
              changeVideoPlayerTimeDirectly(percentage)
            }
          />
          {/* Includi i controlli tramite bottoni interattivi */}
          <VideoControls
            isPlaying={playing}
            isMuted={isMuted}
            onVideoMuteChange={newIsMuted => setIsMuted(newIsMuted)}
            onPlayingChange={newIsPlaying => setPlaying(newIsPlaying)}
            onVideoTimeChange={newTime =>
              changeVideoPlayerTimeIncrementally(newTime)
            }
          />
          {/* VIDEO LIST */}
          <View style={styles.card}>
            <SafeAreaView style={styles.contentCardContainer}>
              <FlatList
                data={videos}
                renderItem={renderItemList}
                keyExtractor={item => item.id}
                nestedScrollEnabled={true}
              />
            </SafeAreaView>
          </View>

          <LogoutOverlay
            overlayLogoutVisible={overlayLogoutVisible}
            setOverlayLogoutVisible={setOverlayLogoutVisible}
            navigation={navigation}
          />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    paddingBottom: 20,
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.lightBlue,
    padding: 10,
  },
  topBarText: {
    color: color.white,
    fontSize: 25,
    fontWeight: 'bold',
  },
  topBarIcon: {
    width: 35,
    height: 35,
    color: color.white,
  },
  contentCardContainer: {
    margin: 15,
  },
  card: {
    backgroundColor: color.white,
    marginTop: 20,
    margin: 10,
    borderRadius: 7,
    borderColor: color.gray,
    borderWidth: 1,
    height: 300,
  },
  containerVideo: {
    padding: 3,
    backgroundColor: color.black,
    margin: 10,
    borderRadius: 7,
    borderColor: color.gray,
    borderWidth: 1,
  },
});
