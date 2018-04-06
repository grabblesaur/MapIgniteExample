import React, { Component } from 'react'
import { View, Dimensions, PermissionsAndroid, Platform } from 'react-native'
import { Images } from '../Themes'

// Styles
import styles from './Styles/LaunchScreenStyles'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import NightMapStyle from './Styles/NightMapStyle.json'

let { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE = 0
const LONGITUDE = 0
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export default class LaunchScreen extends Component {

  constructor () {
    super()
    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }
    }
  }

  requestAccessFineLocation () {
    try {
      const granted = PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Cool Photo App Camera Permission',
          'message': 'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera')
        this.getLocation()
      } else {
        console.log('Camera permission denied')
      }
    } catch (err) {
      console.warn(err)
    }
  }

  getLocation () {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }
        })
      },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    )
    this.watchID = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        })
      }
    )
  }

  componentDidMount () {
    if (Platform.OS === 'ios') {
      this.getLocation()
    } else {
      this.requestAccessFineLocation()
    }
  }

  componentWillUnmount () {
    navigator.geolocation.clearWatch(this.watchID)
  }

  render () {
    return (
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.container}
        customMapStyle={NightMapStyle}
        showsUserLocation
        region={this.state.region}
        onRegionChange={region => this.setState({region})}
        onRegionChangeComplete={region => this.setState({region})}
      >
        <MapView.Marker
          coordinate={this.state.region}
        />
      </MapView>
    )
  }
}
