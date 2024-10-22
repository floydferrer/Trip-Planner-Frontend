import React, { useState } from 'react';
import {ArrowBigLeft, ArrowBigRight} from 'lucide-react';
import './ImageSlider.css';

const ImageSlider = ( { stopImages, stopNames }) => {
  const [imageIdx, setImageIdx] = useState(0)

  const showNextStop = () => {
    setImageIdx(index => {
        if (index === stopImages.length - 1) return index; 
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
      <div style={{ width: '100%', height: '100%', display: 'flex', overflow: 'hidden'}}>
        {stopImages.map(url => (
            <img key={url} src={url} className='img-slider-img' style={{ translate: `${-100 * imageIdx}%`}} />
        ))}
      </div>
      <p>{stopNames[imageIdx]}</p>
      {imageIdx > 0 && <button onClick={showPrevStop} className='img-slider-btn' style={{ left: 0}}>
        <ArrowBigLeft/>
      </button>}
      {imageIdx < stopImages.length - 1 && <button onClick={showNextStop} className='img-slider-btn' style={{ right: 0}}>
        <ArrowBigRight/>
      </button>}
    </div>
  )
}

export default ImageSlider
