import React from 'react'
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
} from 'reactstrap';
import './Trips.css';

const Trips = ({trips, setOnHomepage}) => {
  setOnHomepage(false);
  const navigate = useNavigate();  
  const JSONtrips = JSON.parse(trips)

  const handleAddNewTrip = () => {
    navigate('/search');
  }

  return (
    <div className='container'>
      <h2>Upcoming Trips:</h2>
      {JSONtrips && JSONtrips.map(trip => (
        <div className='row justify-content-center'>
            <div className='col-md-4 col-8' onClick={() => navigate(`/trips/${JSONtrips.indexOf(trip) + 1}`)}>
              <Card className='card mt-2 bg-transparent border border-5 trips'>
                <CardBody>
                  <CardTitle>
                    {trip.name}
                  </CardTitle>
                </CardBody>
              </Card>
            </div>
        </div>
      ))}
      <Button className='mt-2 mb-2' onClick={handleAddNewTrip}>Add new trip</Button>
    </div>
  )
}

export default Trips
