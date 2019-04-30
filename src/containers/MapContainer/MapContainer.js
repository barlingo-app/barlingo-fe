import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react';

const mapStyles = {
    width: '100%',
    height: '100%'
};
export class MapContainer extends Component {
    state = {
        showingInfoWindow: false,  //Hides or the shows the infoWindow
        activeMarker: {},          //Shows the active marker upon click
        selectedPlace: {}          //Shows the infoWindow to the selected place upon a marker
    };
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

    render() {
        return (
            <Map
                google={this.props.google}
                zoom={14}

                style={mapStyles}
                initialCenter={{
                    lat: -1.2884,
                    lng: 36.8233
                }}
            />
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyBGK0OEIYkPt3xBiMXmOvSn7LtK7zegk2U'
})(MapContainer)    