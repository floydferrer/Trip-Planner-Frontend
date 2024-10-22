import React from 'react'
import { Navigate } from 'react-router-dom'

const Logout = ({setToken, setCurrUser, setTrips }) => {
  setTrips('[]');  
  setToken('');
  setCurrUser('');
  
  
  return <Navigate to='/trips' />
}

export default Logout