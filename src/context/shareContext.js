import { createContext,useContext,useState } from "react";

export const ShareContext = createContext();

export const useShare = () => useContext(ShareContext);

export const ShareProvider = ({children}) => {

    const [isShared,setIsShared] = useState(false)

    return (
        <ShareContext.Provider value={{isShared,setIsShared}}>
            {children}
        </ShareContext.Provider>
    )
}