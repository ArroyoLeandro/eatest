import { useState,useEffect,useRef } from "react";
import { useRouter } from 'next/router'
import axios from 'axios'
import { format } from 'date-fns';
import Cookie from 'js-cookie';
import { useTranslation } from 'react-i18next';

import PersonalData from './PersonalData';
import FacturacionData from './FacturacionData';
import PaymentData from './PaymentData';
import Loading from '../Loading';
import {useConfig} from '../../context/configContext'
import {useLocalStorage} from '../../helpers/useLocalStorage'
import { getCotizacion } from '../../apiFunctions/index'
import Modal from '../../components/Modal';
import { useShare } from '../../context/shareContext';


import {isCountry} from '../../lib/trackId'
import * as GTM from '../../lib/gtm'


function FormContratar(props) {
  const [t, i18n] = useTranslation('global');
  const router = useRouter();
  const initPersona = {
    id:0,
    nombre:"",
    apellido:"",
    sexo:"",
    nacionalidad:"",
    documento:"",
    documentoTipo:"",
    fechaNacimiento:"",
    email:props.correo,
    telefono:"",
    domicilioCalle:"",
    domicilioNumero: "",
    domicilioPiso:"",
    domicilioDpto:"",
    domicilioCodigoPostal:"",
    localidad:"",
    provincia:"",
    destino:""
  }

  const initForm = {
    datosPersonales:[],
    titular:"",
    dniTitular:"",
    numeroTarjeta:"",
    mesVencimiento:"",
    anioVencimiento:"",
    codigoSeguridad:"",
    cuotas:"1",
    tipoTarjeta:"",
    nameContacto:"",
    apellidoContacto:"",
    telContacto:"",
  }
  const { isShared, setIsShared } = useShare()
  const [paso, setPaso] = useState(0);

  const [formData, setFormData] = useState(initForm);

  const [cotizar, setCotizar] = useState(null);
  
  const [formErrors, setFormErrors] = useState(initForm);

  const PasosLista = ["Paso 1", "Paso 2", "Paso 3"];

  const {config, setConfig} = useConfig()

  const [etiquetas,setEtiquetas] = useLocalStorage('etiquetas','')

  const [show,setShow] = useState(false)

  const [position, setPosition] = useState(0)

  const [validNext,setValidNext] = useState(true)

  const [person,setPerson] = useState(null)

const [firstChange,setFirstChange] = useState(true)

  const [sending, setSending] = useState(false)
  const modal = useRef(null)

  const [messageError, setMessageError] = useState('')
  const [msgDate, setMsgDate] = useState('Fecha Invalida. El formato debe ser: dd/mm/yyyy')
  


  const [instance, setInstance] = useState(null)
  const [cardCom, setCardCom] = useState(null)

  const refToScroll = useRef(null);

  const [personasEdad, setPersonasEdad] = useState(JSON.parse(localStorage.getItem('planContratar'))?.personas)


  const handleClick = () => {
    refToScroll.current?.scrollIntoView({behavior: 'smooth'});
  };

  useEffect(() =>{
    if(!localStorage.getItem('etiquetas')){
      getConfig()
    }
    else{
      setConfig(etiquetas)
    }
    
   
// eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(()=>{
    setPersonasEdad(JSON.parse(localStorage.getItem('planContratar'))?.personas)
       
// eslint-disable-next-line react-hooks/exhaustive-deps
  },[localStorage.getItem('planContratar')])

  useEffect(() => {
    if(paso == 2){
      const metodoPago = JSON.parse(localStorage.getItem('planContratar'))?.medioDePago
      if(metodoPago.toLowerCase() != 'decidir') getComponent()
    }
  },[paso])
 

  const getConfig = async () => {
      try {
        let COD = Cookie.get('location')
        if(!COD) return
        let logData = await axios.get(process.env.NEXT_PUBLIC_API_CONFIG+'?codigo='+COD);
        const data = logData.data[0]
          setConfig(data)
      }
      catch (e) {
        console.log(e.response.data)

      }
    } 

  const PasoDisplay = () => {
    if(props.ready){
      switch (paso) {
        case 0:
          return (<PersonalData msgDate={msgDate} setMsgDate={setMsgDate} initPersona={initPersona} position={position} setPosition={setPosition} formData={formData} setFormData={setFormData} config={config} errors={formErrors.datosPersonales} setErrors={setFormErrors}/>);
        case 1: 
          return (<FacturacionData  firstChange={firstChange} setFirstChange={setFirstChange} initPersona={initPersona} position={position} setPosition={setPosition}  formData={formData} setFormData={setFormData} config={config} errors2={formErrors} errors={formErrors.datosPersonales} setErrors={setFormErrors}/>);
        case 2:           
          return (<PaymentData initForm={initForm} formData={formData} position={position} setFormData={setFormData} config={config} errors={formErrors} setErrors={setFormErrors}/>);
        default:
          return null;
        }
    }
  };


  const validarFormu = (step,changeStep=-1) => {
    if(changeStep == -1 ){
      let dataPers = validarDatosPersonales()
      let infoPers = formErrors
      infoPers.datosPersonales = dataPers
      setFormErrors(infoPers)
      let valiPers = []
      dataPers.map((item,idx)=>{
        if(!item.valid){
          valiPers.push(idx)
        }
      })
     if(valiPers.length > 0){
        if(step == 0){
          if(position < formData.datosPersonales.length -1){
            setPosition(valiPers[0])
            return
          }
        } 
     }else{
      if(step == 0){
        if(position < formData.datosPersonales.length -1){
          setPosition(prev => prev +1)
          return
        }
      } 
     }



    //   if(msgDate == ''){
        // setValidNext(false)
        // let dataPers = validarDatosPersonales()
        // let infoPers = formErrors
        // infoPers.datosPersonales = dataPers
        // setFormErrors(infoPers)
        // return
        // if(step == 0){
        //   if(position < formData.datosPersonales.length -1){
        //     setPosition(pos => pos + 1)
        //     return
        //   } 
        // } 
      // }      
    }
    // else if(changeStep <= step){
      // setPaso(changeStep)
      // setPosition(0)
      // return
    // }
    
    let next = false
    switch(step)
    {
      case 0:
        let dataPers = validarDatosPersonales()
        let infoPers = formErrors
        infoPers.datosPersonales = dataPers
        setFormErrors(infoPers)
        let valiPers = true
        // let valiPers2 = []

        dataPers.map((item,idx)=>{
          if(!item.valid){
            valiPers = false
            // valiPers2.push(idx)
          }
        })
        next = valiPers
        setValidNext(valiPers)

       
        
        next ? setPaso((currPaso) => currPaso + 1) : null
      break;
      case 1:
        let dataFact = validarDatosFacturacion()
        let infoFact = formErrors
        infoFact.datosPersonales = dataFact
        setFormErrors(infoFact)
        let valiFact = true
        dataFact.map(item=>{
          if(!item.valid){
            valiFact = false
          }
        })

        if(valiFact){
          infoFact.valid = true
          Object.keys(formData).map((item,index)=>{
              switch(item){
                case 'nameContacto':
                  if(Object.values(formData)[index] == '' ){
                    infoFact.nameContacto = 'Campo requerido'
                    infoFact.valid = false
                  }         
                break;
                case 'apellidoContacto':
                  if(Object.values(formData)[index] == ''){
                    infoFact.apellidoContacto = 'Campo requerido'
                    infoFact.valid = false
                  }         
                break;
                case 'telContacto':
                  if(Object.values(formData)[index] == ''){
                    infoFact.telContacto = 'Campo requerido'
                    infoFact.valid = false
                  }         
                break;
              }
          })
        }
        
        next = valiFact && infoFact.valid
        setValidNext(valiFact && infoFact.valid)
        if(next){
          setPaso((currPaso) => currPaso + 1)
        }
      break;
      case 2:
        next = validarDatosPago()
        if(next){
          emitirVoucher()
        }
        else{
          setSending(false)
          setMessageError('Tarjeta o Datos invalidos')
          modal.current.openModal()
        }
        // router.push('/gracias')  
      break;
    }


    if(next && step == 1){
      datosPersonales()
    }    

  
    }

    

    const datosPersonales = async ()=>{
  
      try {
        let COD = Cookie.get('cotizacionID')
        let datos = await axios.get(process.env.NEXT_PUBLIC_URL_COTIZACION+'?cotizacionId='+COD);
        const data = datos.data[0]
        let cotizar = data
         const entries = Object.entries(formData.datosPersonales)
         let items = entries.filter((val,idx)=> idx < 19)
         const output = Object.fromEntries(items);
        let edades = []

        cotizar.personas = cotizar.personas.map((item,idx)=>{
                            let fecha = output[idx].fechaNacimiento.split('/').reverse()
                            // item.id = output[idx].id
                            item.id = 0
                            item.nombre = output[idx].nombre
                            item.apellido = output[idx].apellido
                            item.documento = output[idx].documento
                            item.documentoTipo = output[idx].documentoTipo                            
                            item.sexo = output[idx].sexo.toLowerCase() == 'masculino' ? "H": "M"
                            item.email = output[idx].email
                            item.telefono = output[idx].telefono
                            item.edad = getEdad(output[idx].fechaNacimiento)
                            edades.push(item.edad)
                            item.contactoEmergencia = output[idx].contactoEmergencia
                            // item.fechaNacimiento = output[idx].fechaNacimiento
                            item.fechaNacimiento = fecha.join('-')
                            item.domicilioCalle = output[idx].domicilioCalle
                            item.domicilioNumero = output[idx].domicilioNumero
                            item.domicilioPiso = output[idx].domicilioPiso
                            item.domicilioDpto = output[idx].domicilioDpto
                            item.domicilioCodigoPostal = output[idx].domicilioCodigoPostal
                            item.localidad = output[idx].localidad
                            item.provincia = output[idx].provincia
                            item.nacionalidad = output[idx].nacionalidad
                            item.destino = output[idx].destino
                            item.origen = 'uruguay'
                            item.anio = parseInt(fecha[0])
                            item.mes =  parseInt(fecha[1])
                            item.dia =  parseInt(fecha[2])
                            return item
                          })

      
        cotizar.productos = [props.producto]
        cotizar.productos[0].personas = cotizar.personas 
        cotizar.productos[0].edades = edades
        cotizar.edades = edades
        cotizar.nombreEmergencia = formData.apellidoContacto
        cotizar.apellidoEmergencia = formData.nameContacto
        cotizar.telefonoEmergencia = formData.telContacto   
        cotizar.terminosCondicionesAceptados = true
        setCotizar(cotizar)
        // console.log('datos personales:',cotizar)
        // return
        sendDatosPersonales(cotizar)
      }
      catch (e) {
        console.log(e.response.data)
        setShow(false);

      }
    }


    const sendDatosPersonales = async (datosPersonales) => {
      try {
        setPerson(datosPersonales.personas)

        let datos = await axios.post(process.env.NEXT_PUBLIC_URL_POST_DATOS_PERSONALES,datosPersonales);
        const data = await datos.data[0]
        setValidNext(false)
      }
      catch (e) {
        console.log(e.response.data)
        setShow(false);

      }
    }

    function getEdad(dateString) {
      let hoy = new Date()
     let dateString2 = dateString.split('/').reverse()

      let fechaNacimiento = new Date(dateString2[0],dateString2[1],dateString2[2])
      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()

      let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth()
      if (
        diferenciaMeses < 0 ||
        (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
      ) {
        edad--
      }
      return edad
    }

    const emailValid = (value)=>{
      let valid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)

      return valid
     }

  const validarDatosPersonales =  () => {
    

    let datosP =[]
    for (let index = 0; index < formData.datosPersonales.length; index++) {
      datosP.push({...formData.datosPersonales[index],nombre:'',
      apellido:'',
      sexo:'',
      nacionalidad:'',
      documento:'',
      documentoTipo:'',
      fechaNacimiento:'',
      email:'',
      telefono:'',})
    }

    formData.datosPersonales.map((item,index)=>{
      datosP[index].valid = true
      Object.keys(item).map((val,idx)=>{
        switch(val){
          case 'nombre':
            if(Object.values(item)[idx] == ''){
              datosP[index].nombre = 'Campo requerido'
              datosP[index].valid = false
            }
          break;
          case 'apellido':
            if(Object.values(item)[idx] == ''){
              datosP[index].apellido = 'Campo requerido'
               datosP[index].valid = false
            }
          break;
          case 'sexo':
            if(Object.values(item)[idx] == ''){
              datosP[index].sexo = 'Campo requerido'
               datosP[index].valid = false
            }
          break;
          case 'nacionalidad':
            if(Object.values(item)[idx] == ''){
              datosP[index].nacionalidad = 'Campo requerido'
               datosP[index].valid = false
            }
          break;
          case 'documentoTipo':
            if(Object.values(item)[idx] == ''){
              datosP[index].documentoTipo = 'Campo requerido'
               datosP[index].valid = false
            }
          break;
          case 'documento':
            if(Object.values(item)[idx] == ''){
              datosP[index].documento = 'Campo requerido'
               datosP[index].valid = false
            }
          break;
          case 'email':
            if(Object.values(item)[idx] == ''  || !emailValid(Object.values(item)[idx])){
              datosP[index].email = 'Email invalido'
               datosP[index].valid = false
            }
          break;
          case 'telefono':
            if(Object.values(item)[idx] == ''){
              datosP[index].telefono = 'Campo requerido'
               datosP[index].valid = false
            }
          break;
          case 'fechaNacimiento':
            let hoy = new Date()            
            let tokens = Object.values(item)[idx].split(/[/]/g).reverse()
            let fechaNacimiento = new Date(tokens[0], tokens[1], tokens[2]);
       
            if(tokens[1] > 12 || tokens[2] > 31){
              datosP[index].fechaNacimiento = 'Fecha Invalida'
              datosP[index].valid = false
              break
            }else if(tokens[2] > new Date(tokens[0], tokens[1], 0).getDate()){
              datosP[index].fechaNacimiento = 'Fecha Invalida'
              datosP[index].valid = false
              break
            }
            let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
            let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth()

            if (
              diferenciaMeses < 0 ||
              (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
            ) {
              edad--
            }

            
            if(Object.values(item)[idx] == ''){
              datosP[index].fechaNacimiento = 'Campo requerido'
               datosP[index].valid = false
            }else{
              if(edad < 0 || edad == 0 && (diferenciaMeses <= 0 && hoy.getDate()<fechaNacimiento.getDate()) || fechaNacimiento.getMonth() > 12){
                datosP[index].fechaNacimiento = 'Fecha Invalida'
                datosP[index].valid = false
              }
            }
             
        
              // personasEdad
              // 0 a 20 = 19
              // 21 a 75 = 30
              // 76 a 85 = 80
              // 86 a 90 = 88
              let valid = false
              if(isShared){
                const rangos = [
                  {
                    minima:0,
                    maxima:20,
                    fijada:19
                  },
                  {
                    minima:21,
                    maxima:75,
                    fijada:30
                  },
                  {
                    minima:76,
                    maxima:85,
                    fijada:80
                  },
                  {
                    minima:86,
                    maxima:90,
                    fijada:88
                  }
                ]
          
              let personas = personasEdad.map((val)=>{
                  rangos.map((valor)=>{
                      if(val.edad >= valor.minima && val.edad <= valor.maxima){
                              val.edadMinima = valor.minima
                              val.edadMaxima = valor.maxima
                      }
                  })
                  return val
                })
                if((edad >= personas[index].edadMinima && edad <= personas[index].edadMaxima)){
                  valid = true
                }
                if(valid == false){
                  datosP[index].fechaNacimiento = `La edad no coincide con la cotización <br> Desde ${personas[index].edadMinima} a ${personas[index].edadMaxima} años`
                  datosP[index].valid = false
                }
              }
              else{    
                // console.log('Edad: ',edad,' | edad minima: ',personasEdad[index].edadMinima,' | edad maxima: ',personasEdad[index].edadMaxima)
                if((edad >= personasEdad[index].edadMinima && edad <= personasEdad[index].edadMaxima)){
                  valid = true
                }
                if(valid == false){
                  datosP[index].fechaNacimiento = `La edad debe ser de ${personasEdad[index].edadMinima} a ${personasEdad[index].edadMaxima} años`
                  datosP[index].valid = false
                }
              }
              
            
          break;
        }
      })
      
    })
    return datosP

  }


  const showErrorValid = () =>{
    let invalid = null
    let data = []
    if(paso == 0) {
      data = validarDatosPersonales()
      data.map((item,idx)=>{
        if(!item.valid){
          if(invalid != null){
            invalid += `  |  pasajero  ${idx +1}`
          }
          else{
            invalid = `pasajero ` + (idx + 1)
          }
        }
      })
  
    }
    if(paso == 1) {
      data = validarDatosFacturacion()
      data.map((item,idx)=>{
        if(!item.valid){
          invalid = ` Datos de facturacion `
        }
      })
    }
    if(invalid != null) return (<div className="flex items-center gap-2"><p>{t("formContratar.completarPasajero")} <strong>{invalid}</strong></p></div>)
    return null
  }


  const validarDatosFacturacion = ()=>{
    let datosP = []
    for (let index = 0; index < formData.datosPersonales.length; index++) {
      datosP.push({...formData.datosPersonales[index],domicilioCalle:'',
      domicilioNumero:'',
      domicilioPiso:'',
      domicilioDpto:'',
      domicilioCodigoPostal:'',
      localidad:'',
      provincia:'',
      destino:'',
      })
    }
    formData.datosPersonales.map((item,index)=>{
      datosP[index].valid = true
      Object.keys(item).map((val,idx)=>{
        switch(val){
          case 'destino':
          if(Object.values(item)[idx] == '' || Object.values(item)[idx] == 'default'){
              datosP[index].destino = 'Campo requerido'
               datosP[index].valid = false
            }
          break;
         
        }
      })
      
    })

   
    return datosP

  }


  const gtag_report_conversion = (url,idCotizacion) => {
    // var callback = function () {
    //   if (typeof(url) != 'undefined') {
    //     window.location = url;
    //   }
    // };

    // let send = gtag.listTags.filter(item=> item.pais == Cookie.get('location')?.toLowerCase())[0].send_to_pagar

    let plan = JSON.parse(localStorage.getItem('planContratar'))
    if(plan){
      fbq('track', 'Purchase', {currency: plan.monedaSimbolo, value: plan.precio});
    } 
  

  }
 
  const emitirVoucher = async ()=>{
 
    getCotizacion().then(async(res) => {

      const tarjeta = [{
          titular:formData.titular,
          dniTitular:formData.dniTitular,
          metodoDePago:formData.tipoTarjeta,
          tipoTarjeta:formData.tipoTarjeta,
          numeroTarjeta:formData.numeroTarjeta,
          mesVencimiento:formData.mesVencimiento,
          anioVencimiento:formData.anioVencimiento,
          codigoSeguridad:formData.codigoSeguridad,
          cuotas:formData.cuotas
        }]
        res.tarjetas = tarjeta
        
        let productos = JSON.parse(localStorage.getItem('planContratar'))
        productos.producto.monedaId = productos.producto.prestaciones[0].monedaId
        productos = productos.producto
        res.personas = person
        res.productos.push(productos)
        res.medioDePago = JSON.parse(localStorage.getItem('planContratar')).medioDePago
        res.id_share = JSON.parse(localStorage.getItem('planContratar')).id_share ?? ''
       
        try {
          if(res.medioDePago == 'D-Local'){
            const result = await setToken(instance,cardCom)
            res.token = result.token
          }
          if(isCountry(Cookie.get('location'))){
            gtag_report_conversion(router.pathname,res.cotizacionId) //google tags
            
            let item = JSON.parse(localStorage.getItem('planContratar'))
            let dataEcommerce = []
            dataEcommerce.push({
              name:item.producto.nombreB2C,
              value: item.precio,
              currency: 'USD',
              items:[
                {
                  item_id: item.producto.id,
                  item_name: item.producto.nombreB2C,
                  price: item.precio,
                  quantity: 1,
                  local_price: item.precioEnPesos,
                  currency: 'USD',
                  monedaId: item.monedaId
                }
              ]
            })
            GTM.purchase(dataEcommerce)
          }
          await axios.post(process.env.NEXT_PUBLIC_URL_POST_EMITIR_VOUCHER,res);

          
          localStorage.removeItem('correo')
          router.push({pathname: '/[userId]/gracias', query: { userId: router.query.userId}})
        }
        catch (e) {
          console.log(e.response.data)
        setShow(false);

          if(e.response.data.message){
            setMessageError(e.response.data.message)
          }else{
            setMessageError('Error al procesar el pago')
          }
          setSending(false)
          modal.current.openModal()
        }

    })
    
 
  }

  const getComponent = async () =>{
    let response = await axios.get(process.env.NEXT_PUBLIC_URL_API_KEY);
    let apiKeyEurop =response.data[0]

      // let countryCodes = [
      //   {
      //     name:'uruguay',
      //     code:'UY'
      //   },
      //   {
      //     name:'colombia',
      //     code:'CO'
      //   },
      //   {
      //     name:'ecuador',
      //     code:'EC'
      //   },
      // ]

      // let countryCode = countryCodes.filter(item=>item.name == Cookie.get('location').toLowerCase())[0]
      const dlocalInstance  = dlocal(apiKeyEurop);
      var style =  {
        base: {
          fontSize: "16px",
          lineHeight: '18px',
          fontSmoothing: 'antialiased',
          fontWeight: '500',
          color: "blue",
      },    
    };

      var fields = dlocalInstance.fields({
          locale: 'en',
          country: 'AR'
      });
      // Create an instance of the card Field.
      const card = fields.create('card', {style: style,hideIcon: true});
      // console.log('fields',fields)
      card.mount(document.getElementById('card-field'))

      setInstance(dlocalInstance)
      setCardCom(card);

  }
  const setToken = async ()=>{
      var cardHolderName = formData.titular
      // console.log('pan card',cardCom)
      const result = await instance.createToken(cardCom, {name: cardHolderName})
      return result
  }



  const validarDatosPago = ()=>{

    const metodoPago = JSON.parse(localStorage.getItem('planContratar')).medioDePago
    setSending(true)
    let valid = false
    let month = formData.mesVencimiento.split('/')[0]
    let year = formData.mesVencimiento.split('/')[1]
    // "03/23" => "03" "23"
    formData.mesVencimiento = month
    formData.anioVencimiento = year
    formData.cuotas = formData.cuotas == '' ? '1' : formData.cuotas
    if(metodoPago.toLowerCase() == 'decidir') formData.tipoTarjeta = formData.tipoTarjeta == '' ? '1' : formData.tipoTarjeta



    if(metodoPago.toLowerCase() == 'decidir'){
      if(validTarjeta( formData.numeroTarjeta,metodoPago) ){
        if(formData.mesVencimiento != '' && formData.anioVencimiento != ''){
          if(formData.codigoSeguridad != '' && (formData.codigoSeguridad.split('').length == 3 || formData.codigoSeguridad.split('').length == 4)){
            if(formData.titular != '' && formData.dniTitular != '' && formData.tipoTarjeta != ''){
                valid = true
            }
          }
        }
      }
    }else{
      if(formData.titular != '' && formData.dniTitular != '' && formData.tipoTarjeta != ''){
        valid = true
      }
    }
    
    
    return valid 
  }

  const validTarjeta = (numb,metodoPago) => {
    numb = numb.replace(/\s+/g, '')
    if(metodoPago.toLowerCase() == 'decidir'){
        let cardType = detectCardType(numb)
        switch(cardType){
            case 'visa':
              formData.tipoTarjeta = "1"
            break;
            case 'master':
              formData.tipoTarjeta = "15"
            break;
            case 'american':
              formData.tipoTarjeta = "65"
            break;
        }
        if(formData.tipoTarjeta == ''){
          return false
        }
        formData.numeroTarjeta = numb
        setFormData(formData)
    }

    return true
}

function detectCardType(number) {
  var re = {
      visa: /^4[0-9]{12}(?:[0-9]{3})/,
      master: /^5[1-5][0-9]{14}/,
      american: /^3[47][0-9]{13}/,
  }

  for (var key in re) {
      if (re[key].test(number)) {
          return key
      }
  }
}


  const showSpinner = ()=> {
    return (
      <div className="flex items-center justify-center w-20 h-10 mt-5 bg-white bg-opacity-20">
        <img src="/assets/images/BUSCANDO.gif" alt="loading" className='flex mx-auto'/>
    </div>
    )
  }



  const showSpin = ()=>{
    if(paso!=2){
      setShow(true)
      setTimeout(()=>{
        setShow(false);
       },500)
    }

  }

  
  return (
    
    <>    
        <h2 ref={refToScroll} className='lg:text-xl pt-4 md:pt-2 mb-2'>{config?.etiquetas.Info_FormularioContratacion}</h2> 
        <nav>
          <div className='flex gap-4 justify-around lg:rounded-lg bg-transparent lg:bg-gris-claro'>
            <button onClick={()=>{ validarFormu(paso,0);}} className={`flex-1 flex gap-3 items-center btn py-3 lg:py-6 px-8 ${paso === 0 ? "text-white lg:text-principal bg-principal lg:bg-transparent" : "text-gris-medio bg-gris-claro lg:bg-transparent"}`}>
              <span className="w-full lg:w-6 lg:h-6 lg:rounded-full lg:border border-current flex items-center justify-center text-2xl lg:text-base">1</span>
              <span className="hidden lg:inline">{config?.etiquetas.Step2_DatosPasajeros}</span>
            </button>
            <button onClick={()=>{validarFormu(paso,1)}} className={`flex-1 flex gap-3 items-center btn py-3 lg:py-6 px-8 ${paso === 1 ? "text-white lg:text-principal bg-principal lg:bg-transparent" : "text-gris-medio bg-gris-claro lg:bg-transparent"}`}>
              <span className="w-full lg:w-6 lg:h-6 lg:rounded-full lg:border border-current flex items-center justify-center text-2xl lg:text-base">2</span>
              <span className="hidden lg:inline w-max">{t("formContratar.estascerca")}</span>
              </button>
            <button onClick={()=>{validarFormu(paso,2)}} className={`flex-1 flex gap-3 items-center btn py-3 lg:py-6 px-8 ${paso === 2 ? "text-white lg:text-principal bg-principal lg:bg-transparent" : "text-gris-medio bg-gris-claro lg:bg-transparent"}`}>
              <span className="w-full lg:w-6 lg:h-6 lg:rounded-full lg:border border-current flex items-center justify-center text-2xl lg:text-base">3</span>
              <span className="hidden lg:inline">{config?.etiquetas.Step5_DatosPasajeros}</span>
            </button>
          </div>
        </nav>
      
      {PasoDisplay()}
     
      <footer className="flex flex-col md:flex-row flex-wrap gap-4 py-8">
        <button className={`py-5 px-6 btn focus:text-principal hover:text-principal btn-gris w-full lg:w-56 text-xl font-bold lg:font-normal disabled:hidden ${paso == 0 ? "lg:disabled:hidden" : "lg:disabled:block"}`}
          disabled={paso == 0 }
          onClick={() => {
            setPaso((currPaso) => currPaso - 1);
            handleClick()
          }}>
          {t("buttons.anterior")}
        </button>
        
          <button className="py-5 px-6 btn btn-amarillo w-full lg:w-56 text-xl font-bold lg:font-normal btn_google_pagar" 
          onClick={() => {
            validarFormu(paso);
            showSpin();
            handleClick()
          }}>
            {paso === PasosLista.length - 1 ? `${t("buttons.pagar")}` : config?.etiquetas.Button_Continuar}
        </button>
       
        {show && !validNext && showSpinner()}
        {!show && !validNext && showErrorValid()}

        {
          sending && 
          <Loading/>
        }
          <Modal ref={modal}>
          <article className="w-full min-h-[200px] max-w-screen-md max-h-full flex flex-col text-principal bg-white rounded-lg shadow-xl overflow-hidden">
                <header className="relative w-full h-full flex p-6 md:p-10 ">
                    <span className="icon-ico-alert text-3xl lg:text-6xl" aria-hidden="true"><span className="path1 text-amarillo"></span><span className='path2 text-principal'></span></span>
                    <div className="flex flex-col gap-3 md:gap-4 p-4">
                        <h2 className="text-2xl md:text-4xl font-bold leading-none md:leading-10">{config?.etiquetas.Title_TransaccionIncompleta}</h2>
                        <h3 className="text-xl leading-none md:leading-10 font-bold">Error: {messageError}</h3>
                        <span className="flex-1 flex items-center leading-none">{config?.etiquetas.Label_IntenteNuevamente}</span>
                    </div>
                </header>
            </article>
          </Modal>
      </footer>
      
    </>
  )
}
  
export default FormContratar;