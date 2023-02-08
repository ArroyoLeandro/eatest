import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router'
import Cookie from 'js-cookie';
import { useTranslation } from 'react-i18next';
import axios from 'axios'

import { useLocation } from '../../context/locationContext'
import { useLocalStorage } from '../../helpers/useLocalStorage'
import {getPromoActual } from '../../apiFunctions/index'
import {useConfig} from '../../context/configContext'
import {useLoading} from '../../context/loadingContext'

export default function PaisesItem(props) {
    const [t, i18n] = useTranslation('global');

    const router = useRouter();
    // const codigoUserParam = router.asPath.split('?')[1]?.includes('=') ? router.asPath.split('?')[1].split('=')[0].trim() : router.asPath.split('?')[1]

    const { location, setLocation } = useLocation()
    const {config, setConfig} = useConfig()
    const paisesList = [
        {nombre: 'Argentina',flag:'/assets/images/banderas/flag-argentina.png',codigo:'ARGENTINA'},
        {nombre: 'Uruguay',flag:'/assets/images/banderas/flag-uruguay.png',codigo:'URUGUAY'},
        {nombre: 'Colombia',flag:'/assets/images/banderas/flag-colombia.png',codigo:'COLOMBIA'},
        {nombre: 'Ecuador',flag:'/assets/images/banderas/flag-ecuador.png',codigo:'ECUADOR'},
        {nombre: 'Perú',flag:'/assets/images/banderas/flag-peru.png',codigo:'PERU'},
        {nombre: 'Chile',flag:'/assets/images/banderas/flag-chile.png',codigo:'CHILE'},
        {nombre: 'Panamá',flag:'/assets/images/banderas/flag-panama.png',codigo:'PANAMA'},
        {nombre: 'Paraguay',flag:'/assets/images/banderas/flag-paraguay.png',codigo:'PARAGUAY'}
    ]

    const orderPaises = (paises) =>{
        return paises.sort((a, b) => {
            const nameA = a.nombre.toUpperCase(); 
            const nameB = b.nombre.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
      }




    const [paises, setPaises] = useState(orderPaises(paisesList))
    const [etiquetas, setEtiquetas] = useLocalStorage('etiquetas', '')
    const [Country, setCountry] = useState('');
    const codigoUserParam = router.query.userId

    const [countryProp, setCountryProp] = useState(true)
    const [promoLocalStorage,setPromoLocalStorage]= useLocalStorage('promoActual','')

    const {isLoading, setIsLoading} = useLoading()
 
    const getConfig = async () => {
        try {  
           
            setIsLoading(true)
            let logData = await axios.get(process.env.NEXT_PUBLIC_API_CONFIG + '?codigo=' + codigoUserParam);
            setIsLoading(false)
            const data = logData.data[0]
            if(router.pathname != '/'){
                setConfig(data)
                setEtiquetas(data)
            }
            //*carga de paises desde api
            let info = data['paises'].map(pais => {
                pais.flag = '/assets/images/banderas/flag-'+ pais.codigo.toLowerCase()+'.png'
                return pais
            })
            info.push({nombre: 'Perú',flag:'/assets/images/banderas/flag-peru.png',codigo:'PERU'})
            info.push({nombre: 'Chile',flag:'/assets/images/banderas/flag-chile.png',codigo:'CHILE'})
            info.push({nombre: 'Paraguay',flag:'/assets/images/banderas/flag-paraguay.png',codigo:'PARAGUAY'})
   
            setPaises(orderPaises(info))
        }
        catch (e) {
            console.log(e.response.data)
            setIsLoading(false)

        }
    }

    const getPromo = () => {
        let COD = codigoUserParam ?? Cookie.get('location')
        if(!COD) return
        if(COD){
          let promo = getPromoActual(COD.toUpperCase())
          promo.then(res => {
              Cookie.set('promoActual',JSON.stringify(res))
              setPromoLocalStorage(res)
          })
        }    
      }
    
    useEffect(() => {
        props.Country == undefined ? setCountryProp(true) : setCountryProp(false)
        setLocation(Cookie.get('location'))
        codigoUserParam && getConfig()
        if (Cookie.get('location')) setCountry(Cookie.get('location').toLowerCase())

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

 // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (Cookie.get('location')) {
            setCountry(Cookie.get('location').toLowerCase())
        }
    })

    const handleClick = async(item) => {
        let a   =  document.createElement( 'a' )
        if(item.toLowerCase() == 'chile'){
            window.location.href  = 'https://www.eachile.cl/default.aspx?utm_source=latam&utm_medium=web&utm_id=prehome'
            return
        }
        if(item.toLowerCase() == 'peru'){
            window.location.href ='https://www.eaperu.com.pe/?utm_source=latam&utm_medium=web&utm_id=prehome'
            return
        }
        if(item.toLowerCase() == 'paraguay'){
            window.location.href ='https://europ-assistancepy.com/'
            return
        }
        

        localStorage.removeItem('telStore')
        setLocation(item)   
        Cookie.set('location', item)
        localStorage.setItem('location', item)
        getConfig()
        getPromo()

        try {
            let res = await axios.get(process.env.NEXT_PUBLIC_URL_GET_PHONE_STORE + '?codigo=' + item);
            const data = res.data[0].phone
            localStorage.setItem('telStore',data)
        } catch (error) {
            console.log(error)
        }
        

        if(item.toLowerCase() == 'argentina'){
            i18n.changeLanguage("ar")
        }
        else{
            i18n.changeLanguage("es")
        }
        a.href  = '/'+item

        a.click()
        // router.push('/home?'+item)
    }
    const handleChangePais = () => {
        const all = 'LAT'
        
        setLocation(all)
    }



    ///agrego el esc para cerrar el menu
    const handleEscape = useCallback(event => {
        if (event.keyCode === 27) setLocation(Cookie.get('location'))
    }, [setLocation])

    useEffect(() => {
        if (CountryList) document.addEventListener('keydown', handleEscape, '')
        return () => {
            document.removeEventListener('keydown', handleEscape, '')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleEscape]);

    
    //agrego el click outside para cerrar el menu
    const outsideRef = useRef()
    const handleClickOutside = useCallback(e => {
       
        if(outsideRef.current && !outsideRef.current.contains(e.target)) {
            setLocation(Cookie.get('location'))
        }
    }, [setLocation])

    useEffect(() => {
        if (CountryList) {
            document.addEventListener('mousedown', handleClickOutside, false)            
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside, false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [handleClickOutside]);


    function CountryList() {
        return paises?.map(pais => (
            <li className="" key={pais.codigo} >
                <button onClick={() => { handleClick(pais.codigo);}} className={`group w-full flex flex-row justify-between items-center text-principal focus:outline-none ${countryProp ?  "sm:flex-col gap-1 " : "gap-2 bg-white px-6 py-2 "}`}>
                    <span className={`order-3 rounded-full overflow-hidden block relative aspect-square outline outline-transparent group-hover:outline-2 group-hover:outline-current group-focus:outline-2 group-focus:outline-current transition-[outline] ${countryProp ? "sm:order-1 w-6 sm:w-20 h-6 sm:h-20 sm:mb-2 sm:mx-auto": "w-10 h-10" }`}>
                        <img src={pais.flag} alt='' className='w-full h-full object-cover' />
                    </span>
                    <span className='order-2 capitalize'>{pais.nombre}</span>
                </button>
            </li>
        ))
    }

    function CurrentCountry() {
        let elem = null

        if(paises.length > 0) {
            paises.map(pais => {
                (
                    location?.toLowerCase() == pais.codigo.toLowerCase() ?
                        elem = (<li className="" key={pais.codigo} >
                            <button aria-label={pais.nombre} onClick={() => handleChangePais()} className="group w-full flex flex-row sm:flex-col justify-between items-center gap-1 text-principal focus:outline-none">
                                <span className={`order-3 sm:order-1 rounded-full overflow-hidden block relative aspect-square outline outline-transparent group-hover:outline-2 group-hover:outline-current group-focus:outline-2 group-focus:outline-current transition-[outline] ${countryProp ? "w-6 sm:w-20 h-6 sm:h-20 sm:mb-2 sm:mx-auto" : "w-14 h-14"}`}>
                                    <img src={pais.flag} alt='' className='w-full h-full object-cover' />
                                </span>
                                {router.pathname === '/' && <span className='order-2 capitalize'>{pais.nombre}</span>}
                            </button>
                        </li>)
                        : null
                )
            })
        }
       
        return elem
      
    }

    return (
        <>  
            {router.pathname =='/' && paises.length == 0 ? <div className='h-28 absolute max-w-xs left-1/2 -translate-x-1/2'><img className='max-w-full' alt="loading" src="/assets/images/BUSCANDO.gif" /></div> : null}
            <ul ref={outsideRef} aria-label='País seleccionado' className={`max-w-2xl flex flex-col ${countryProp ? "mt-8 sm:mb-14 min-h-[120px] xl:max-w-full sm:flex-row flex-wrap xl:flex-nowrap gap-2 sm:gap-10 xl:gap-8" : "absolute right-0 -top-0 z-50" } ${(router.asPath !=='/' && location == 'LAT') ? " border rounded-lg overflow-hidden shadow-xl" : "" }`}>
                {
                    router.pathname !=='/' && location !== 'LAT' ? CurrentCountry() : CountryList()
                }
            </ul>
        </>
    )
}
