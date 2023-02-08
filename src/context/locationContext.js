import { createContext,useContext,useState } from "react";

export const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({children}) => {
    const [location,setLocation] = useState('')

    return (
        <LocationContext.Provider value={{location,setLocation}}>
            {children}
        </LocationContext.Provider>
    )
}
