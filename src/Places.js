import { useEffect, useState, useRef } from 'react';
import {
    useMapsLibrary
  } from "@vis.gl/react-google-maps";

const Places = ({ onPlaceSelect }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);
  
  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);
  let form = document.getElementsByClassName('pac-target-input')
  if(form[0] !== undefined) form[0].value = ''

  return (
    <div className="autocomplete-container">
      <input ref={inputRef} />
    </div>
  );
};
    
export default Places
