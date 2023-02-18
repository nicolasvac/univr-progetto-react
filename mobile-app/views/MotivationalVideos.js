import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  FlatList,
  ScrollView, Alert,
} from 'react-native';
import color from '../color';
import {Divider} from 'react-native-elements';
import Hamburger from '../icons/hamburger.svg';
import Logout from '../icons/logout.svg';

import Play from '../icons/play.svg';
import Pause from '../icons/pause.svg';
import Dot from '../icons/dry-clean.svg';
import {useTranslation} from 'react-i18next';

// teniamo l'import di YoutubeIframeRef per il commento sulla variabile e intellisense
// eslint-disable-next-line no-unused-vars
import YoutubePlayer, {YoutubeIframeRef} from 'react-native-youtube-iframe';
import {get, logout} from '../api/restManager';
import LogoutOverlay from '../components/LogoutOverlay';

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
    d0[0].link.split('/')[2] === 'youtu.be'
      ? setVideoId(d0[0].link.split('/')[3])
      : setVideoId(d0[0].link.split('v=')[1]);
    setVideos(d0);
  };

  const toggleOverlayLogOut = () => {
    setOverlayLogoutVisible(!overlayLogoutVisible);
  };

  const togglePlaying = () => {
    setPlaying(prev => !prev);
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

  const changeVideoPlayerTime = async time => {
    // Verifica che il parametro inviato sia effettivamente un numero.
    if (isNaN(time)) {
      Alert.alert(
        'Errore',
        'Errore interno. Il tempo selezionato non è valido. Riprova.',
      );
      return;
    }

    // Ottieni il riferimento al video player.
    const videoPlayer = getVideoPlayerRef();

    if (videoPlayer == null) {
      Alert.alert(
        'Errore!',
        'Errore interno. Attendere la visualizzazione completa del video player. Riprova.',
      );
      return;
    }

    // Ottieni il tempo di durata del video (in secondi)
    const totalVideoTime = await videoPlayer.getDuration();

    // Ottieni il tempo corrente del video (in secondi)
    const currentVideoTime = await videoPlayer.getCurrentTime();

    // Calcola il nuovo tempo a cui mandare il player
    const newVideoTime = currentVideoTime + time;

    if (newVideoTime >= totalVideoTime) {
      // Se il nuovo tempo a cui mandare il player supera la durata totale del video,
      // procediamo a far terminare il video direttamente.
      videoPlayer.seekTo(totalVideoTime);
      setPlaying(false);
    } else if (newVideoTime <= 0) {
      // Se il nuovo tempo a cui mandare il player è inferiore o uguale a zero,
      // facciamo ripartire il video dall'inizio.
      videoPlayer.seekTo(0);
    } else {
      // Se nessuno dei casi precedenti è vero, semplicemente cambiamo il tempo del video.
      videoPlayer.seekTo(newVideoTime);
    }
  };

  const changeVideoLinkPlaying = newVideoLink => {
    const newVideoId =
      newVideoLink.split('/')[2] === 'youtu.be'
        ? newVideoLink.split('/')[3]
        : newVideoLink.split('v=')[1];

    setVideoId(newVideoId);
    setPlaying(true);
  };

  const ItemList = ({title, id, link, index}) => (
    <>
      <View style={styles.itemContent} flexDirection={'row'}>
        <View flexDirection={'column'} width={'100%'}>
          <View
            marginBottom={20}
            marginLeft={5}
            marginRight={5}
            marginTop={5}
            flexDirection={'row'}
            justifyContent={'space-between'}>
            <Dot style={styles.itemIcon} fill={color.black}/>
            <Text style={styles.itemTextLong}>{title}</Text>
            <Pressable
              onPress={() => {
                console.log('CAMBIO VIDEO IN', id, link);
                changeVideoLinkPlaying(link);
              }}
              android_ripple={{color: color.lightBlue, borderless: true}}>
              <Play style={styles.itemIconPlay}/>
            </Pressable>
          </View>
        </View>
      </View>
      <Divider orientation="horizontal"/>
    </>
  );

  const renderItemList = ({item, index}) => (
    <ItemList title={item.title} index={index} id={item.id} link={item.link}/>
  );

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
              <View pointerEvents="none">
                <YoutubePlayer
                  ref={videoPlayerRef}
                  height={250}
                  play={playing}
                  videoId={videoId}
                />
              </View>
            </Pressable>
          </View>
          <View
            style={{
              alignItems: 'center',
            }}>
            <Pressable
              onPress={() => {
                setPlaying(!playing);
              }}
              android_ripple={{color: color.edalabBlue, borderless: false}}
              backgroundColor={color.lightBlue}
              borderRadius={7}
              width={60}
              padding={5}
              alignItems={'center'}
              margin={10}>
              {playing ? (
                <Pause height={'25'} width={'40'} fill={'white'}/>
              ) : (
                <Play height={'25'} width={'40'} fill={'white'}/>
              )}
            </Pressable>
          </View>
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
  cardTitle: {
    color: color.black,
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemContent: {
    marginTop: 18,
    backgroundColor: color.white,
  },
  itemTextLong: {
    color: color.black,
  },
  itemTextShort: {
    color: color.black,
  },
  itemIcon: {
    width: 8,
    height: 8,
    color: color.black,
    marginTop: 7,
  },
  itemIconPlay: {
    width: 25,
    height: 25,
    color: color.black,
  },
  containerVideo: {
    padding: 3,
    backgroundColor: color.black,
    margin: 10,
    borderRadius: 7,
    borderColor: color.gray,
    borderWidth: 1,
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    color: color.black,
    backgroundColor: color.black,
  },
});
