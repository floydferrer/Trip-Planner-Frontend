import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import ImageSlider from './ImageSlider';
import {
    Button
  } from 'reactstrap'

const TripDetails = ({ trips, token, setOnHomepage }) => {
  setOnHomepage(false);
  const googleAPI = 'AIzaSyD6e4FLc4yFQQmgsPM63mjE68FCVbmzzOY'
  const googleMapImageUrl = 'http://maps.googleapis.com/maps/api/staticmap?center='
  const mapId = '906f7fea4371a6eb'
  
  const { tripNumber } = useParams();
  const navigate = useNavigate();

  const JSONtrips = JSON.parse(trips)
  const stopImages = [];
  const stopNames = [];
  if(JSONtrips.length === 0 || JSONtrips.length < tripNumber) return <Navigate to="/trips" />
  if(token !== '') {
    if(JSONtrips[tripNumber - 1].stops.length === 0) return <Navigate to="/trips" />
  }
  const trip = JSONtrips[tripNumber - 1]
  
  if(token === '') {
    for(let JSONtrip of JSONtrips) {
      stopImages.push([])
      stopNames.push([])
      for (let stop of JSONtrip.tripDetails) {
        stop.image = `${googleMapImageUrl}${stop.location2.lat},${stop.location2.lng}&zoom=16&size=400x350&sensor=false&marker=${stop.location2.lat},${stop.location2.lng}&scale=2&map_id=${mapId}&key=${googleAPI}`
        stopImages[JSONtrips.indexOf(JSONtrip)].push(stop.image);
        stopNames[JSONtrips.indexOf(JSONtrip)].push(`${stop.location1.name} to ${stop.location2.name}`)
      }
    }
  } else {
    for(let JSONtrip of JSONtrips) {
      stopImages.push([])
      stopNames.push([])
      for (let stop of JSONtrip.stops) {
        stop.image = `${googleMapImageUrl}${stop.location2.lat},${stop.location2.lng}&zoom=16&size=400x350&sensor=false&marker=${stop.location2.lat},${stop.location2.lng}&scale=2&map_id=${mapId}&key=${googleAPI}`
        stopImages[JSONtrips.indexOf(JSONtrip)].push(stop.image);
        stopNames[JSONtrips.indexOf(JSONtrip)].push(`${stop.location1.name} to ${stop.location2.name}`)
      }
    }
  }

  const handleNavigate = (location1, location2) => { 
    navigate('/directions', { state: { tripNumber, location1, location2 }});
  }

  return (
    <div
      style={{
        maxWidth: '1200px',
        width: '100%',
        aspectRatio: '8 / 7',
        margin: '0 auto'
      }}
    >
        <ImageSlider stopImages={stopImages[tripNumber - 1]} stopNames={stopNames[tripNumber - 1]} />
        <Button onClick={() => token === '' ? handleNavigate(trip.tripDetails[0].location1, trip.tripDetails[0].location2) : handleNavigate(trip.stops[0].location1, trip.stops[0].location2)}>Start Trip</Button>
    </div>
  )
}

export default TripDetails
