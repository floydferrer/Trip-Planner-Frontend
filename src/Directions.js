import { useEffect, useState } from 'react';
import {useLocation, useNavigate, Navigate} from 'react-router-dom'; 
import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap
} from "@vis.gl/react-google-maps";
import {
  Button
} from 'reactstrap'

const Directions = ({ trips, setTrips, deleteTrip, token, setOnHomepage }) => {
  setOnHomepage(false);
  if (trips === '[]') return <Navigate to="/trips" />
  const position= { lat: 33.836160, lng: -118.159530 }

  return (
    <div style={{ height: '70vh'}}>
        <APIProvider apiKey={process.env.REACT_APP_API_KEY}>
           <Map 
                defaultZoom={14} 
                defaultCenter={position} 
                mapId={process.env.REACT_APP_MAP_ID}
                fullscreenControl={false}
                mapTypeControl={false}
            >
                <Steps trips={trips} setTrips={setTrips} deleteTrip={deleteTrip} token={token}/>
            </Map> 
        </APIProvider>
    </div>
  )
}

function Steps({ trips, setTrips, deleteTrip, token }) {
    const map = useMap();
    const navigate = useNavigate();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionsService] = useState();
    const [directionsRenderer, setDirectionsRenderer] = useState();
    const [route, setRoute] = useState([]);
    const [leg, setLeg] = useState({});
    const [stepCount, setStepCount] = useState(null);
    const [startRoute, setStartRoute] = useState(false);
    const [showDestination, setShowDestination] = useState(false)

    const { state } = useLocation();
    const JSONtrips = JSON.parse(trips)
    const currentTrip = JSONtrips[state.tripNumber - 1]

    useEffect(() => {
        if(!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    }, [routesLibrary, map])

    useEffect(() => {
        if(!directionsService || !directionsRenderer) return;
        
        directionsService
        .route({
            origin: state.location1.address,
            destination: state.location2.address,
            travelMode: window.google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: false,
        }).then(response => {
            directionsRenderer.setDirections(response)
            setRoute(response.routes);
            setLeg(response.routes[0].legs[0])
        })
    }, [directionsService, directionsRenderer])

    const handleBeginRoute = () => {
        setStartRoute(true)
        setStepCount(0);
    }
    
    const handleSteps = (direction) => {
        if(direction !== 'final') {
            if(direction === 'next') {
                setStepCount(stepCount => stepCount + 1)
            }  else {
                if (showDestination) {
                    setShowDestination(false)
                } else{
                    setStepCount(stepCount => stepCount - 1)
                }
            } 
        } else {
            setShowDestination(true)
        }
    }

    const handleCompleteStop = () => {
        if(token !== '') {
            currentTrip.stops.shift();
            if(currentTrip.stops.length === 0) {
                JSONtrips.splice([state.tripNumber - 1], 1)
                setTrips(JSON.stringify(JSONtrips))
                deleteTrip(currentTrip.id)
                navigate(`/trips`);
            } else {
                setTrips(JSON.stringify(JSONtrips))
                navigate(`/trips/${state.tripNumber}`);
            }
        } else {
            currentTrip.tripDetails.shift();
            if(currentTrip.tripDetails.length === 0) {
                JSONtrips.splice([state.tripNumber - 1], 1)
                setTrips(JSON.stringify(JSONtrips))
                navigate(`/trips`);
            } else {
                setTrips(JSON.stringify(JSONtrips))
                navigate(`/trips/${state.tripNumber}`);
            }
        }
    }

    if(route.length === 0) return <p>Loading...</p>;

    if(stepCount !== null && !showDestination) {
        map.setCenter({ lat: leg.steps[stepCount].start_point.lat(), lng: leg.steps[stepCount].start_point.lng() })
        map.setZoom(16)
    } else if (stepCount !==null) {
        map.setCenter({ lat: leg.steps[stepCount].end_point.lat(), lng: leg.steps[stepCount].end_point.lng() })
        map.setZoom(20)        
    }

    return (
        <div>
            {!startRoute && <div>
                <h2 className='mt-2'>{state.location1.name} to {state.location2.name}</h2>
                <p>Distance: {leg.distance.text}</p>
                <p>Duration: {leg.duration.text}</p>
                <Button onClick={handleBeginRoute}>Begin Route</Button>
            </div>}
            
            {startRoute &&  

            <p className='mt-2'>{leg.steps[stepCount].instructions.replaceAll(
                '<b>', ''
                ).replaceAll(
                '</b>', ''
                ).replaceAll(
                '<div style="font-size:0.9em">', ' - '
                ).replaceAll(
                '</div>', ''
                ).replaceAll(
                '/<wbr/>', ' '
                )}</p>
            }
            {startRoute && stepCount > 0 && <Button onClick={() => handleSteps('back')}>Previous</Button>}
            {startRoute && stepCount < leg.steps.length - 1 && <Button onClick={() => handleSteps('next')}>Next</Button>}
            {startRoute && !showDestination && stepCount === leg.steps.length - 1 && <Button onClick={() => handleSteps('final')}>Show Destination</Button>}
            {startRoute && showDestination && stepCount === leg.steps.length - 1 && <Button onClick={handleCompleteStop}>Complete destination</Button>}
        </div>
    )
}


export default Directions
