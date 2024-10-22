import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './HomepageSlider.css';

const HomepageSlider = ( { homeTitles, homeImages }) => {
  const navigate = useNavigate();
  const [imageIdx, setImageIdx] = useState(0)

  const showNextStop = () => {
    setImageIdx(index => {
        if (index === homeImages.length - 1) return index; 
        return index + 1;
    })
  }
  
  const showPrevStop = () => {
    setImageIdx(index => {
        if (index === 0) return index;
        return index - 1;
    })
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', marginBottom: '10rem'}}>
      <h2 className='mt-4 home-title'>{homeTitles[imageIdx]}</h2>
      <div style={{ width: '100%', display: 'flex', position: 'fixed', bottom: '10%', left: '30%'}}>
        {homeImages.map(url => (
            <img key={url} src={url} className='home-slider-img' style={{ translate: `${-100 * imageIdx}%`}} />
        ))}
      </div>
      {imageIdx <= homeImages.length - 1 && <button onClick={imageIdx < homeImages.length - 1 ? showNextStop : () => navigate('/search')} className='home-slider-btn'>
        <FontAwesomeIcon className={'font-awesome-icon'} icon={faChevronRight} size="2xl" style={{color: "#31426c",}} />
      </button>}
    </div>
  )
}

export default HomepageSlider