
export default function Loading({isMulti = false}) {
     
    return ( 
        <div className="fixed z-50 inset-0 w-full h-full flex items-center justify-center bg-white bg-opacity-60">
            <img src="/assets/images/BUSCANDO.gif" alt="loading" 
            className={`flex mx-auto ${isMulti ? 'max-w-36 max-h-36' : ''} `}/>
        </div>
    )
}
    

