import { useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/router';
import axios from 'axios';
import Cookie from 'js-cookie';
import { useTranslation } from 'react-i18next';
import Script from 'next/script'

import {formatNum} from '../../helpers/index'
import FormContratar from '../../components/FormContratar';
import { getRegion,getPromoActual } from '../../apiFunctions/index'
import { useLocation } from '../../context/locationContext';
import {useLocalStorage} from '../../helpers/index';
import {useConfig} from '../../context/configContext';
import {useShare} from '../../context/shareContext';
import ShareInvalid from '../../components/ShareInvalid';

import { format } from 'date-fns';



export default function Contratar (){
    const [t, i18n] = useTranslation('global');

    const router = useRouter()
    const [idContratar,setIdContratar] = useState(undefined)
    // const idContratar =  router.query.idContratar
    const [producto, setProducto] = useState(null)
    const [region, setRegion] = useState('')
    const [cotizacionProducto, setCotizacionProducto] = useState(null)
    const { location, setLocation } = useLocation()
    const [diferenciaDias, setDiferenciaDias] = useState(0)
    const {config, setConfig} = useConfig()
    const {isShared, setIsShared} = useShare()    

    const [etiquetas,setEtiquetas] = useLocalStorage('etiquetas','')
    const [cotizacion,setCotizacion] = useState(null)
    const [ready,setReady] = useState(false)
    // const { id, slug } = useParams();
    
    const [ready2,setReady2] = useState(false)
    const [validShare,setValidShare] = useState(true)
    const [email,setEmail] = useState('')
    const [phoneInvalid,setPhoneInvalid] = useState('')
    const [promoLocalStorage,setPromoLocalStorage]= useLocalStorage('promoActual','')
    const locationRef = useRef('LAT');
    const [currentCountry, setCurrentCountry] = useState(''); 

    useEffect(()=>{
       if(window.location.href.includes('?')){
            setIsShared(true)
       }
       else{
        setIsShared(false)
        if(localStorage.getItem('correo')){
            setEmail(localStorage.getItem('correo'))
        }
        if(Cookie.get('location') && Cookie.get('cotizacionID')){

            const locationTemp = Cookie.get('location')
            const cotizacionTemp = Cookie.get('cotizacionID')
            setLocation(locationTemp)
            setCotizacion(cotizacionTemp)
            getPlanes(cotizacionTemp)
            setReady(true)
            setReady2(true)
        }
        else{
            router.replace('/')
        }
       
      }

// eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(()=>{
        if(isShared){
            const contratar = router.query.idContratar
            setIdContratar(contratar)
            obtenerData() 
            setReady(true)
        }
    },[router.query])


    useEffect(() => {
        locationRef.current = Cookie.get('location')
        getCurrentCountry()
    })
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

    const obtenerData = async () => {
        setIsShared(true)
        var data = ''
        try {
            const contratar=router.asPath.split('?')[1].split('=')[1]

            let datos = await axios.get(process.env.NEXT_PUBLIC_API_SHARED_URL+contratar+'/detail');
            if(datos.data.response == null) router.push({pathname: '/[userId]', query: { userId: router.query.userId}})
            const id_store = JSON.parse(JSON.parse(datos.data.response.json)).sigla || 'argentina'
            data = JSON.parse(datos.data.response.json)
            data = JSON.parse(data).data
            // console.log(data.personas)
            data.producto.id_store=id_store
            data.producto.id_share = contratar
            setEmail(JSON.parse(JSON.parse(datos.data.response.json)).data.producto.correo)
            validateShare(datos.data.response)
            setPhoneInvalid(datos.data.response.phone)
            Cookie.set('cotizacionID',data.cotizacionId)
            // data.producto.monedaId = data.producto.prestaciones[0].monedaId
            localStorage.setItem('planContratar',JSON.stringify(data.producto))
            setReady2(true)
            data.producto.fechaDesde = data.producto.fechaDesde.split(' ')[0]
            data.producto.fechaHasta = data.producto.fechaHasta.split(' ')[0]
            setProducto(data.producto)

            buscarRegion(data.producto.regionId)
            
            if(id_store.toLowerCase() != 'argentina'){
                Cookie.set('location',id_store)
                setLocation(id_store)
            }else{
                Cookie.set('location','ARGENTINA')
                setLocation('ARGENTINA')
            }
            buscarPromo(data)
        }
        catch (e) {
            console.log('error:',e)
        }
    }


    const validateShare = async({status,json} ) =>{
        let valid = true
        let data = JSON.parse(json)
        data = JSON.parse(data).data
        // console.log(status, data)
        if(status == 'inactive'  ){
            valid = false
        }
        else{
            try {
                let res = await axios.get(process.env.NEXT_PUBLIC_URL_COTIZACION+'?cotizacionId='+data.cotizacionId);
                valid = true
                
            } catch (error) {
                valid = false
            }
            // 
        }
        setValidShare(valid)

    }

    

    const buscarRegion = (idRegion) => {

        getRegion(Cookie.get('location')).then(res => {
            let region = res.filter(item => item.id == idRegion)
            setRegion(region[0].nombreB2C)
        })
    }

    const buscarPromo = (data) => {  
        getPromoActual(Cookie.get('location')).then(res => {
            Cookie.set('promoActual',JSON.stringify(res))
            setPromoLocalStorage(res)
            data.producto.promocion = res
            setCotizacionProducto(data.producto)
            Recotizar(data)
        })
    }

    const getPromocion = async ()=>{
       return await getPromoActual(Cookie.get('location'))
    }

    const getDateDiff = (time1, time2) => {

        let date1=new Date(time1[0], time1[1] -1, time1[2])
        let date2=new Date(time2[0], time2[1] -1, time2[2])
        let difference = date2 > date1 ? date2 - date1 : date1 - date2
        let diff_days = Math.floor( difference / (1000 * 3600 * 24) )

        setDiferenciaDias(diff_days)
    }

    // function getMonthDifference(startDate, endDate) {
    //     return (
    //       endDate.getMonth() -
    //       startDate.getMonth() +
    //       12 * (endDate.getFullYear() - startDate.getFullYear())
    //     );
    //   }

    const getPlanes = async () => {
        try {
            const cotizacionID = Cookie.get('cotizacionID')
            let prod = JSON.parse(localStorage.getItem('planContratar'))
            prod.fechaDesde = prod.fechaDesde.split(' ')[0]
            prod.fechaHasta = prod.fechaHasta.split(' ')[0]
            setProducto(prod)
            getDateDiff(prod.fechaDesde.split(' ')[0].split('/').reverse(),prod.fechaHasta.split(' ')[0].split('/').reverse())
            let datos = await axios.get(process.env.NEXT_PUBLIC_URL_SEARCH+'?cotizacionId='+cotizacionID);
            const cotizacion = datos.data[0]
            let product = null
            let moneda = null
            cotizacion.productos.map((item,idx)=>{
                if(item.producto.id == prod.producto.id){
                    product = item  
                    moneda = item.monedaId                  
                }
            })
            let recotizar = {};
            
            recotizar['cotizacionId'] = cotizacionID
            //crashea region porque no existe promo, creo que es demasiado grande para cookie
            let promo = await getPromocion()
            product.producto.monedaId = moneda
            recotizar['producto'] = {
                ...product,
                id:prod.id,
                producto:product.producto,
                promocion:promo
            }
            
            recotizar['personas'] = recotizar['producto'].personas

            setCotizacionProducto(recotizar.producto)
            setRegion(cotizacion.region)
            Recotizar(recotizar)

        }
        catch (e) {
            // alert(e.response.data.message)
            console.log('err=> ',e)
          if(e.response.data.code == 400) router.push({pathname: '/[userId]', query: { userId: router.query.userId}})
        }
      }


      const Recotizar = async (producto) =>{
        try {
            let datos = await axios.post(process.env.NEXT_PUBLIC_URL_POST_RECOTIZACION, producto);
            const res = datos.data[0]
            Cookie.set('cotizacionID', res.cotizacionId)
        }
        catch (e) {
          console.log(e.response.data)
        }

      }

    const getConfig = async () => {

        try {
            let COD = Cookie.get('location')
            if(!COD) return
            let logData = await axios.get(process.env.NEXT_PUBLIC_API_CONFIG+'?codigo='+COD);
            const data = logData.data[0]
            setConfig(data)
            setEtiquetas(data)

        }
        catch (e) {
        console.log(e.response.data)
        }
    }  
  
   
  
    useEffect(()=>{
        if(!localStorage.getItem('etiquetas')){
            getConfig()
        }
        else{
            setConfig(etiquetas)
        }   
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
        <>
         <Script src="https://js.dlocal.com/"></Script>

        {!validShare && <ShareInvalid phone={phoneInvalid}/>}
            <section className='w-full text-principal'>
                <h1 className='max-w-screen-xl mx-auto text-4xl font-extrabold pt-8 lg:pt-10 px-6 2xl:px-0'>{config?.etiquetas.Title_Contratacion}</h1>
                <div className='max-w-screen-xl mx-auto flex flex-col lg:flex-row justify-center gap-6 lg:gap-8 px-6 2xl:px-0 pb-14'>
                    <div className='flex-1 flex flex-col order-2 lg:order-1'>
                        {ready && 
                            <FormContratar correo={email} producto={cotizacionProducto} ready={ready2} />
                        }
                    </div>
                    <div className='lg:w-1/4 flex flex-col order-1 lg:order-2'>
                        <h2 className='lg:text-xl pt-2 mb-2'>{config?.etiquetas.Info_DetalleContratacion}</h2>
                        <article className='flex flex-col rounded-lg shadow-3xl overflow-hidden'>
                        {producto != null ? 
                        <>
                            <header className='w-full py-6 px-8 bg-turquesa'>
                                <h3 className='text-2xl font-bold'>{producto.producto.nombreB2C}</h3>
                                <p className='font-light'>{producto.producto.descripcion}</p>
                            </header>
                                
                            <div className='w-full py-6 px-8 flex flex-col gap-1'>
                                {
                                    diferenciaDias? 
                                        <h2 className='font-bold'>{t("formContratar.estadia")} {diferenciaDias} {config?.etiquetas.Label_Dias}  </h2>
                                    : <></>
                                }
                                    
                                 {/* <h2 className='font-bold'>Larga estadía + 3 meses </h2> */}
                                <p className='flex gap-3 items-center text-sm font-light'><span className='icon-calendario text-lg text-gris-medio'></span>{t("formContratar.del")} {producto.fechaDesde} {config?.etiquetas.Label_SeparadorFechas} {producto.fechaHasta} Inclusive</p>
                                <p className='flex gap-3 items-center text-sm font-light'><span className='icon-pasajeros text-lg text-gris-medio'></span>{producto.personas.length} {config?.etiquetas.Label_Pasajeros}</p>
                                <p className='flex gap-3 items-center text-sm font-light'><span className='icon-marker text-lg text-gris-medio'></span>{region}</p>
                                {/* <h2 className='text-2xl border-t-2 border-gris-claro pt-5 pb-3 mt-5'>Detalles del precio</h2>
                                <p className='flex gap-3 items-center justify-between'>
                                    <span className=''>{producto.producto.nombreB2C}</span>
                                    <span className=''>{producto.monedaLocalSimbolo} {formatNum(producto.precioEnPesos)}</span>
                                </p> */}
                                <div className='flex gap-3 items-center justify-between border-t-2 border-gris-claro pt-5 mt-5'>
                                    <p className='font-extrabold text-lg'>{config?.etiquetas.Label_DetalleTotal}</p>
                                    {(producto.medioDePago?.toLowerCase() == 'decidir') ? 
                                    <p className='flex-1 flex flex-col items-end'>
                                         {producto.promocion?.length > 0 ?
                                          <>
                                            <span className='text-gris-medio line-through font-light text-sm leading-none'>{producto.monedaLocalSimbolo}  {formatNum((Number(producto.tipoDeCambioMonto.replace(',', '.')) * producto.precioSinPromocion))}</span>
                                            </>
                                            :null}
                                        <span className='text-lg font-extrabold'>{producto.monedaLocalSimbolo} {formatNum(producto.precioEnPesos)}</span>
                                        <span className='text-lg leading-none'>{producto.monedaSimbolo} {formatNum(producto.precio)}</span>
                                    </p>
                                    :
                                    <p className='flex-1 flex flex-col items-end'>
                                        {producto.promocion?.length > 0 ?
                                        <>
                                            <span className='text-gris-medio line-through font-light text-sm leading-none'>{producto.monedaSimbolo}  {formatNum(producto.precioSinPromocion)}</span>
                                        </>
                                        :null}
                                        <span className='text-lg font-extrabold'>{producto.monedaSimbolo} {formatNum(producto.precio)}</span>
                                    </p> 
                                    }
                                    
                                </div>
                            </div>
                        </>
                           : null}
                        </article>
                    </div>
                </div>
            </section>
        </>
        //</AppLayout>
    )
}
