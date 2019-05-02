import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react';
import Geocode from "react-geocode";

const mapStyles = {
  width: '300px',
  height: '500px'
};
export class MapContainer extends Component {
  state = {
    showingInfoWindow: false,  //Hides or the shows the infoWindow
    activeMarker: {},          //Shows the active marker upon click
    selectedPlace: {},          //Shows the infoWindow to the selected place upon a marker
    lat: null,
    lng: null
  };
  componentDidMount() {
    this.getLocation();
  }
  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };
  getLocation() {
    Geocode.setApiKey('AIzaSyCtXovrlAq5but4UH_mqmq9SVUsF53bGSc');
    Geocode.fromAddress(this.props.address).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        this.setState({
          lat: lat,
          lng: lng
        })
      },
      error => {
      }
    );
  }

  render() {
    const { lat, lng } = this.state;
    if (lat && lng)
      return (
        <Map
          google={this.props.google}
          zoom={14}

          style={mapStyles}
          initialCenter={{
            lat: lat,
            lng: lng
          }}
        >
          <Marker
            title={this.props.name}
            name={this.props.name}
            position={{
              lat: lat,
              lng: lng
            }} />
        </Map>
      );
    return "Loading...";
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCtXovrlAq5but4UH_mqmq9SVUsF53bGSc'
})(MapContainer)    