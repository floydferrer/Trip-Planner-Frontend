import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useLocalStorageState from './hooks/useLocalStorageState';
import './App.css';
import Homepage from './Homepage';
import PageNav from './PageNav';
import Login from './Login';
import Logout from './Logout';
import Register from './SignUp';
import Places from './Places';
import Location from './Location';
import Directions from './Directions';
import Trips from './Trips';
import TripDetails from './TripDetails';
import NotFound from './NotFound';
import TripPlannerApi from "./api/api";

function App() {
  const [trips, setTrips] = useLocalStorageState('trips', '[]');
  const [token, setToken] = useLocalStorageState('token', '');
  const [currUser, setCurrUser] = useLocalStorageState('currUser', '')
  const [onHomepage, setOnHomepage] = useLocalStorageState('homepage', 'false')

  const registerUser = async (user) => {
    try {
      const res = await TripPlannerApi.registerUser(user)
      setToken(res.token)
      const newCurrUser = await TripPlannerApi.getCurrUser(user.username, res)
      setCurrUser(JSON.stringify(newCurrUser))
      if(trips !== '[]') {
        const username = newCurrUser.username;
        await TripPlannerApi.addTrip(username, JSON.parse(trips), token)
        const t = await TripPlannerApi.getTrips(user.username, res)
        setTrips(JSON.stringify(t.trips))
      }
    } catch (error) {
      return error
    } 
  }
  
  const loginUser = async (user) => {
    try {
      const res = await TripPlannerApi.loginUser(user)
      setToken(res.token)
      const newCurrUser = await TripPlannerApi.getCurrUser(user.username, res)
      setCurrUser(JSON.stringify(newCurrUser))
      let t = await TripPlannerApi.getTrips(user.username, res)
      if(t === '') return;
      setTrips(JSON.stringify(t.trips))
    } catch (error) {
      return error
    }
  }

  const addTrip = async (tripDetails, tripName) => {
    let username = '';
    if(currUser !== '') {
      const JSONCurrUser = JSON.parse(currUser);
      username = JSONCurrUser.username;
    }
    const newTrips = await TripPlannerApi.addTrip(username, { tripDetails, tripName }, token)
    return newTrips;
  }

  const deleteTrip = async (tripId) => {
    await TripPlannerApi.deleteTrip(tripId, token)
  }

  return (
    <div className='App'>
      <BrowserRouter>
        <PageNav token={token} currUser={currUser} onHomepage={onHomepage}/>
        <Routes>
          <Route exact path="/" element={<Homepage onHomepage={onHomepage} setOnHomepage={setOnHomepage} />}/>
          <Route exact path="/login" element={<Login loginUser={loginUser} onHomepage={onHomepage} setOnHomepage={setOnHomepage} />}/>
          <Route exact path="/logout" element={<Logout setTrips={setTrips} setToken={setToken} setCurrUser={setCurrUser} onHomepage={onHomepage} setOnHomepage={setOnHomepage} />} />
          <Route exact path="/signup" element={<Register registerUser={registerUser} trips={trips} addTrip={addTrip} onHomepage={onHomepage} setOnHomepage={setOnHomepage}/>}/>
          <Route exact path="/search" element={<Location Places={Places} trips={trips} setTrips={setTrips} addTrip={addTrip} currUser={currUser} onHomepage={onHomepage} setOnHomepage={setOnHomepage}/>}/>
          <Route exact path="/directions" element={<Directions trips={trips} setTrips={setTrips} deleteTrip={deleteTrip} token={token} onHomepage={onHomepage} setOnHomepage={setOnHomepage}/>}/>
          <Route exact path="/trips" element={<Trips trips={trips} token={token} onHomepage={onHomepage} setOnHomepage={setOnHomepage}/>}/>
          <Route exact path="/trips/:tripNumber" element={<TripDetails trips={trips} token={token} onHomepage={onHomepage} setOnHomepage={setOnHomepage}/>}/>
          <Route exact path="*" element={<NotFound />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
