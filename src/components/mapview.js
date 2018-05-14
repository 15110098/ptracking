import MapView from 'react-native-maps';
import React from 'react'
import { Container,Text } from 'native-base';
import {View,
    StyleSheet,
    AsyncStorage,
    Alert
  } from 'react-native';
  import { PermissionsAndroid } from 'react-native';

  async function requestGPS() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'PTracking Permission',
          'message': 'PTracking needs access to your GPS ' +
                     'so you can track location.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the GPS")
      } else {
        console.log("GPS permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }

class MapViewScreen extends React.Component{

    static navigationOptions = ({ screenProps: { strings }}) => ({
        title: strings.mapview,
        header: null
    });
    constructor(props){
        super(props)
        let {firebase} = this.props.screenProps;
        this.locations = firebase.firestore().collection('locations');
        this.unsubscribe = null;
        this.state = {
            flex: 0,
            region: {
                latitude: 10.762622 ,
                longitude: 106.660172,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              },
              intervalId:'',
            loading:true
        };
    }


    pushLocation = (latitude,longitude) => {
        let {user} = this.props.screenProps;
        this.locations.add({
            latitude:latitude,
            longitude:longitude,
            timestamp: new Date().getTime(),
            user:{
                uid: user.uid,
                phoneNumber: user.phoneNumber,
                lastAccess: user.metadata.lastSignInTime
            }
        })
    }

    initLocation(){
        navigator.geolocation.getCurrentPosition(position=>{
            this.setState({
                region: Object.assign({},this.state.region,{
                    latitude: position.coords.latitude,
                    longitude:position.coords.longitude
                })
            });
            this.pushLocation(position.coords.latitude,position.coords.longitude)
        },
    err => {
       
    },
    { enableHighAccuracy: true, timeout: 100000, maximumAge: 1000 },) 
    }

    getLocation = () => {
        navigator.geolocation.getCurrentPosition(position=>{
            this.pushLocation(position.coords.latitude,position.coords.longitude)
        },
    err => {
       
    },
    { enableHighAccuracy: true, timeout: 100000, maximumAge: 1000 },) 
    }



    componentWillMount() {
        this.initLocation();
    }
    

    componentDidMount(){
        //this.unsubscribe = this.locations.onSnapshot(this.onCollectionUpdate) 
        setTimeout(()=>this.setState({flex: 1}),5000);
        var intervalId = setInterval(this.getLocation,8000);
        this.setState({intervalId: intervalId});
    }

    componentWillUnmount() {
        //this.unsubscribe();
        clearInterval(this.state.intervalId);
    }

    render(){
        return(
            <Container>
                <MapView
                style={{flex:this.state.flex}}
                cacheEnabled={false}
                showsMyLocationButton={true}
                showsUserLocation={true}
                followsUserLocation={true}
                region={this.state.region}
                loadingEnabled={true}
            />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      zIndex:-1,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  });

export default MapViewScreen