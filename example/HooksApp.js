import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import MapView, {ProviderPropType, Polyline} from 'react-native-maps';

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 38.47349;
const LONGITUDE = -90.347914;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

const HooksApp = props => {
  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [polylines, setPolylines] = useState([]);
  const [editing, setEditing] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);

  const onPanDrag = e => {
    if (!editing) {
      setEditing({
        id: id++,
        coordinates: [e.nativeEvent.coordinate],
      });
    } else {
      setEditing({
        ...editing,
        coordinates: [...editing.coordinates, e.nativeEvent.coordinate],
      });
    }
  };

  const finish = () => {
    setPolylines([...polylines, editing]);
    setEditing(null);
    setDrawing(false);
    setIsScrollEnabled(true);
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={props.provider}
        style={styles.map}
        initialRegion={region}
        showsUserLocation
        scrollEnabled={isScrollEnabled}
        showsMyLocationButton
        onPanDrag={e => (drawing ? onPanDrag(e) : null)}>
        {polylines.map(polyline => (
          <Polyline
            key={polyline.id}
            coordinates={polyline.coordinates}
            strokeColor="#000"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={1}
          />
        ))}
        {editing && (
          <Polyline
            key="editingPolyline"
            coordinates={editing.coordinates}
            strokeColor="#F00"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={1}
          />
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        {!drawing && (
          <TouchableOpacity
            onPress={() => {
              setDrawing(true);
              setIsScrollEnabled(false);
            }}
            style={[styles.bubble, styles.button]}>
            <Text>Draw!</Text>
          </TouchableOpacity>
        )}
        {drawing && (
          <TouchableOpacity
            onPress={() => finish()}
            style={[styles.bubble, styles.button]}>
            <Text>Done!</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.eventList}>
        <ScrollView>
          <Text>EDITING: {JSON.stringify(editing)}</Text>
          <Text>DRAWING: {drawing.toString()}</Text>
          {polylines.map(polyline => (
            <Text key={`polyline-text-${polyline.id}`}>
              Polyline boundaries for polyline {polyline.id} are:{' '}
              {JSON.stringify(polyline.coordinates)}
            </Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

HooksApp.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  callout: {
    width: 60,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  event: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 8,
  },
  eventData: {
    fontSize: 10,
    fontFamily: 'courier',
    color: '#555',
  },
  eventName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#222',
  },
  eventList: {
    position: 'absolute',
    top: height / 2,
    left: 0,
    right: 0,
    bottom: 0,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: height / 2,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
    bottom: '110%',
  },
});

export default HooksApp;
