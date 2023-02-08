import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/Link';
import PaisesItem from '../PaisesItem';
import Cookie from 'js-cookie';
import { useConfig } from '../../context/configContext'
import { useLocalStorage } from '../../helpers/useLocalStorage'
import axios from 'axios'
import { getUserLocation } from '../../helpers/index'
import { useRouter } from 'next/router'

import { useTranslation } from 'react-i18next';
import { useShare } from '../../context/shareContext';
import * as gtag from '../../lib/gtag'
import {paises} from '../../lib/trackId'

// gtag
export default function Header(props) {
    const [t, i18n] = useTranslation('global');
    const router = useRouter();

    const [Country, setCountry] = useState('');
    const [openMenu, setOpenMenu] = useState(false);
    const [currentCountry, setCurrentCountry] = useState('');
    // const codigoUserParam = router.asPath.split('?')[1]?.includes('=') ? router.asPath.split('?')[1].split('=')[0].trim() : router.asPath.split('?')[1]
    const codigoUserParam = router.query.userId
    const { config, setConfig } = useConfig()
    const [etiquetas, setEtiquetas] = useLocalStorage('etiquetas', '')
    const { isShared, setIsShared } = useShare()

    const [isCountry, setIsCountry] = useState(false);
    const urlAssets=process.env.NEXT_PUBLIC_URL_BASE_ASSETS

    const [cargando, setCargando] = useState(true)


 // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (Cookie.get('location')) {
            setCountry(Cookie.get('location').toLowerCase())
            getIsCountry()
        }
    })

    useEffect(() => {
     
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      if(router.query.userId != undefined){
        if (router.pathname != '/') {            
            if (!localStorage.getItem('etiquetas')) {
                getConfig()
            }
            else {
                setConfig(etiquetas)
            }
            if (Cookie.get('location')) setCountry(Cookie.get('location').toLowerCase())
            getCurrentCountry()
        }
      }
      setCargando(false)

         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query])


    useEffect(() => {
       if(router.query.userId != undefined && router.pathname != '/'){
            getCurrentCountry()
            getConfig()
       }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Country])


    const getIsCountry = () => {
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
        let paises = etiquetas.paises ?? paisesList
        const result = paises.filter(item => { if (item.codigo.toUpperCase() == Cookie.get('location').toUpperCase()) { return item } })[0]
        result ? setIsCountry(true) : setIsCountry(false)
    }

    const buttonOpenMenu = () => {
        setOpenMenu(current => !current)
    };

    const getConfig = async () => {
        try {
            if(config != null && Country.toUpperCase() == codigoUserParam.toUpperCase()){ 
                setCargando(false)
                return
            }
            let logData = await axios.get(process.env.NEXT_PUBLIC_API_CONFIG + '?codigo=' + codigoUserParam);
            const data = logData.data[0]
            setConfig(data)
            setEtiquetas(data)
            setCargando(false)
        }
        catch (e) {
            console.log(e)
        }
    }


    //agrego el esc para cerrar el menu
     // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleEscape = useCallback(event => {
        if (event.keyCode === 27) setOpenMenu(false)
    })


    //agrego el click outside al header para cerrar el menu si haces click fuera
    const outsideRef = useRef()
     // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleClickOutside = useCallback(e => {
        if (outsideRef.current && !outsideRef.current.contains(e.target)) {
            setOpenMenu(false)
        }
    })

    useEffect(() => {
        if (openMenu) document.addEventListener('keydown', handleEscape, false)
        return () => {
            document.removeEventListener('keydown', handleEscape, false)
        }
    }, [handleEscape, openMenu]);


    useEffect(() => {
        if (openMenu) document.addEventListener('mousedown', handleClickOutside, false)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside, false)
        }
    }, [handleClickOutside, openMenu]);


    const getCurrentCountry = () => {
        if (etiquetas) {
            let valor = etiquetas.paises.filter(item => item.codigo.toLowerCase() == Country)[0]?.nombre.toLowerCase()
            setCurrentCountry(valor)
        }
        else {
            setCurrentCountry(Country)
        }
    }  


    // function gtag_report_conversion() {

    //     let state = false
    //     if (typeof window !== 'undefined') {
    //       paises.map(item=>{
    //           if(item.codigo.toLowerCase() == Cookie.get('location').toLowerCase()){ 
    //             // console.log(item.codigo.toLowerCase() == Cookie.get('location').toLowerCase(),item.codigo.toLowerCase(),Cookie.get('location').toLowerCase());
    //             state = true
    //           }
    //         })
    //     }

    //     if(state){
    //         const url = router.pathname

    //         var callback = function () {
    //           if (typeof(url) != 'undefined') {
    //             window.location = url;
    //           }
    //         };
    
    //         let send = gtag.listTags.filter(item=> item.pais == Cookie.get('location')?.toLowerCase())[0].send_to_llamar
            
    //         // gtag.event('event', 'conversion', {
    //         //     'send_to': send,
    //         //     // 'event_callback': callback
    //         // });
    //         gtag.event('event','conversion',{
    //             action: 'conversion',
    //             category: 'llamada',
    //             label: 'llamando',
    //             'send_to': send,
    //             // 'event_callback': callback
    //         })

    //         return false
    //     }
        
       
    //   }

    return (
     cargando ? <>cargando...</>
        :
        <header ref={outsideRef} role='banner'>
        <div className='w-full max-w-screen-xl flex items-center gap-4 lg:gap-6 py-4 lg:py-6 px-6 2xl:px-0 m-auto'>
            <div className='flex-1 min-w-max'>
                {
                    router.asPath === '/' || isShared ?
                        <div className="inline-block p-2">
                            <img src="/assets/images/europ-assitance.svg" alt={t("menu.marca")} className='w-28' />
                        </div>
                        :
                        <a href={'/' + Country.toUpperCase()} className='flex items-center p-2 gap-2'>
                            <img src="/assets/images/europ-assitance.svg" alt={t("menu.marca")} className='w-28' />
                            {config != null && config.logo != null && !isCountry && <img id="img_logo2"  src={`${urlAssets}${config.logo}`} alt={t("menu.marca")} className='w-28'  />}
                        </a>
                }
            </div>
            {props.page !== '/' && <>
                {!isShared &&
                    <>
                        <div className='w-full'>
                            <div className="hidden md:flex flex-col xl:flex-row items-center xl:items-stretch justify-center">
                                {
                                    currentCountry?.toLowerCase() == 'argentina' ?
                                        <>
                                            <address className='border-t sm:border-t-0 border-principal bg-white sm:bg-transparent py-3 sm:py-0 px-6 not-italic text-principal flex flex-col sm:flex-row items-center sm:items-end justify-center sm:justify-end sm:gap-2'>
                                                <span className='text-sm uppercase order-3 sm:order-1 whitespace-nowrap'>{config?.etiquetas.Label_Urgencias}</span>
                                                <a href={"tel:" + config?.etiquetas.Label_DesdeElExteriorTelefono} className='lg:text-2xl font-extrabold order-2 whitespace-nowrap'>{config?.etiquetas.Label_DesdeElExteriorTelefono}</a>
                                            </address>
                                            <address className='border-t sm:border-t-0 xl:border-l border-principal bg-white sm:bg-transparent py-3 sm:py-0 px-6 not-italic text-principal flex flex-col sm:flex-row items-center sm:items-end justify-center sm:justify-end sm:gap-2'>
                                                <span className='text-sm uppercase order-3 sm:order-1 whitespace-nowrap'>{config?.etiquetas.Label_VentaTelefonica}</span>
                                                <a href={"tel:" + config?.etiquetas.Label_Telefono}  className='lg:text-2xl font-extrabold order-2 whitespace-nowrap'>{config?.etiquetas.Label_Telefono}</a>
                                                <span className='text-sm uppercase order-4 whitespace-nowrap'>{config?.etiquetas.Label_HorarioTelefono}</span>
                                            </address>
                                        </>
                                        :
                                        <address className='border-t sm:border-t-0  bg-white sm:bg-transparent py-3 sm:py-0 px-6 not-italic text-principal flex flex-col sm:flex-row items-center sm:items-end justify-center sm:justify-end sm:gap-2'>
                                            <span className='text-sm uppercase order-3 sm:order-1 whitespace-nowrap'>Urgencias y Atención Comercial</span>
                                            <a href={"tel:" + config?.etiquetas.Label_Telefono}   className='lg:text-2xl font-extrabold order-2 whitespace-nowrap'>{config?.etiquetas.Label_Telefono}</a>
                                        </address>
                                }

                            </div>
                            {isCountry ?
                                <nav role='navigation' className={`hidden lg:block absolute left-1/2 -translate-x-1/2 w-full mt-4 text-sm xl:text-base overflow-hidden transition-all ease-in-out ${openMenu ? "max-h-max opacity-100" : "max-h-0 opacity-0"}`} aria-label='Navegación principal'>
                                    <ul className="nav nav-tabs w-full flex gap-6 items-center justify-center mb-4" id="navMenu">
                                        {/* <li><Link href='/quienes-somos'><a className="text-principal hover:text-secundario focus:text-secundario focus:outline-none">{t("menu.quienesSomos")}</a></Link></li> */}
                                        <li><a href={{ pathname: '/[userId]/nuestras-coberturas',query: { userId: currentCountry}}} className="text-principal hover:text-secundario focus:text-secundario focus:outline-none">{t("menu.coberturas")}</a></li>
                                        <li><a href={{ pathname: '/[userId]/preguntas-frecuentes',query: { userId: currentCountry}}} className="text-principal hover:text-secundario focus:text-secundario focus:outline-none">{t("menu.faq")}</a></li>
                                        {Country.toLowerCase() == 'argentina' &&
                                            <li>
                                                <a href={{ pathname: '/[userId]/arrepentimiento',query: { userId: currentCountry}}} className="text-principal hover:text-secundario focus:text-secundario focus:outline-none">{t("menu.baja")}</a></li>
                                        }
                                        <li><a href={{ pathname: '/[userId]/contacto',query: { userId: currentCountry}}} className="text-principal hover:text-secundario focus:text-secundario focus:outline-none">{t("menu.contacto")}</a></li>
                                    </ul>
                                </nav>
                                : null}
                        </div>
                        {isCountry ?
                            <>
                                <div className='hidden lg:flex gap-4 items-center'>
                                    <button onClick={buttonOpenMenu} className="flex flex-col justify-between w-9 h-8 p-2 relative group focus:outline-none">
                                        <span aria-hidden="true" className={`block h-[2px] w-full group-hover:bg-secundario group-focus:bg-secundario transition-colors duration-300 ${openMenu ? "bg-secundario" : "bg-principal"}`}></span>
                                        <span aria-hidden="true" className={`block h-[2px] w-full group-hover:bg-secundario group-focus:bg-secundario transition-colors duration-300 ${openMenu ? "bg-secundario w-1/2" : "bg-principal"}`}></span>
                                        <span aria-hidden="true" className={`block h-[2px] w-full group-hover:bg-secundario group-focus:bg-secundario transition-colors duration-300 ${openMenu ? "bg-secundario" : "bg-principal"}`}></span>
                                        <span className='sr-only'>{t("menu.menu")}</span>
                                    </button>
                                </div>

                                <a href={"tel:" + config?.etiquetas.Label_Telefono}  className='flex-none flex items-center justify-center lg:hidden w-14 h-14 rounded-full shadow-sm overflow-hidden border' aria-label='Llamar'><span className='icon-tel text-3xl'></span></a>
                                <div className='flex-none relative w-14 h-14'>
                                    <PaisesItem Country={Country} />
                                </div>
                            </>
                            :
                            <a href={"tel:" + config?.etiquetas.Label_Telefono}  className='flex-none flex items-center justify-center lg:hidden w-14 h-14 rounded-full shadow-sm overflow-hidden border' aria-label='Llamar'><span className='icon-tel text-3xl'></span></a>
                            }

                    </>
                }
            </>
            }
        </div>
    </header>
    );
}

  //export {Header}