import React from 'react'
import HomepageSlider from './HomepageSlider';
import './Homepage.css'

const Homepage = ({ setOnHomepage}) => {
  setOnHomepage(true);
  const homeImages = ['../homepage-bridge.jpg', '../homepage-river.jpg', '../homepage-street.jpg']
  const homeTitles = ['Plan your next trip.', 'Directions in one place.', 'Begin your journey.']
  return (
    <div>
      <HomepageSlider homeTitles={homeTitles} homeImages={homeImages} />
    </div>
  )
}

export default Homepage
