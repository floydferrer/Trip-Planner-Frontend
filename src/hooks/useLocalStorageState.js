import { useState, useEffect } from "react";

const useLocalStorageState = (key, defaultValue) => {
    const [state, setState] = useState(() => {
        
        return (window.localStorage.getItem(key) || defaultValue);
    });
    useEffect(() => {
        window.localStorage.setItem(key, state)
    }, [key, state])
    return [state, setState];
}

export default useLocalStorageState;