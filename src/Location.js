import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFields from './hooks/useFields';
import {
  APIProvider,
  ControlPosition,
  MapControl,
  Map,
  useMap,
  AdvancedMarker,
  useAdvancedMarkerRef
} from "@vis.gl/react-google-maps";
import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Alert
} from 'reactstrap';
import './Location.css'

const Location = ({Places, trips, setTrips, addTrip, currUser, setOnHomepage}) => {
    setOnHomepage(false);
    const position = {};
    navigator.geolocation.getCurrentPosition((location) => {
        position.lat = location.coords.latitude;
        position.lng = location.coords.longitude;
      });
     
    if (position.lat === undefined && position.lng === undefined) {
        position.lat = 38.500000;
        position.lng = -98.000000;
    } 
 
    const navigate = useNavigate();
    
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [location1, setLocation1] = useState(null);
    const [location2, setLocation2] = useState(null);
    const [trip, setTrip] = useState([]);

    const [formData, handleChange] = useFields({
        tripName: ''
      })
    
    const [errorHandler, setErrorHandler] = useState('')

    useEffect(() => {
        if(!selectedPlace) return;
        if(selectedPlace.formatted_address === undefined || location1 && selectedPlace.formatted_address === location1.address) return;
        if(!location1) {
            setLocation1({name: selectedPlace.name, address: selectedPlace.formatted_address, lat: selectedPlace.geometry.location.lat(), lng: selectedPlace.geometry.location.lng()})
        } else if (selectedPlace.name !== '') {
            setLocation2({name: selectedPlace.name, address: selectedPlace.formatted_address, lat: selectedPlace.geometry.location.lat(), lng: selectedPlace.geometry.location.lng()})
        }
        
    }, [selectedPlace])
    
    useEffect(() => {
        if(!selectedPlace) return;
        if(selectedPlace.formatted_address === undefined || location1 && selectedPlace.formatted_address === location1.address) return;
        if(!location1) {
            setLocation1({name: selectedPlace.name, address: selectedPlace.formatted_address, lat: selectedPlace.geometry.location.lat(), lng: selectedPlace.geometry.location.lng()})
        } else if (selectedPlace.name !== '') {
            setLocation2({name: selectedPlace.name, address: selectedPlace.formatted_address, lat: selectedPlace.geometry.location.lat(), lng: selectedPlace.geometry.location.lng()})
        }
        
    }, [selectedPlace])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(formData.tripName.length < 1 || formData.tripName.length > 25) {
            setErrorHandler('Min length: 1; Max length: 25');
        } else {
            const tripArr = [];
            let newTrips;
            tripArr.push(trip);
            if(currUser !== '') {
                newTrips = await addTrip(tripArr, formData.tripName)
            } else {
                newTrips = [{tripDetails: trip, name: formData.tripName}];
            }
            
            const tripsArr = JSON.parse(trips);
            newTrips.map(newTrip => {
                tripsArr.push(newTrip);
            })

            setTrips(JSON.stringify(tripsArr));
            navigate('/trips', { state: { trip }});
        }
    }

    const handleAddStop = () => {
        setTrip(trip => [...trip, { location1, location2 }])
        setSelectedPlace(null);
        setLocation1(null);
        setLocation2(null);
    }
    
    const clearStop = () => {
        setSelectedPlace(null);
        setLocation1(null);
        setLocation2(null);
    }

    return (
        <div className="App" style={{ height: '50vh' }}>
            <APIProvider apiKey={process.env.REACT_APP_API_KEY}>
                { location1 && <p>Departing from: {location1.name}</p>}
                { location2 && <p>Arriving at: {location2.name}</p>}
                {(!selectedPlace || selectedPlace && selectedPlace.formatted_address === undefined) && !location1 && <p>Departing from:</p>}
                {location1 && !location2 && <p>Arriving at:</p>}
                <Map 
                    defaultZoom={8} 
                    defaultCenter={position} 
                    mapId={process.env.REACT_APP_MAP_ID}
                    fullscreenControl={false}
                    mapTypeControl={false}
                >
                    <AdvancedMarker ref={markerRef} position={null}/> 
                </Map>
                {!location2 && <MapControl position={ControlPosition.TOP} size={20}>
                    <div className="autocomplete-control">
                        <Places onPlaceSelect={setSelectedPlace} />
                    </div>
                </MapControl>}
                <MapHandler place={selectedPlace} marker={marker} />
                
                { location2 && <Button className='mt-2 mb-3' onClick={handleAddStop}>Add to Trip</Button>}
                { location1 && <Button className='ms-2 mt-2 mb-3' onClick={clearStop}>Reset Stop</Button>}
                {
                    trip.length > 0 && trip.map(stop => (
                        <div>
                            <p>Stop {trip.indexOf(stop) + 1}: {stop.location1.name} to {stop.location2.name}</p>
                        </div>
                    ))
                }
                { !location1 && !location2 && trip.length > 0 && 
                    <div>
                        <Form className="col-md-4 mt-3 py-4 px-4 container-fluid rounded" onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="tripName" className="fw-bold trip-form-label">
                                Enter Trip Name:
                                </Label>
                                <Input
                                id="tripName"
                                name="tripName"
                                value={formData.tripName}
                                onChange={handleChange}
                                type="text"
                                />
                            </FormGroup>
                            {errorHandler && <div>
                                <Alert className='mt-3 mb-1' color='danger'>
                                    {errorHandler}
                                </Alert>
                            </div>}
                            <div className="d-grid gap-2">
                                <Button color="primary">
                                    Finalize Trip
                                </Button>
                            </div>    
                        </Form>
                    </div>}
            </APIProvider>
        </div>
  )
}

const MapHandler = ({ place, marker }) => {
    const map = useMap();
    
    useEffect(() => {
      if (!map || !place || !marker) return;
      
      if (place.geometry?.viewport) {
        map.fitBounds(place.geometry?.viewport);
      }
      marker.position = place.geometry?.location;
    }, [map, place, marker]);
    return null;
  };

export default Location
