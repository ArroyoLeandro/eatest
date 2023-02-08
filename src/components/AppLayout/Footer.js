import { useEffect,useState} from 'react'
import Cookie from 'js-cookie';
import {useConfig} from '../../context/configContext'
import {useLocalStorage} from '../../helpers/useLocalStorage'
import axios from 'axios'
import {getPromoActual } from '../../apiFunctions/index'

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router'

import { useShare } from '../../context/shareContext';


export default function Footer(props) {
  const [t, i18n] = useTranslation('global');


    
    const router = useRouter()
    const codigoUserParam = router.query.userId
    // const codigoUserParam = router.asPath.split('?')[1]?.includes('=') ? router.asPath.split('?')[1].split('=')[0].trim() : router.asPath.split('?')[1]

    const {config, setConfig} = useConfig()
    const [etiquetas,setEtiquetas] = useLocalStorage('etiquetas','')
    const [promo,setPromoActual] = useState('')
    const [promoLocalStorage,setPromoLocalStorage]= useLocalStorage('promoActual','')
    const [pais,setPais] = useState('')
    const socialMedia = {
      facebook: 'https://www.facebook.com/EuropAssistanceLatam',
      instagram: 'https://www.instagram.com/europassistance_latam'
    }
    const [telStore, setTelStore] = useState(5491160242450)
    const [isCountry, setIsCountry] = useState(true);
    const { isShared, setIsShared } = useShare()

    const [showWp, setShowWp] = useState(false)
    // setTimeout(() =>{
    //   if(pais?.toLowerCase() != 'argentina'){
    //     showWp ? setShowWp(false) : null
    //     return 
    //   }
    //   let FechaArgentina = changeTimeZone(new Date(), 'America/Argentina/Buenos_Aires')
    //   // let horaActual = FechaArgentina.toLocaleTimeString()
    //   if(FechaArgentina.getHours() >= 9 && FechaArgentina.getHours() < 18){        
    //     setShowWp(true)
    //   }else{
    //     setShowWp(false)
    //   }
    // },5000)


 // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(()=>{
      setPais(Cookie.get('location'))
      getIsCountry()
  })


  useEffect(() =>{
    getPromo()
     // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])



  function changeTimeZone(date, timeZone) {
    if (typeof date === 'string') {
      return new Date(
        new Date(date).toLocaleString('en-US', {
          timeZone,
        }),
      );
    }
  
    return new Date(
      date.toLocaleString('en-US', {
        timeZone,
      }),
    );
  }

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
        const result = paises.filter(item=>{if(item.codigo.toUpperCase() == Cookie.get('location')?.toUpperCase()){return item}})[0]
        result ? setIsCountry(true) : setIsCountry(false)
    }


    const getConfig = async () => {
      try {
        let COD = Cookie.get('location')
        if(!COD) return
        if(codigoUserParam.toUpperCase() != pais.toUpperCase() && pais.toUpperCase() != ''){
            COD = pais.toUpperCase()
        }
        else{
            COD = codigoUserParam.toUpperCase()
        }
        if (Cookie.get('location') != undefined && COD == 'LAT') COD = Cookie.get('location')
   
        setPais(COD)
        let logData = await axios.get(process.env.NEXT_PUBLIC_API_CONFIG+'?codigo='+COD);
        const data = logData.data[0]
        setConfig(data)
        setEtiquetas(data)
        // console.log('get config footer')
      }
      catch (e) {
        console.log(e.response.data)

      }
    } 

  const getPromo = () => {
    let COD = Cookie.get('location')
    if(!COD) return
    if(COD){
      let promo1 = getPromoActual(COD.toUpperCase())
      promo1.then(res => {
          if(res == undefined){
            router.push('/')
          }
          Cookie.set('promoActual',JSON.stringify(res))
          setPromoLocalStorage(res)
          setPromoActual(res)
      })
    }
  }


  return (
 
      <footer role='contentinfo' className='bg-principal text-white px-6 relative'>
        <div className='max-w-screen-xl mx-auto relative px-6'>
          <div className='flex flex-col lg:flex-row items-center justify-between text-center lg:text-left gap-x-8 py-8'>
            <div className="hidden lg:block"><img src="/assets/images/europ-assitance-bco.svg" alt={t("menu.marca")} className='w-28' /></div>
            {isCountry && !isShared ?
            <div className="lg:pl-10 lg:pt-6 pb-6 lg:pb-0 flex-1">
            <ul className='lg:grid grid-flow-col grid-rows-3 auto-cols-max gap-x-10'>
              {/* <li><Link href='/quienes-somos'><a className="block py-1 lg:py-0 hover:text-principal-claro focus:text-principal-claro focus:outline-none">{t("menu.quienesSomos")}</a></Link></li> */}
              <li><a href={{ pathname: '/[userId]/nuestras-coberturas',query: { userId: codigoUserParam}}} className="block py-1 lg:py-0 hover:text-principal-claro focus:text-principal-claro focus:outline-none">{t("menu.coberturas")}</a></li>
              <li><a href={{ pathname: '/[userId]/preguntas-frecuentes',query: { userId: codigoUserParam}}} className="block py-1 lg:py-0 hover:text-principal-claro focus:text-principal-claro focus:outline-none">{t("menu.faq")}</a></li>
              {pais?.toLowerCase() == 'argentina' 
              &&
                <li><a href={{ pathname: '/[userId]/arrepentimiento',query: { userId: codigoUserParam}}} className="block py-1 lg:py-0 hover:text-principal-claro focus:text-principal-claro focus:outline-none">{t("menu.baja")}</a></li>
              }
              <li><a href={{ pathname: '/[userId]/contacto',query: { userId: codigoUserParam}}}className="block py-1 lg:py-0 hover:text-principal-claro focus:text-principal-claro focus:outline-none">{t("menu.contacto")}</a></li>
            </ul>
          </div>
            :null}
            

            {!isShared && pais?.toLowerCase() == 'argentina' &&
            <div className="justify-self-end flex items-center gap-4 py-4 border-t border-b lg:border-none border-white">
            <img src="/assets/images/logo-ssl.png" alt="SSL" className='h-10 lg:h-12' />
            <img src="/assets/images/logo-visa-bco.png" alt="Visa" className='h-10 lg:h-12' />
            <img src="/assets/images/logo-master-bco.png" alt="Mastercard" className='h-10 lg:h-12' />
            <img src="/assets/images/logo-american-bco.png" alt="American Express" className='h-10 lg:h-12' />
          </div>
            }
          
          </div>
          <div className={`flex items-center justify-center lg:justify-end gap-4 pb-5 ${( isShared||pais?.toLowerCase() != 'argentina') ? 'lg:absolute lg:right-6 lg:top-20' : ''}`}>
            {t("redes.seguinos")}
            <a target="_blank" href={socialMedia.facebook} rel="noopener noreferrer" aria-label='Facebook' className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-principal ">
              <span className="icon-facebook text-2xl" aria-hidden="true"></span>
            </a>
            <a target="_blank" href={socialMedia.instagram} rel="noopener noreferrer" aria-label='Instagram' className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-principal ">
              <span className="icon-instagram text-2xl" aria-hidden="true"></span>
            </a>
            {/* <button onClick={() => i18n.changeLanguage("es")}>ES</button>
            <button onClick={() => i18n.changeLanguage("ar")}>AR</button> */}
            {/* <button aria-label='Facebook' className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-principal "><span className="icon-facebook text-2xl" aria-hidden="true"></span></button> */}
            {/* <button aria-label='Instagram' className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-principal "><span className="icon-instagram text-2xl" aria-hidden="true"></span></button> */}
          </div>

        </div>

      <div className='max-w-screen-xl mx-auto flex flex-col gap-4 px-6 py-8 text-xs font-light text-justify border-t border-white'>
          {/* <p>Copyright© {year}</p> */}
          <p>{config?.etiquetas.Label_Copyright}</p>
          {/* {pais?.toLowerCase() == 'argentina' 
          &&
            <p>{config?.etiquetas.Label_Footer}</p>
           } */}
          {/* <p>(*) Promoción válida para la República Argentina desde el 30/05/2022 al 7/06/2022, inclusive. Fecha límite de inicio de vigencia 31/12/2022. Adquiriendo exclusivamente: Productos TITANIUM PLUS, y/o TITANIUM, y/o GOLD y/o SILVER y/o ENERGY y/o EXTREME en modalidad Diaria y/o Anual y/o Múltiples viajes, a través de nuestros canales directos habilitados, obtenga un beneficio de 60 (sesenta por ciento). Promoción no válida para contrataciones de extensión de asistencia y/o contratación de beneficios adicionales; ni acumulable con ningún otro beneficio. Plan familiar: cada 2 adultos hasta 3 menores de 21 años gratis. Límite de edad: TITANIUM PLUS y/o TITANIUM: Cobertura hasta 75 años; desde 76 hasta 85 años inclusive, la tarifa se incrementa un 50% (cincuenta por ciento). GOLD: Cobertura hasta 75 años; desde 76 hasta 90 años inclusive, la tarifa se incrementa un 50% (cincuenta por ciento). La contratación del producto TOTAL CANCELLATION deja sin efecto la promoción informada. Los precios publicados, en el Portal Web, de los productos alcanzados por esta promoción, ya cuentan con el porcentaje de descuento aplicado. Los servicios de EUROP ASSISTANCE ARGENTINA S.A. tienen limitaciones exclusivas según el tipo de producto adquirido. Aplican las limitaciones y exclusiones de uso habitual y/o legal en el país en que se emita el Producto EUROP ASSISTANCE ARGENTINA S.A. Los servicios y productos se rigen por Condiciones Generales que se informan con la compra de cada Producto EUROP ASSISTANCE ARGENTINA S.A. y se hallan a su disposición ingresando en el portal web de EUROP ASSISTANCE ARGENTINA S.A., también se pueden solicitar en forma telefónica o por e-mail. Las enfermedades preexistentes tienen exclusiones y limitaciones. EUROP ASSISTANCE ARGENTINA S.A. no es una empresa de seguros. EUROP ASSISTANCE ARGENTINA S.A., Carlos Pellegrini Nº 1149, Piso 9, CP 1009, CABA. CUIT 30-69121636-1. Tel: +5411-4814-9055.</p> */}
         {
          !isShared && <p>{promo?.pieLegalB2C}</p>
         }
          {!isShared && pais?.toLowerCase() == 'argentina'
          &&
            <a href="https://autogestion.produccion.gob.ar/consumidores" rel="noreferrer" target="_blank" className='focus:outline-none focus:underline'>Dirección General de defensa y protección del consumidor para consultas y/o denuncias ingrese aquí</a>
           }
      </div>
      {/* <div className="fixed bottom-5 right-5 z-50">
        {showWp && pais?.toLowerCase() == 'argentina' &&
          <a target="_blank" href={`https://wa.me/${telStore}`} rel="noopener noreferrer" aria-label='Whatsapp' className="w-14 h-14 lg:w-16 lg:h-16 p-3 flex items-center justify-center rounded-full bg-whatsapp text-principal">
            <img src='/assets/images/whatsapp_bco.svg' className="h-auto w-full" alt='whatsapp' />
          </a>
        }
      </div> */}
    </footer>
  )
}