import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import MultiAsistencia from '../../components/MultiAsistencia';
import { getPromoActualMulti } from '../../apiFunctions/index'
import { useLocalStorage } from '../../helpers/index';
import { useConfig } from '../../context/configContext';
import Loading from '../../components/Loading';
import Modal from '../../components/Modal';
import { formatNum } from '../../helpers/index'
import useMediaQuery from '../../hooks/useMediaQuery';
import MultiCardDetail from '../../components/MultiAsistencia/MultiCardDetail';
import { HeaderMulti } from '../../components/AppLayout/HeaderMulti';
import { FooterMulti } from '../../components/AppLayout/FooterMulti';

export default function Contratar() {
    const [t, i18n] = useTranslation('global');
    const router = useRouter()
    const [idUser, setIdUser] = useState(undefined)
    const [producto, setProducto] = useState(null)
    const [cotizacionProducto, setCotizacionProducto] = useState(null)

    const urlAssets = process.env.NEXT_PUBLIC_URL_BASE_ASSETS
    const socialMedia = {
        facebook: 'https://www.facebook.com/EuropAssistanceLatam',
        instagram: 'https://www.instagram.com/europassistance_latam'
    }
    const { config, setConfig } = useConfig()
    const [etiquetas, setEtiquetas] = useLocalStorage('etiquetas', '')

    const [loading, setLoading] = useState(true);
    const [Cotizar, setCotizar] = useState(true);


    const showLogoUsuario = true;


    const modal = useRef(null)

    const [seguros, setSeguros] = useState([])

    const [showPlanes, setShowPlanes] = useState(true)
    const [cotizacionID, setCotizacionID] = useState('')
    const [promocion, setPromocion] = useState(null)

    const [searchPlanes, setSearchPlanes] = useState(null)

    useEffect(() => {
        if(router.query.userId != undefined){
            getConfig(router.query.userId)
            setLoading(false)
            setIdUser(router.query.idUser)
            
        }     
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query])


    useEffect(() => {
        cotizacionID != '' && getPlanes()
    }, [cotizacionID])

    useEffect(() => {
        if (cotizacionProducto != null) {
            Recotizar()
        }
    }, [cotizacionProducto])


    const modalDetail = useRef(null)
    const openButtonRef = useRef(null)

    //details element open close segun tamaño de pantalla
    const isMobile = useMediaQuery('(max-width: 640px)');



    const submit = async () => {
        let codigo = localStorage.getItem('cod_user').toLowerCase()
        let promo = await getPromocion()
        setPromocion(promo)
        let cotizar = {
            "edades": [35],
            "correo": "leandro.arroyo@wiperagency.com",
            "codigoUsuario": codigo,
            "promocionId": promo.id,
            "pieLegal": promo.labelPieLegal,
            "tipoDescuento": 0,
            "porcentajeDescuento": 0,
            "montoDescuento": 0,
            "razonDescuento": "",
        }
        postCotizar(cotizar)
    }

    const postCotizar = async (data) => {
        try {
            let datos = await axios.post(process.env.NEXT_PUBLIC_URL_POST_COTIZACION_MULTI, data);
            const res = datos.data[0]

            localStorage.setItem('cotizacionID', res.cotizacionId)
            setCotizacionID(res.cotizacionId)
            setCotizar(false)
            setLoading(false)
        }
        catch (e) {
            setLoading(false)
            setCotizar(false)
            modal.current.openModal()
            console.log(e.response.data)
        }
    }


    const getConfig = async (codigo) => {
        try {
            localStorage.setItem('cod_user', codigo)
            let logData = await axios.get(process.env.NEXT_PUBLIC_URL_CONFIG_MULTI + '?codigo=' + codigo);
            const data = logData.data[0]
            setConfig(data)
            setEtiquetas(data)
            submit()
        }
        catch (e) {
            modal.current.openModal()
            console.log(e.response.data)
            setLoading(false)

        }
    }




    const getPromocion = async () => {
        return await getPromoActualMulti(localStorage.getItem('cod_user'))
    }


    const getPlanes = async () => {
        try {

            let prod = JSON.parse(localStorage.getItem('planContratar'))
            setProducto(prod)
            let datos = await axios.get(process.env.NEXT_PUBLIC_URL_SEARCH_MULTI + '?cotizacionId=' + cotizacionID);
            const cotizacion = datos.data[0]
            let orderSeguros =  cotizacion.productos.sort((a, b) => a.precio - b.precio);
            setSeguros(orderSeguros)
            setSearchPlanes(cotizacion)
            setLoading(false)
        }
        catch (e) {
            console.log('err=> ', e)
            setLoading(false)
            modal.current.openModal()

        }
    }


    const Recotizar = async () => {
        let recotizar = armarObjetoRecotizar()
        try {
            let datos = await axios.post(process.env.NEXT_PUBLIC_URL_POST_RECOTIZACION_MULTI, recotizar);
            const res = datos.data[0]
            localStorage.setItem('cotizacionID', res.cotizacionId)
        }
        catch (e) {
            console.log(e.response.data)
            modal.current.openModal()
        }

    }

    const armarObjetoRecotizar = () => {
        const cotizacion = searchPlanes
        let prod = cotizacionProducto
        let product = null
        let moneda = null
        cotizacion.productos.map((item, idx) => {
            if (item.producto.id == prod.producto.id) {
                product = item
                moneda = item.monedaId
            }
        })
        let recotizar = {};
        recotizar['cotizacionId'] = cotizacionID
        product.producto.monedaId = moneda
        recotizar['producto'] = {
            ...product,
            id: prod.id,
            producto: product.producto,
            promocion: promocion
        }
        recotizar['personas'] = recotizar['producto'].personas

        return recotizar
    }

    const getPrestaciones = (prestaciones) => {
        return prestaciones.map((prestacion, idx) =>
        (
            idx < 5 ? <li key={idx} className='flex gap-1 pb-2'><span className="flex-none icon-done text-[8px] w-4 h-4 -mt-1 flex justify-center items-center rounded-full bg-whatsapp text-white" aria-hidden="true"></span>
                {prestacion.labelNombre} </li> : null
        )
        )
    }



    return (
        <>
            <header role='banner'>
                <div className='w-full max-w-screen-xl flex items-center gap-4 lg:gap-6 py-4 lg:py-6 px-6 2xl:px-0 m-auto'>
                    <div className='flex-1 min-w-max'>
                        <div className="flex items-center p-2 gap-2">
                            <img src="/assets/images/europ-assitance.svg" alt={t("menu.marca")} className='w-28' />
                            {
                                showLogoUsuario && config != null && config.logo != null && <img id="img_logo2" src={`${urlAssets}${config.logo}`} alt={t("menu.marca")} className='w-28' />
                            }
                        </div>
                    </div>
                    {config ? <HeaderMulti config={config} /> : null}

                </div>
            </header>
            <section className='flex-1 w-full max-w-screen-xl mx-auto pt-8 lg:pt-10 px-6 2xl:px-0 text-principal'>
                <>
                    {
                        showPlanes ?
                            <>
                                <h1 className='text-4xl font-extrabold'>
                                    Elegí tu Producto
                                </h1>
                                <div className='flex flex-col sm:flex-row sm:flex-wrap justify-center gap-4 lg:gap-10 pt-8 lg:pt-10 pb-14'>
                                    {
                                        seguros.length > 0
                                            ?
                                            seguros.map((seguro, idKey) => {
                                                return (<article key={idKey} className='sm:max-w-[350px] sm:min-w-[280px] flex-1 flex flex-col items-center rounded-lg bg-white text-principal shadow-3xl overflow-hidden'>
                                                    <div className="sm:max-w-[350px] sm:min-w-[280px] sm:min-h-[175px] w-full sm:w-auto flex flex-col items-center rounded-lg bg-white text-principal shadow-3xl overflow-hidden">
                                                    {seguro.promocion ?
                                                        <p className='w-full py-1 px-2 text-white font-bold text-center bg-amarillo'>OFERTA {seguro.promocion?.descuento > 0 && <span>| {seguro.promocion?.descuento}%</span>}</p>
                                                        : <span className='hidden sm:block h-8'></span>
                                                    }
                                                    <h3 className='px-2 pt-6 text-2xl font-bold text-center'>{seguro.producto.nombreB2C}</h3>
                                                    <p className='px-2 text-sm font-light text-center truncate max-w-full'>{seguro.producto.descripcion}</p>
                                                    <span className='hidden sm:block h-8'></span>
                                                    {seguro.precioSinPromocion > seguro.precio ?
                                                        <p className="px-2 pt-6 text-gris-medio line-through">{seguro.monedaLocalSimbolo}  {formatNum(seguro.precioEnPesos)}</p>
                                                        :
                                                        null
                                                    }
                                                    </div>
                                                   <div className="sm:max-w-[350px] sm:min-w-[280px] sm:min-h-[141px] flex flex-col items-center rounded-lg bg-white text-principal  overflow-hidden">
                                                   <h4 className="px-2 flex gap-1 items-end mt-3"><span className="text-md mr-1">{seguro.monedaLocalSimbolo} </span><span className="text-5xl font-extrabold leading-9">{formatNum(seguro.precioEnPesos)}</span><span className="text-sm font-bold self-center pb-2 hidden">*</span>por mes</h4>
                                                    <button onClick={() => { setCotizacionProducto(seguro); setShowPlanes(false) }} className="my-5 p-3 w-44 rounded-lg text-white bg-principal shadow-sm">Contratar</button>
                                                    <details className="w-full group flex-1" open>
                                                        <summary className="group flex flex-col items-center sm:items-start px-5 py-2 text-sm cursor-pointer sm:cursor-text sm:pointer-events-none focus:outline-none">
                                                            <span className="border-b-2 border-transparent group-focus:border-principal">Beneficios</span>
                                                            <span className="icon-chevron text-sm sm:hidden transition-all ease-linear rotate-180 group-open:rotate-0"></span>
                                                        </summary>
                                                        <ul className="px-5 text-sm mb-6 leading-4 transition-opacity duration-200 opacity-0 group-open:opacity-100">
                                                            {
                                                                getPrestaciones(seguro.producto.prestaciones)
                                                            }
                                                        </ul>
                                                    </details>
                                                    <button ref={openButtonRef} onClick={() => { modalDetail.current.openModal(); setProducto(seguro) }} className="text-sm text-principal hover:text-secundario focus:text-secundario focus:outline-none border-b-2 border-principal">
                                                        Ver detalle de cobertura
                                                    </button>
                                                    <a href={config?.etiquetas.Url_CondicionesGenerales} target="_blank" rel="noreferrer" className="py-4 text-sm text-principal hover:text-secundario focus:text-secundario focus:outline-none flex items-center gap-2">
                                                        <span className='icon-mas text-lg'></span> Ver condiciones generales
                                                    </a>
                                                    <Modal ref={modalDetail}>
                                                        <MultiCardDetail producto={producto} />
                                                    </Modal>
                                                   </div>
                                                </article>)
                                            })
                                            : <Loading isMulti={true}/>
                                    }
                                </div>
                            </>
                            :
                            <>
                                <h1 className='text-4xl font-extrabold'>
                                    Completá tus Datos
                                </h1>
                                <div className='flex flex-col lg:flex-row justify-center gap-6 lg:gap-8 pb-14'>
                                    <div className='flex-1 flex flex-col order-2 lg:order-1 pt-8 lg:pt-10'>
                                        <MultiAsistencia producto={cotizacionProducto} setShowPlanes={setShowPlanes} showPlanes={showPlanes} />
                                    </div>
                                    <div className='lg:w-1/4 flex flex-col order-1 lg:order-2'>
                                        <h2 className='lg:text-xl pt-1 mb-2'>{config?.etiquetas.Info_DetalleContratacion}</h2>
                                        <article className='flex flex-col rounded-lg shadow-3xl overflow-hidden'>
                                            <>
                                                <header className='w-full py-6 px-8 bg-turquesa'>
                                                    <h3 className='text-2xl font-bold'>{cotizacionProducto.producto.nombreB2C}</h3>
                                                    <p className='font-light'>{cotizacionProducto.producto.descripcion}</p>
                                                </header>

                                                <div className='w-full py-6 px-8 flex flex-col gap-1'>
                                                     {/* <p key={idx} className='flex gap-3 items-center text-sm font-light'>
                                                            <span className="flex-none icon-done text-[8px] w-5 h-5 -mt-1 flex justify-center items-center rounded-full bg-whatsapp text-white" aria-hidden="true"></span>
                                                            {prestacion.labelNombre}
                                                        </p> */}
                                                          <details className="w-full group flex-1">
                                                          <summary className="group flex flex-col items-center px-5 py-2 text-sm cursor-pointer focus:outline-none">
                                                             <div className="group flex flex-row gap-4 items-center px-5 py-2 text-sm cursor-pointer focus:outline-none">
                                                                <span className="border-b-2 border-transparent ">Beneficios</span>
                                                                <span className="icon-chevron text-sm  transition-all ease-linear rotate-180 group-open:rotate-0"></span>
                                                             </div>
                                                              <ul className="text-sm mb-6 leading-4 transition-opacity duration-200 group-open:hidden">
                                                            {cotizacionProducto.producto.prestaciones.map((prestacion, idx) => {   
                                                                if(idx <= 4){
                                                                    return (<li key={idx} className='flex gap-3 items-center text-sm font-light'>
                                                                    <span className="flex-none icon-done text-[8px] w-5 h-5 -mt-1 flex justify-center items-center rounded-full bg-whatsapp text-white" aria-hidden="true"></span>
                                                                    {prestacion.labelNombre}
                                                                </li>)
                                                                }
                                                            })
                                                            }
                                                          </ul>
                                                          </summary>
                                                          <ul className="text-sm mb-6 leading-4 transition-opacity duration-200 opacity-0 group-open:opacity-100">
                                                          {cotizacionProducto.producto.prestaciones.map((prestacion, idx) => {   
                                                                return (<li key={idx} className='flex gap-3 items-center text-sm font-light'>
                                                                    <span className="flex-none icon-done text-[8px] w-5 h-5 -mt-1 flex justify-center items-center rounded-full bg-whatsapp text-white" aria-hidden="true"></span>
                                                                    {prestacion.labelNombre}
                                                                </li>)
                                                            })
                                                            }
                                                          </ul>
                                                      </details>
                                                    <div className='flex flex-wrap gap-x-3 items-center justify-between border-t-2 border-gris-claro pt-5 mt-5'>
                                                        <p className='font-extrabold text-lg flex-none w-full'>Valor Final</p>
                                                        <p className='font-normal text-lg'>por mes</p>
                                                        <p className='flex-1 flex flex-col items-end'>
                                                            <span className='text-lg font-extrabold'>{cotizacionProducto.monedaLocalSimbolo} {formatNum(cotizacionProducto.precioEnPesos)}</span>
                                                            <span className="font-normal text-lg ">Incluye IVA</span>
                                                        </p>

                                                    </div>
                                                </div>
                                            </>
                                        </article>
                                    </div>
                                </div>
                            </>
                    }
                </>
            </section>
            {config ? <FooterMulti config={config} /> : null}

            <Modal ref={modal}>
                <div className="fixed z-50 inset-0 w-full h-full flex items-center justify-center bg-white bg-opacity-60">
                    <article className="w-full min-h-[200px] max-w-screen-md max-h-full flex flex-col text-principal bg-white rounded-lg shadow-xl overflow-hidden">
                        <header className="relative w-full h-full flex p-6 md:p-10 ">
                            <span className="icon-ico-alert text-3xl lg:text-6xl" aria-hidden="true"><span className="path1 text-amarillo"></span><span className='path2 text-principal'></span></span>
                            <div className="flex flex-col gap-3 md:gap-4 p-4">
                                <h2 className="text-2xl md:text-4xl font-bold leading-none md:leading-10">Ocurrió un error al obtener la información</h2>
                                <h3 className="text-xl leading-none md:leading-10 font-bold">La dirección URL es incorrecta o ha cambiado</h3>
                                <span className="flex-1 flex items-center leading-none">Por favor vuelva a escanear el código QR</span>
                            </div>
                        </header>
                    </article>
                </div>
            </Modal>
        </>
    )
}
