import Contador from './Contador';
import React, { useEffect, useState, useCallback ,useLayoutEffect} from 'react';
import { useRouter } from 'next/router'

import * as gtag from '../../lib/gtag'

//fechas
import { DateRange,Calendar } from 'react-date-range';
import { addDays,addYears, format } from 'date-fns';
import spanish from 'date-fns/locale/es';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
//import * as locales from 'react-date-range/dist/locale';
import Cookie from 'js-cookie';


import { useLocation } from '../../context/locationContext'
import { useCounter } from '../../hooks/Counter'


import { getRegion, getModalidades, getPromoActual } from '../../apiFunctions/index'
import { useLocalStorage } from '../../helpers/index'
import { useConfig } from '../../context/configContext'

import axios from 'axios'
import useMediaQuery from '../../hooks/useMediaQuery';
import Loading from '../Loading';
import {paises} from '../../lib/trackId'

export default function FormPrincipal(props) {

    const router = useRouter();

    const codigoUserParam = router.query.userId
    // const codigoUserParam = router.asPath.split('?')[1]?.includes('=') ? router.asPath.split('?')[1].split('=')[0].trim() : router.asPath.split('?')[1]

    const initialCamposVacios = {Regiones:true,Modalidad:true,Date:true,Email:{vacio:true,valido:false},Viajeros:true}
    const initialCamposVaciosConDatos = {Regiones:false,Modalidad:false,Date:false,Email:{vacio:false,valido:true},Viajeros:false}
    const initialCotizacion =  {
        Regiones: '¿A dónde viajas?',
        Date: {
            from: 'Desde',
            to: 'Hasta'
        },
        Menores: 0,
        Mayores: 0,
        Mayores2: 0,
        Mayores3: 0,
        Viajeros: 0,
        Modalidad: 'Modalidad',
        Email: 'Email'
    }
    const [openInfo, setOpenInfo] = useState(null);
    const { location, setLocation } = useLocation()
    const [date, setDate] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            color:'#00239c',
            //rangeColors:['#00239c', '#2FC7DF', '#00239c'],
            key: 'selection'
        }
    ]);
    const initialCotizacionConDatos =  typeof window !== 'undefined' && localStorage.getItem('cotizacion') != undefined && router.pathname == '/[userId]/planes'  ? JSON.parse(localStorage.getItem('cotizacion')) : initialCotizacion
    const [cotizacion, setCotizacion] = useState(initialCotizacionConDatos);
    const counterMenores = useCounter()
    const counterMayores1 = useCounter()
    
    const counterMayores2 = useCounter()
    const counterMayores3 = useCounter()

    const [modalidad, setModalidad] = useState([]);
    const [regiones, setRegiones] = useState([]);
    const [promoActual, setPromoActual] = useState(null);

    const { config, setConfig } = useConfig()
    const [etiquetas, setEtiquetas] = useLocalStorage('etiquetas', '')

    const [camposVacios, setCamposVacios] = useState(router.pathname == '/[userId]/planes' ? initialCamposVaciosConDatos : initialCamposVacios);
    const [validate, setValidate] = useState(false);
    const [cotizando, setCotizando] = useState(false)
    const [promoLocalStorage,setPromoLocalStorage]= useLocalStorage('promoActual','')
    
    const [isSet, setIsSet] = useState(false)

    const getConfig = async () => {
        try {
            let COD = codigoUserParam
            if(!COD) return

            // if (Cookie.get('location') != undefined) COD = Cookie.get('location')
            let logData = await axios.get(process.env.NEXT_PUBLIC_API_CONFIG + '?codigo=' + COD);
            const data = logData.data[0]
            setConfig(data)
            setEtiquetas(data)

            // console.log('fetch formPrincipal');
        }
        catch (e) {
            console.log(e.response.data)

        }
    }



    const setRegMod = () => {
        getRegion(codigoUserParam ?? Cookie.get('location')).then(res => {
            setRegiones(res)
            Cookie.set('regiones', JSON.stringify(res));
        })
        getModalidades(codigoUserParam ?? Cookie.get('location')).then(res => {
            setModalidad(res)
            Cookie.set('modalidad', JSON.stringify(res));
            setCotizacion({...cotizacion,[cotizacion.Modalidad]:res.filter(item=>item.id==1)[0].nombreB2C})
            setCamposVacios({...camposVacios,'Modalidad':false})
        })
    }


    useEffect(() => {

        
        //obtengo la promo actual
        // let promo = getPromoActual(pais.toUpperCase())
        // console.log('form principal:',promoLocalStorage)
        // promo.then(res => {
        //     Cookie.set('promoActual',JSON.stringify(res))
        //     setPromoLocalStorage(res)
        //     setPromoActual(res)
        // })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(()=>{
        if(router.pathname == '/[userId]'){
            localStorage.removeItem('cotizacion')
        } 
         //set location
        if(localStorage.getItem('cotizacion') != undefined && router.pathname == '/[userId]/planes'){
            setIsSet(true)
            const cot = JSON.parse(localStorage.getItem('cotizacion'))
            cot.Viajeros = cot.Menores + cot.Mayores + cot.Mayores2 + cot.Mayores3
            counterMenores.setCounter(cot.Menores)
            counterMayores1.setCounter(cot.Mayores)
            counterMayores2.setCounter( cot.Mayores2)
            counterMayores3.setCounter(cot.Mayores3)
            var months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
            let mesFrom = months.indexOf(cot.Date.from.split('-')[1]);
            let mesTo = months.indexOf(cot.Date.to.split('-')[1]);
            setDate([
                {
                    startDate:new Date(Number('20'+cot.Date.from.split('-')[2]),mesFrom,cot.Date.from.split('-')[0]),
                    endDate: new Date(Number('20'+cot.Date.to.split('-')[2]),mesTo,cot.Date.to.split('-')[0]),
                    color:'#00239c',
                    key: 'selection'
                }
            ])
            setCotizacion(cot)
        }
        //si no existen etiquetas en localStorage las pido
        if (!localStorage.getItem('etiquetas')) {
            getConfig()
        }else {
            setConfig(etiquetas)
        }

        let pais = codigoUserParam ?? Cookie.get('location')?.toUpperCase()
        if(!pais) pais ='ARGENTINA'
        setLocation(pais)
        setRegMod() 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(() => {
        setCotizacion(initialCotizacion)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location])

    useEffect(() => {
        if ((JSON.stringify(date[0].startDate) != JSON.stringify(date[0].endDate)) && isSet == false) {
            handleChange('Date', date[0])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date])

    useEffect(() => {
        let cot = cotizacion
        cot.Menores = counterMenores.counter
        cot.Mayores = counterMayores1.counter
        cot.Mayores2 = counterMayores2.counter
        cot.Mayores3 = counterMayores3.counter
        cotizacion.Viajeros = counterMenores.counter + counterMayores1.counter + counterMayores2.counter + counterMayores3.counter
        setCotizacion(cot)
        if(cotizacion.Viajeros > 0) {
            setCamposVacios({...camposVacios, Viajeros:false})
        }
        else{
            setCamposVacios({...camposVacios, Viajeros:true})
        }
     // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [counterMenores.counter, counterMayores1.counter, counterMayores2.counter, counterMayores3.counter])




    const handleClickOpenInfo = (cual) => {
        if (openInfo != cual) {
            setOpenInfo(cual)
        }
        else { setOpenInfo(null); }
    };

    //useKeypress('Escape', () => {setOpenInfo(null)}); este escucha cualquier tecla y pasa funcion
    ///agrego el esc para cerrar el form
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleEscape = useCallback(event => {
        if (event.keyCode === 27) setOpenInfo(null)
    })
    useEffect(() => {
        if (openInfo) document.addEventListener('keydown', handleEscape, false)
        return () => {
            document.removeEventListener('keydown', handleEscape, false)
        }
    }, [handleEscape, openInfo]);
    //paso una variable para cambiar la cantidad de meses que muestra pc/mobile
    const isMobile = useMediaQuery('(max-width: 640px)') ? 1 : 2;

    const submit = () => {
        let vacio = validateForm()
        if(!vacio){
            cotizacion.cotizacionID = localStorage.getItem('cotizacionID')
            localStorage.setItem('cotizacion',JSON.stringify(cotizacion))
            setCotizando(true)
            // cotizacion['Date'].from = format(date[0].startDate, 'yyyy-MM-dd')
            // cotizacion['Date'].to = format(date[0].endDate, 'yyyy-MM-dd')
            cotizacion['Date'].from = format(date[0].startDate, 'dd-MMM-yy', {locale: spanish})
            cotizacion['Date'].to = format(date[0].endDate, 'dd-MMM-yy', {locale: spanish})
            setCotizacion(cotizacion)
     
            let edades = []

            for (let index = 0; index < cotizacion.Menores; index++) {
                edades.push(19)
            }
            for (let index = 0; index < cotizacion.Mayores; index++) {
                edades.push(30)
            }
            for (let index = 0; index < cotizacion.Mayores2; index++) {
                edades.push(80)
            }
            for (let index = 0; index < cotizacion.Mayores3; index++) {
                edades.push(88)
            }


            setPromoActual(JSON.parse(localStorage.getItem('promoActual')))
            const promo = JSON.parse(localStorage.getItem('promoActual'))
            let regID = regiones.filter(item => item.nombreB2C == cotizacion.Regiones)[0]
            let cotizar = {
                regionId: regID ? regID.id : 3,
                tipoDeViajeId: modalidad.filter(item => item.nombreB2C == cotizacion.Modalidad)[0].id,
                "desde": format(date[0].startDate, 'yyyy-MM-dd'),
                "hasta": format(date[0].endDate, 'yyyy-MM-dd'),
                "edades": edades,
                "correo": cotizacion.Email,
                "codigoUsuario": location.toUpperCase(),
                "promocionId": promo.id,
                "pieLegal": promo.pieLegalB2C,
            }
         
            postCotizar(cotizar)
        }
        
       
    };

    const validateForm = ()=>{
        setValidate(true)

        let vacio = true
        
        if(!camposVacios.Regiones && !camposVacios.Viajeros && !camposVacios.Modalidad && !camposVacios.Date && !camposVacios.Email.vacio && camposVacios.Email.valido ){
            vacio = false
            setValidate(false)
        }
        
        return vacio
    }
    
    // const gtag_report_conversion = (url) => {
    //     var callback = function () {
    //       if (typeof(url) != 'undefined') {
    //         window.location = url;
    //       }
    //     };

    //     let send = gtag.listTags.filter(item=> item.pais == Cookie.get('location')?.toLowerCase())[0].send_to_cotizar
       
    //     gtag.event('event','conversion',{
    //         action: 'conversion',
    //         category: 'cotizacion',
    //         label: 'cotizado',
    //         'send_to': send,
    //         // 'event_callback': callback
    //     })
    //     return false;
    //   }


      const isCountry =  ()=>{

        let state = false
        if (typeof window !== 'undefined') {
          paises.map(item=>{
              if(item.codigo.toLowerCase() == Cookie.get('location').toLowerCase()){ 
                // console.log(item.codigo.toLowerCase() == Cookie.get('location').toLowerCase(),item.codigo.toLowerCase(),Cookie.get('location').toLowerCase());
                state = true
              }
            })
        }
        return state
      }

    const postCotizar = async (data) => {
        try {
            
            let datos = await axios.post(process.env.NEXT_PUBLIC_URL_POST_COTIZACION, data);
            const res = datos.data[0]
           
            Cookie.set('cotizacionID', res.cotizacionId)
            localStorage.setItem('correo', res.correo)
            
            // if(isCountry()){   
            //     // console.log('if')
            //     gtag_report_conversion(router.asPath)
            // }
            // else{
            //     // console.log('else')
            // }
            
            if (router.pathname == '/[userId]/planes') {
                setCotizando(false)
                router.replace(router.asPath)
            }
            else {
                setCotizando(false)
                router.push({pathname: '/[userId]/planes', query: { userId: router.query.userId}})
            }

            
            //ENVIAR res.cotizacionId => 27491 
            //para que me muestrelos productos
        }
        catch (e) {
            console.log(e.response.data)
            setCotizando(false)

        }
    }


 

    const handleChange = (campo, valor) => {
        let producto = cotizacion
        switch (campo) {
            case 'Modalidad':
                let mod = modalidad.find(item => item.id == valor)
                producto[campo] = mod.nombreB2C
                if(initialCotizacion.Date.from != cotizacion.Date.from ){
                    if(mod.id != 1){
                        setFecha({selection:date[0]})
                    }
                    else{
                    //     setDate([
                    //         {
                    //             startDate: new Date(),
                    //             endDate: new Date(),
                    //             color:'#00239c',
                    //             key: 'selection'
                    //         }
                    //     ])
                    //    producto['Date'].from = format(new Date(), 'dd-MMM-yy', {locale: spanish})
                    //    producto['Date'].to = format(new Date(), 'dd-MMM-yy', {locale: spanish})
                    }
                }
                setCamposVacios({...camposVacios,'Modalidad':false})
                break;
            case 'Regiones':
                let reg = regiones.find(item => item.id == valor)                
                producto[campo] = reg.nombreB2C
                setCamposVacios({...camposVacios,'Regiones':false})
                break;
            case 'Email':                
                let validate = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(valor)
                producto[campo] = valor
                setCamposVacios({...camposVacios,'Email':{vacio:false,valido:validate}})
            
                break;
            case 'Date':
                let state = true
                producto[campo].from = format(valor.startDate, 'dd-MMM-yy', {locale: spanish})
                if(format(new Date(), 'dd-MMM-yy', {locale: spanish}) != format(valor.endDate, 'dd-MMM-yy', {locale: spanish})){
                    producto[campo].to = format(valor.endDate, 'dd-MMM-yy', {locale: spanish})
                    state = false
                }
                setCamposVacios({...camposVacios,'Date':state})
            break;

        }
        setCotizacion(producto)
        setOpenInfo(null)
    }

    const setFecha = (item,tipo) =>{
        let fecha = date[0]

        if(tipo == 'desde'){
            fecha.startDate = item
            if(cotizacion['Date'].to != 'Hasta'){
                var months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
                let fec = format(item, 'dd-MMM-yy', {locale: spanish})
                let mesTo = months.indexOf(fec.split('-')[1]);
                let fechaAux = new Date(Number('20'+fec.split('-')[2]),mesTo,fec.split('-')[0])
                fechaAux = addDays(fechaAux,1)
                fecha.endDate = fechaAux
            }
        }

        if(tipo == 'hasta'){
            fecha.endDate = item
        }
        
        if(cotizacion.Modalidad != initialCotizacion.Modalidad){
            let modali = modalidad.filter(item => item.nombreB2C == cotizacion.Modalidad)[0].id
            if(modali != 1){
                let inicio = fecha.startDate
                fecha.endDate = addDays(addYears(inicio,1),-1)
            }
        }
        setDate([fecha])
        cotizacion['Date'].from = format(fecha.startDate, 'dd-MMM-yy', {locale: spanish})
        
        if(cotizacion['Date'].to != 'Hasta'){
            cotizacion['Date'].to = format(fecha.endDate , 'dd-MMM-yy', {locale: spanish})
        }

        setCotizacion(cotizacion)
        setOpenInfo(null)
    }




    return (
        <>
         {cotizando ? <Loading/> : null}
            <div role='form' aria-label={config?.etiquetas?.Title_Cotizador} className={`relative w-full xl:max-w-screen-xl mx-auto self-end justify-self-end z-40 pointer-events-none ${router.pathname != '/[userId]/planes' ? 'mt-[130%] sm:mt-[30%] lg:mt-[25%]' : ''}`}>
                <h1 className='text-xl sm:text-2xl font-bold text-white mb-4 pointer-events-auto inline-block'>{config?.etiquetas?.Title_Cotizador}</h1>
                <div className='flex flex-col sm:flex-wrap 2xl:flex-nowrap sm:flex-row gap-4 pointer-events-auto'>
                    <article rol='grupo' className='flex-1 relative sm:static max-w-full min-w-[201px]'>
                        <button onClick={() => { handleClickOpenInfo('donde') }} className=' flex items-center sm:text-center gap-3 rounded-lg py-5 px-6 w-full text-principal bg-white focus-within:bg-gray-100'>
                            <span className="icon-corazon text-lg text-gris-medio" aria-hidden="true"></span>
                            <span aria-live='polite' className='whitespace-nowrap overflow-hidden'>{cotizacion.Regiones}</span>
                        </button>
                        {openInfo == 'donde' &&
                            <div className={`sm:absolute flex flex-col gap-5 rounded-lg overflow-hidden sm:w-max text-principal bg-white z-10 ${router.pathname != '/[userId]/planes' ? 'sm:-translate-y-full sm:-mt-20 sm:animate-topIn' : 'sm:-mt-1 sm:animate-botIn sm:translate-y-4'} `}>
                                <ul aria-label={cotizacion.Regiones} className='leading-none text-left'>
                                    {regiones.map(item => {
                                        return <li className='' key={item.id}><button onClick={() => { handleChange('Regiones', item.id) }} className='w-full py-2 first-of-type:pt-4 last-of-type:pb-3 px-6 text-left hover:bg-principal-claro focus:bg-principal-claro focus:outline-none'>{item.nombreB2C}</button></li>
                                    })}
                                </ul>
                            </div>
                        }

                        {validate && camposVacios.Regiones && openInfo != 'donde' &&
                            <div className='leading-none sm:absolute -translate-y-full flex flex-col rounded-lg text-danger bg-white z-10 py-1 px-2 text-xs'>
                                Ingrese su destino
                            </div>
                        }
                        
                    </article>
                    <article rol='grupo' className='flex-1 relative sm:static max-w-full min-w-[183px]'>
                        <button onClick={() => { handleClickOpenInfo('modalidad') }} className='flex items-center sm:text-center gap-3 rounded-lg py-5 px-6 w-full text-principal bg-white focus-within:bg-gray-100'>
                            <span className="icon-modalidad text-lg text-gris-medio" aria-hidden="true"></span>
                            <span aria-live='polite' className='whitespace-nowrap overflow-hidden'>{cotizacion.Modalidad}</span>
                        </button>
                        {openInfo == 'modalidad' &&
                            <div className={`sm:absolute flex flex-col gap-5 rounded-lg overflow-hidden sm:w-max text-principal bg-white z-10 ${router.pathname != '/[userId]/planes' ? 'sm:-translate-y-full sm:-mt-20 sm:animate-topIn' : 'sm:-mt-1 sm:animate-botIn sm:translate-y-4'} `}>
                                <ul aria-label={cotizacion.Modalidad} className='leading-none text-left'>
                                    {modalidad.map(moda => {
                                        return <li className='' key={moda.id}><button onClick={() => { handleChange('Modalidad', moda.id) }} className='w-full py-2 first-of-type:pt-4 last-of-type:pb-3 px-6 text-left hover:bg-principal-claro focus:bg-principal-claro focus:outline-none'>{moda.nombreB2C}</button></li>
                                    })}
                                </ul>
                            </div>
                        }
                         {validate && camposVacios.Modalidad && openInfo != 'modalidad' &&
                            <div className='leading-none sm:absolute -translate-y-full flex flex-col rounded-lg text-danger bg-white z-10 py-1 px-2 text-xs'>
                                Ingrese tipo de viaje
                            </div>
                        }
                    </article>
                    <article className='flex-1 relative max-w-full sm:min-w-[400px] xl:min-w-[355px]'>
                        <div className='flex flex-col sm:flex-row sm:items-center sm:text-center justify-between rounded-lg w-full text-principal bg-white focus-within:bg-gray-100'>
                            <button onClick={() => { handleClickOpenInfo('fecha_desde') }} className='sm:text-center pt-5 pb-2 sm:py-5 pl-6 rounded-lg text-principal bg-white focus-within:bg-gray-100'>
                                <span className='flex gap-3 items-center sm:text-center'>
                                    <span className="icon-calendario text-lg text-gris-medio" aria-hidden="true"></span>
                                    <span aria-live='polite' className='whitespace-nowrap overflow-hidden'>
                                        {cotizacion.Date.from}
                                    </span>
                                    <span className="icon-chevron text-sm self-center text-principal" aria-hidden="true"></span>
                                </span>
                            </button>
                            <span className="icon-flecha-doble text-sm text-gris-medio hidden sm:block sm:rotate-0 pl-8 sm:pl-0" aria-label="hasta"></span>
                            <button onClick={() => { handleClickOpenInfo('fecha_hasta') }} className='sm:text-center pt-2 pb-5 sm:py-5 pl-6 sm:pl-0 pr-6 rounded-lg text-principal bg-white focus-within:bg-gray-100' >
                                <span className='flex gap-3 items-center sm:text-center'>
                                    <span className="icon-calendario text-lg text-gris-medio" aria-hidden="true"></span>
                                    <span aria-live='polite' className='whitespace-nowrap overflow-hidden'>
                                    {cotizacion.Date.to}
                                    </span>
                                    <span className="icon-chevron text-sm self-center text-principal" aria-hidden="true"></span>
                                </span>
                            </button>
                        </div>
                        {openInfo == 'fecha_desde' &&
                            <div className={`sm:absolute left-0 flex flex-col rounded-lg overflow-hidden border xl:border-none sm:w-max max-w-full sm:max-w-lg text-principal bg-white z-10 -translate-y-14 ${router.pathname != '/[userId]/planes' ? 'sm:-translate-y-full sm:-mt-20 sm:animate-topIn' : 'sm:-mt-1 sm:animate-botIn sm:translate-y-4'} `}>
                                {/* <DateRange
                                    onChange={item => { setFecha(item) }}
                                    moveRangeOnFirstSelection={false}
                                    ranges={date}
                                    months={isMobile}
                                    direction="horizontal"
                                    displayMode="dateRange"
                                    fixedHeight={true}
                                    minDate={addDays(new Date(), 0)}
                                    monthDisplayFormat="MMMM yyyy"
                                    locale={spanish}
                                    showMonthAndYearPickers={true}
                                    showDateDisplay={false}
                                    rangeColors={['#3d91ff', '#3ecf8e', '#fed14c']}
                                    ariaLabels={{
                                        dateInput: {
                                            date: { startDate: "start date input of selction 1", endDate: "end date input of selction 1" },
                                        },
                                        monthPicker: "Mes",
                                        yearPicker: "Año",
                                        prevButton: "Mes anterior",
                                        nextButton: "Mes siguiente",
                                      }}
                                /> */}
                                 <Calendar
                                        direction="horizontal"
                                        minDate={addDays(new Date(), 0)}
                                        monthDisplayFormat="MMMM yyyy"
                                        locale={spanish}
                                        showMonthAndYearPickers={true}
                                        fixedHeight={true}
                                        onChange={item => { setFecha(item,'desde') }}
                                />
                            </div>
                        }
                        {openInfo == 'fecha_hasta' &&
                            <div className={`sm:absolute right-0 flex flex-col rounded-lg overflow-hidden border xl:border-none sm:w-max max-w-full sm:max-w-lg text-principal bg-white z-10 ${router.pathname != '/[userId]/planes' ? 'sm:-translate-y-full sm:-mt-20 sm:animate-topIn' : 'sm:-mt-1 sm:animate-botIn sm:translate-y-4'} `}>
                                 <Calendar
                                 className="m-0"
                                        direction="horizontal"
                                        minDate={addDays(date[0].startDate, 1)}
                                        monthDisplayFormat="MMMM yyyy"
                                        locale={spanish}
                                        showMonthAndYearPickers={true}
                                        fixedHeight={true}
                                        shownDate={addDays(date[0].startDate, 1)}
                                        onChange={item => { setFecha(item,'hasta')  }}
                                />
                            </div>
                        }
                         {validate && camposVacios.Date && openInfo != 'fecha' &&
                            <div className='leading-none sm:absolute -translate-y-full flex flex-col rounded-lg text-danger bg-white z-10 py-1 px-2 text-xs'>
                                Ingrese la fecha
                            </div>
                        }

                    </article>
                    <article rol='grupo' className='flex-1 relative sm:static max-w-full min-w-[170px]'>
                        <button onClick={() => { handleClickOpenInfo('viajeros') }} className='relative flex items-center sm:text-center gap-3 rounded-lg py-5 px-6 w-full text-principal bg-white focus-within:bg-gray-100'>
                            <span className="icon-pasajeros text-lg text-gris-medio" aria-hidden="true"></span>
                            <span className='whitespace-nowrap overflow-hidden'>Viajeros</span>
                            <span aria-live='polite' className='flex-none w-7 h-7 bg-principal text-white rounded-full leading-none flex items-center sm:text-center justify-center'>
                                {cotizacion?.Viajeros}
                            </span>
                        </button>
                        {openInfo == 'viajeros' &&
                            <div className={`sm:absolute flex flex-col sm:grid sm:grid-cols-4 xl:grid-cols-2 gap-3 sm:gap-5 rounded-lg py-5 px-6 xl:w-max text-principal bg-white z-10 sm:left-0 xl:left-auto sm:right-0 xl:right-auto ${router.pathname != '/[userId]/planes' ? 'sm:-translate-y-full sm:-mt-20 sm:animate-topIn' : 'sm:-mt-1 sm:animate-botIn sm:translate-y-4'} `}>
                                {/* <div className='flex flex-col items-center sm:text-center leading-none'>
                                    <h3 className='text-lg lg:text-2xl font-bold'>Hasta 75 años</h3>
                                    <p className='text-md'>De 0 a 75 años</p>
                                    <Contador handleCounter={counterMenores} />
                                </div>
                                <div className='flex flex-col items-center sm:text-center leading-none'>
                                    <h3 className='text-lg lg:text-2xl font-bold'>Desde 76 años</h3>
                                    <p className='text-md'>De 76 años en adelante</p>
                                    <Contador handleCounter={counterMayores1} />
                                </div> */}
                                <div className='flex sm:flex-col justify-between items-center sm:text-center leading-none lg:mx-4 lg:my-2 lg:w-40 border-b sm:border-none pb-3 sm:pb-0'>
                                    <div>
                                        <h3 className='text-lg lg:text-2xl font-bold'>Hasta 20 años</h3>
                                        <p className='text-md'>De 0 a 20 años</p>
                                    </div>
                                    <Contador handleCounter={counterMenores} />
                                </div>
                                <div className='flex sm:flex-col justify-between items-center sm:text-center leading-none lg:mx-4 lg:my-2 lg:w-40 border-b sm:border-none pb-3 sm:pb-0'>
                                    <div>
                                        <h3 className='text-lg lg:text-2xl font-bold'>Desde 21 años</h3>
                                        <p className='text-md'>De 21 a 75 años</p>
                                    </div>
                                    <Contador handleCounter={counterMayores1} />
                                </div>
                                <div className='flex sm:flex-col justify-between items-center sm:text-center leading-none lg:mx-4 lg:my-2 lg:w-40 border-b sm:border-none pb-3 sm:pb-0'>
                                    <div>
                                        <h3 className='text-lg lg:text-2xl font-bold'>Desde 76 años</h3>
                                        <p className='text-md'>De 76 a 85 años</p>
                                    </div>
                                    <Contador handleCounter={counterMayores2} />
                                </div>
                                <div className='flex sm:flex-col justify-between items-center sm:text-center leading-none lg:mx-4 lg:my-2 lg:w-40'>
                                    <div>
                                        <h3 className='text-lg lg:text-2xl font-bold'>Desde 86 años</h3>
                                        <p className='text-md'>De 86 a 90 años</p>
                                    </div>
                                    <Contador handleCounter={counterMayores3} />
                                </div>
                            </div>
                        }
                        {validate && camposVacios.Viajeros && openInfo != 'viajeros' &&
                            <div className='leading-none sm:absolute -translate-y-full flex flex-col rounded-lg text-danger bg-white z-10 py-1 px-2 text-xs'>
                                Ingrese cantidad de viajeros
                            </div>
                        }
                    </article>
                   
                    <article rol='grupo' className='flex-1 relative sm:static max-w-full sm:w-[250px] sm:min-w-[250px] xl:w-44 xl:min-w-[11rem]'>
                        <button id='elmail' onClick={() => { handleClickOpenInfo('mail') }} className='flex items-center sm:text-center gap-3 rounded-lg py-5 px-6 w-full text-principal bg-white focus-within:bg-gray-100'>
                            <span className="icon-mail text-lg text-gris-medio" aria-hidden="true"></span>
                            <span aria-live='polite' className='text-ellipsis overflow-hidden max-w-full'>{cotizacion.Email == '' ? 'Email' : cotizacion.Email}</span>
                        </button>
                        {openInfo == 'mail' &&
                            <div className={`sm:absolute flex flex-col gap-5 rounded-lg py-5 px-6 sm:w-max text-principal bg-white z-10 ${router.pathname != '/[userId]/planes' ? 'sm:-translate-y-full sm:-mt-20 sm:animate-topIn' : 'sm:-mt-1 sm:animate-botIn sm:translate-y-4'} `}>
                                <div className='flex flex-col items-center sm:text-center leading-none'>
                                    <input className='w-full ' type="email" name="email" placeholder="Email" onBlur={() => handleChange('Email', event.target.value)} defaultValue={cotizacion.Email != 'Email' ? cotizacion.Email : ''} />
                                </div>
                            </div>
                        }
                        {validate && camposVacios.Email.valido == false && openInfo != 'mail' && 
                            <div className='leading-none sm:absolute -translate-y-full flex flex-col rounded-lg text-danger bg-white z-10 py-1 px-2 text-xs'>
                                Ingrese un email válido
                            </div>
                        }
                    </article>

                    <button type='submit' onClick={() => { submit() }} className='flex-1 py-5 px-6 rounded bg-terciario btn btn-amarillo lg:w-56'>{config?.etiquetas?.Button_Cotizar}</button>
                </div>
            </div>
            {openInfo != null &&
                <>
                    <div className='absolute w-full h-full bg-black top-0 left-0 bg-opacity-20 z-30' onClick={() => { setOpenInfo(null) }}></div>
                </>
            }


        </>
    )
}