import { useEffect,useRef,useState} from 'react';
import Cookie from 'js-cookie';
import axios from 'axios'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next';

import Banner from '../../components/Banner';
import CreditCards from '../../components/CreditCards';

import QuienesSomos from '../../components/quienes-somos'



import {useLocalStorage} from '../../helpers/index'
import useOnScreen from '../../hooks/useOnScreen';
import { useLocation } from '../../context/locationContext'

import {useConfig} from '../../context/configContext'
import {useLoading} from '../../context/loadingContext'
// import * as gtag from '../../lib/gtag'
// import {paises} from '../../lib/trackId'

import Loading from '../../components/Loading';
export default function Home (props){
  const [t, i18n] = useTranslation('global');
    
    const {config, setConfig} = useConfig()
    const [etiquetas,setEtiquetas] = useLocalStorage('etiquetas','')
    const router = useRouter()
    const codigoUserParam = router.asPath.split('?')[1]?.includes('=') ? router.asPath.split('?')[1].split('=')[0].trim() : router.asPath.split('?')[1]
    const { location, setLocation } = useLocation()
    const locationRef = useRef('LAT');
    const [currentCountry, setCurrentCountry] = useState(''); 
    const [cargando, setCargando] = useState(true); 

    const [telStore, setTelStore] = useState('')


    const {isLoading, setIsLoading} = useLoading()

    const paisesList = [
        {nombre: 'Argentina',flag:'/assets/images/banderas/flag-argentina.png',codigo:'ARGENTINA'},
        {nombre: 'Uruguay',flag:'/assets/images/banderas/flag-uruguay.png',codigo:'URUGUAY'},
        {nombre: 'Colombia',flag:'/assets/images/banderas/flag-colombia.png',codigo:'COLOMBIA'},
        {nombre: 'Ecuador',flag:'/assets/images/banderas/flag-ecuador.png',codigo:'ECUADOR'},
    ]
    
      const getConfig = async () => {
        try {
            setCargando(true)

            let COD = Cookie.get('location')
            if(!COD) return
            let logData = await axios.get(process.env.NEXT_PUBLIC_API_CONFIG+'?codigo='+COD);
            
            const data = logData.data[0]
            setConfig(data)
            setEtiquetas(data)
            setCargando(false)
        }
        catch (e) {
          console.log(e.response.data)
          setCargando(false)

        }
      }  

      useEffect(() => {
        console.log(props)
    },[])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        locationRef.current = Cookie.get('location')
        getCurrentCountry()
        setTelStore(localStorage.getItem('telStore'))
    })

    useEffect(() => {
        if(config != null && config?.codigo != undefined){
             setCargando(false)
             if(config?.codigo == locationRef.current){
                setIsLoading(false)
             }
        }
    },[config])

    const getCurrentCountry = () => {
        if(etiquetas){
            let valor = etiquetas?.paises.filter(item => item.codigo == locationRef.current)[0]?.nombre.toLowerCase()
            setCurrentCountry(valor)
        }
        else{
            setCurrentCountry(locationRef.current)
        }
      }
      useEffect(() => {
        getCurrentCountry()
        // eslint-disable-next-line react-hooks/exhaustive-deps
      },[locationRef.current])


     const getPhone = async (item) =>{
        if(item.toLowerCase() == 'argentina') {
            localStorage.setItem('telStore',5491160242450)
            return
        }
        if( item.toLowerCase() == 'uruguay'){
            localStorage.setItem('telStore',5989185988)
            return
        }
        try {
            let res = await axios.get(process.env.NEXT_PUBLIC_URL_GET_PHONE_STORE + '?codigo=' + item);
            const data = res.data[0].phone
            localStorage.setItem('telStore',data)
        } catch (error) {
            console.log(error)
        }
      }



      useEffect(()=>{
        if(Object.keys(router.query).length > 0){
            const {userId} = router.query
            Cookie.set('location', userId)
            setLocation(userId)
            getPhone(userId)
        }
      },[router.query])


    useEffect(()=>{
        //   if(codigoUserParam != undefined && codigoUserParam != ''){

        //     const isCountry = paisesList.filter(item=>{if(item.codigo.toUpperCase() == codigoUserParam.toUpperCase()){return item}})[0]
        //     if(isCountry != undefined){
        //         //significa que es un pais asi que pongo ese pais 
        //         Cookie.set('location', isCountry.codigo)
        //         setLocation(isCountry.codigo)
                
        //         getPhone(isCountry.codigo)
        //     }
        //     else{//no es pais, pero tengo que verificar que exista
        //         Cookie.set('location', codigoUserParam)
        //         setLocation(codigoUserParam)
        //         getPhone(codigoUserParam)
        //     }
        //   }
        //   else{
        //     //por defecto si no existe el param seteo argentina
        //     Cookie.set('location', 'ARGENTINA')
        //     setLocation('ARGENTINA')
        //     getPhone('ARGENTINA')
        //   }
        // // if(!localStorage.getItem('etiquetas')){
        // //     getConfig()
        // //   }
        // //   else{
        // //     setConfig(etiquetas)
        // //   }
        

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    // function gtag_report_conversion() {
    //     const url = router.pathname
    //     var callback = function () {
    //       if (typeof(url) != 'undefined') {
    //         window.location = url;
    //       }
    //     };
    //     let send = gtag.listTags.filter(item=> item.pais == Cookie.get('location')?.toLowerCase())[0].send_to_llamar
    //     gtag.event('event', 'conversion', {
    //         'send_to': send,
    //         // 'event_callback': callback
    //     });
    //     // return false
    //   }

    //   function gtag_report_conversion(isWhatsapp=false) {
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
    
            
    //         // gtag.event('event', 'conversion', {
    //         //     'send_to': send,
    //         //     // 'event_callback': callback
    //         // });

    //         if(isWhatsapp){
    //         let send = gtag.listTags.filter(item=> item.pais == Cookie.get('location')?.toLowerCase())[0].send_to_whatsapp
    //             gtag.event('event','conversion',{
    //                 action: 'conversion',
    //                 category: 'whatsapp',
    //                 label: 'whatsapp',
    //                 'send_to': send,
    //                 // 'event_callback': callback
    //             })
    //         }
    //         else{
    //             let send = gtag.listTags.filter(item=> item.pais == Cookie.get('location')?.toLowerCase())[0].send_to_llamar

    //             gtag.event('event','conversion',{
    //                 action: 'conversion',
    //                 category: 'llamada',
    //                 label: 'llamando',
    //                 'send_to': send,
    //                 // 'event_callback': callback
    //             })
    //         }
           

    //         return false
    //     }
    //   }


    const refInView = useRef();

    return (
        // <AppLayout>
            <>
           {(cargando || isLoading) && <Loading/>}
            <Banner banner='home'/>
            {/* //tarjetas aca */}
            <CreditCards pais={locationRef.current} config={config}/>
            {/* iconos asistencias */}
                    
            <section ref={refInView} className={`w-full bg-gris-claro transition-all motion-reduce:transition-none ease-in-out duration-500 ${useOnScreen(refInView, "60%") ? 'md:opacity-100 md:translate-y-0' : 'md:opacity-0 md:translate-y-8'}`}>
                <div className='max-w-screen-xl mx-auto grid grid-cols-2 lg:flex items-center justify-between gap-1 lg:gap-6 py-10 px-6 2xl:px-0 text-principal'>
                    <h3 className='lg:min-w-max text-xl xl:text-2xl col-span-2 text-center lg:text-left font-bold lg:font-normal mb-3 lg:mb-0'>Te asistimos <span className='lg:block'>con</span></h3>
                    <hr className='h-20 border-l border-principal my-auto hidden lg:block' aria-hidden="true" />
                    <article className='lg:min-w-max flex items-center gap-3 lg:gap-4 p-3 lg:p-0 border-2 border-principal lg:border-none rounded-md'>
                        <span className="icon-ico-covid text-3xl lg:text-6xl" aria-hidden="true"><span className="path1 text-turquesa"></span><span className='path2 text-black'></span></span>
                        <div className='leading-4'>
                            <h4 className='xl:text-xl font-bold'>{config?.etiquetas.Label_Prestacion1}</h4>
                            <p className='text-sm xl:text-[1rem] hidden lg:block mb-4'>{config?.etiquetas.Label_Prestacion5}</p>
                        </div>
                    </article>
                    <hr className='h-20 border-l border-principal my-auto hidden lg:block' aria-hidden="true" />
                    <article className='flex items-center gap-3 lg:gap-4 p-3 lg:p-0 border-2 border-principal lg:border-none rounded-md'>
                        <span className="icon-ico-embarazadas text-3xl lg:text-6xl" aria-hidden="true"><span className="path1 text-turquesa"></span><span className='path2 text-black'></span></span>
                        <div className='leading-4'>
                            <h4 className='xl:text-xl font-bold'>{config?.etiquetas.Label_Prestacion2}</h4>
                            <p className='text-sm xl:text-[1rem] hidden lg:block'>{config?.etiquetas.Label_Prestacion6}</p>
                        </div>
                    </article>
                    <hr className='h-20 border-l border-principal my-auto hidden lg:block' aria-hidden="true" />
                    <article className='flex items-center gap-3 lg:gap-4 p-3 lg:p-0 border-2 border-principal lg:border-none rounded-md'>
                        <span className="icon-ico-equipaje text-3xl lg:text-6xl" aria-hidden="true"><span className="path1 text-turquesa"></span><span className='path2 text-black'></span></span>
                        <div className='leading-4'>
                            <h4 className='xl:text-xl font-bold'>{config?.etiquetas.Label_Prestacion3}</h4>
                            <p className='text-sm xl:text-[1rem] hidden lg:block'>{config?.etiquetas.Label_Prestacion7}</p>
                        </div>
                    </article>
                    <hr className='h-20 border-l border-principal my-auto hidden lg:block' aria-hidden="true" />
                    <article className='flex items-center gap-1 lg:gap-4 py-3 pl-2 pr-1 lg:py lg:pl-0 lg:pr-0 border-2 border-principal lg:border-none rounded-md'>
                        <span className="icon-ico-cruceros text-3xl lg:text-6xl" aria-hidden="true"><span className="path1 text-turquesa"></span><span className='path2 text-black'></span></span>
                        <div className='leading-4'>
                            <h4 className='xl:text-xl font-bold'>{config?.etiquetas.Label_Prestacion4}
                            </h4>
                        </div>
                    </article>
                </div>
            </section>
            {/* banner 2 */}
            <Banner banner='home-secundario' config={config} />
            {/* accesos baja */}
            <section className={`w-full bg-gris-claro`}>
                <div className='max-w-screen-xl mx-auto flex flex-col lg:flex-row justify-around xl:justify-center gap-8 xl:gap-16 py-14 px-8 2xl:px-0 text-white'>
                    <article ref={refInView} className={`flex-1 p-5 lg:p-6 flex flex-col items-center lg:items-start text-center lg:text-left rounded-lg bg-amarillo shadow-3xl transition-all motion-reduce:transition-none ease-in-out duration-500 ${useOnScreen(refInView, "0%") ? 'md:opacity-100 md:translate-y-0' : 'md:opacity-0 md:translate-y-8'}`}>
                        <span aria-hidden="true" className='rounded-full aspect-square bg-white p-3 flex items-center justify-center lg:self-start mb-3'><span className="icon-ico-telefono text-3xl leading-3" aria-hidden="true"><span className="path1 text-amarillo"></span><span className='path2 text-black'></span></span></span>
                    <h4 className='text-xl'>{config?.etiquetas.Label_VentaTelefonica}</h4>
                    <address className='text-4xl not-italic'>
                        <a href={"tel:" + config?.etiquetas.Label_Telefono}>{config?.etiquetas.Label_Telefono}</a>
                    </address>
                    <p className='font-light'>{config?.etiquetas.Label_HorarioTelefono}</p>
                    </article>
                 
                        <article ref={refInView} className={`flex-1 p-5 lg:p-6 flex flex-col items-center lg:items-start text-center lg:text-left rounded-lg bg-celeste shadow-3xl transition-all motion-reduce:transition-none ease-in-out duration-500 ${ useOnScreen(refInView, "-5%") && currentCountry?.toLowerCase() == 'argentina' || currentCountry?.toLowerCase() == 'uruguay' ? 'md:opacity-100 md:translate-y-0' : 'hidden p-0 lg:p-0'}`}>
                            {currentCountry?.toLowerCase() == 'argentina' || currentCountry?.toLowerCase() == 'uruguay' ?
                                <>
                                    <span aria-hidden="true" className='rounded-full aspect-square bg-white p-3 flex items-center justify-center lg:self-start mb-3'><span className="icon-ico-chat text-3xl leading-3" aria-hidden="true"><span className="path1 text-celeste"></span><span className='path2 text-black'></span></span></span>
                                    <h4 className='text-xl'>¿Tenés alguna duda o preferís<span className='block'>comprar por Whats App?</span></h4>
                                    <p className='font-light text-xs flex-1 my-2'>Escribinos, hay asesores disponibles de lunes a viernes de 9hs a 18hs. Sino podes dejarnos un mensaje y te responderemos en el horario indicado.</p>
                                    <a href={`https://wa.me/${telStore}`}  target="_blank" rel="noreferrer" className='py-1 px-3 w-28 lg:self-start justify-self-end mt-2 rounded-lg bg-white text-principal shadow-sm'>Iniciar chat</a>
                                </>
                                : null
                            }
                       </article>
                        

                    <div ref={refInView} className={`flex-1 p-5 lg:p-6 flex flex-col items-center lg:items-start text-center lg:text-left rounded-lg bg-rosa shadow-3xl transition-all motion-reduce:transition-none ease-in-out duration-500 ${useOnScreen(refInView, "-10%") ? 'md:opacity-100 md:translate-y-0' : 'md:opacity-0 md:translate-y-8'}`}>
                        {currentCountry?.toLowerCase() == 'argentina' ?
                        <>
                        <span aria-hidden="true" className='rounded-full aspect-square bg-white p-3 flex items-center justify-center lg:self-start mb-3'><span className="icon-ico-alert text-3xl leading-3" aria-hidden="true"><span className="path1 text-rosa"></span><span className='path2 text-black'></span></span></span>
                            <h4 className='text-xl'>¿Te arrepentiste<span className='block'>de tu compra?</span></h4>
                            <p className='font-light text-sm flex-1 my-2'>Iniciá el proceso de arrepentimiento ahora mismo.</p>
                            <button onClick={()=>{router.push({pathname: '/[userId]/arrepentimiento', query: { userId: router.query.userId}})}} aria-label='Iniciar arrepentimiento' className='py-1 px-3 w-28 lg:self-start justify-self-end mt-2 rounded-lg bg-white text-principal shadow-sm'>Iniciar</button>
                        </>
                        :
                         <>
                            <span aria-hidden="true" className='rounded-full aspect-square bg-white p-3 flex items-center justify-center lg:self-start mb-3'><span className="icon-ico-alert text-3xl leading-3" aria-hidden="true"><span className="path1 text-rosa"></span><span className='path2 text-black'></span></span></span>
                            <h4 className='text-xl'>Escribenos</h4>
                            <p className='font-light text-sm flex-1 my-2'>Dejanos tus datos y consulta y nos comunicaremos contigo cuanto antes.</p>
                            <button onClick={()=>{router.push({pathname: '/[userId]/contacto', query: { userId: router.query.userId}})}} aria-label='Iniciar contacto' className='py-1 px-3 w-28 lg:self-start justify-self-end mt-2 rounded-lg bg-white text-principal shadow-sm'>Contactar</button>
                         </>
                        }
                    </div>
                </div>
            </section>
            <QuienesSomos/>
            
            </>
            // </AppLayout>     
    )
   
}
export async function getInitialProps(ctx) {
    const { params } = ctx
    const { userId } = params

    return {
      props: {
        params
      }
    };
  }