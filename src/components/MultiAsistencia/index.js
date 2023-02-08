import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router';
import MultiHogar from './MultiHogar';
import MultiMascota from './MultiMascota';
import MultiBicicleta from './MultiBicicleta';
import MultiPayment from './MultiPayment';
import axios from 'axios';

import { useTranslation } from 'react-i18next';
import { useConfig } from '../../context/configContext';
import { addDays, addYears, format } from 'date-fns';

import Modal from '../../components/Modal';

import Loading from '../../components/Loading';

function MultiAsistencia({ setShowPlanes, showPlanes, producto }) {
  const [t, i18n] = useTranslation('global');

  const router = useRouter()
  const [typeProduct, setTypeProduct] = useState(3)
  const [paso, setPaso] = useState(0);
  const PasosLista = ["Paso 1", "Paso 2"];
  const { config, setConfig } = useConfig()


  const modal = useRef(null)
  const [messageError, setMessageError] = useState('')
  const [msgDate, setMsgDate] = useState('Fecha Invalida. El formato debe ser: dd/mm/yyyy')
  const [sending, setSending] = useState(false)

  const [cotizacionFinal, setCotizacionFinal] = useState(null)
  const [idUser, setIdUser] = useState(null)


  useEffect(() => {
    const { idUser } = router.query
    setIdUser(prev => {
      if (prev != idUser) {
        return idUser
      }
    })

  }, [router.query])

  const initForm = {
    datosSeguro: [],
    titular: "",
    dniTitular: "",
    numeroTarjeta: "",
    mesVencimiento: "",
    anioVencimiento: "",
    codigoSeguridad: "",
    cuotas: "1",
    tipoTarjeta: "",
    terminosCondicionesAceptados: false
  }
  const initPersona = {
    id: 0,
    nombre: "",
    apellido: "",
    nacionalidad: "",
    documento: "",
    email: "",
    telefono: "",
    // sexo:"",
    // documentoTipo:"",
    // fechaNacimiento:"",
  }
  const initErrors = {
    id: 0,
    nombre: "",
    apellido: "",
    nacionalidad: "",
    documento: "",
    email: "",
    telefono: "",
  }

  const [formData, setFormData] = useState(initForm);
  const [formErrors, setFormErrors] = useState(initErrors);


  const [position, setPosition] = useState(0)
  const [isSend, setIsSend] = useState(false)

  const PasoDisplay = () => {
    switch (paso) {
      case 0:
        return <MultiHogar formData={formData} initErrors={initErrors} setFormErrors={setFormErrors} formErrors={formErrors} initPersona={initPersona} isSend={isSend} config={config} position={position} setPosition={setPosition} setFormData={setFormData} />
        break;
      case 1:
        return <MultiPayment config={config} formData={formData} setFormData={setFormData} />
        break;
    }
  };




  const validarFormu = (step) => {
    switch (step) {
      case 0:
        if (validarDatosSeguro()) {
          datosPersonales()
        }
        break;
      case 1:
        if (validarDatosPago()) {
          emitirVoucher()
        }
        else {
          modal.current.openModal()
        }
        break;
    }
  }


  const datosPersonales = async () => {
    setSending(true)

    let hoy = new Date()
    let fechaNacimiento = new Date(hoy.getFullYear() - 35, hoy.getMonth(), hoy.getDate())
    fechaNacimiento = format(fechaNacimiento, "yyyy-MM-dd'T'HH:mm:ss.SSS'")
    try {
      let COD = localStorage.getItem('cotizacionID')
      let datos = await axios.get(process.env.NEXT_PUBLIC_URL_GET_COTIZACION_MULTI + '?cotizacionId=' + COD);
      const data = datos.data[0]
      let cotizar = data
      const entries = Object.entries(formData.datosSeguro)
      const output = Object.fromEntries(entries)
      let edades = []
      cotizar.personas = cotizar.personas.map((item, idx) => {

        item.id = 0
        item.nombre = output[idx].nombre
        item.apellido = output[idx].apellido
        item.documento = output[idx].documento
        item.email = output[idx].email
        item.telefono = output[idx].telefono
        item.edad = 35
        edades.push(35)
        item.fechaNacimiento = fechaNacimiento
        item.nacionalidad = 'argentina'
        return item
      })
      cotizar.productos = [producto]
      cotizar.productos[0].personas = cotizar.personas
      cotizar.productos[0].edades = edades
      cotizar.edades = edades
      cotizar.terminosCondicionesAceptados = formData.terminosCondicionesAceptados
      try {
        let datos = await axios.post(process.env.NEXT_PUBLIC_URL_DATOS_PERSONALES_MULTI, cotizar);
        const data = await datos.data[0]
        guardarRegistro(cotizar)

        setCotizacionFinal(data)
        setPaso((currPaso) => currPaso + 1)
        setSending(false)
      }
      catch (e) {
        console.log(e.response.data)
        setSending(false)
      }

    }
    catch (e) {
      console.log(e.response.data)
      setSending(false)
    }
  }

  const guardarRegistro = async (cotizacion) => {
    try {
      const { idUser } = router.query
      await axios.post(process.env.NEXT_PUBLIC_MULTI_CREATE_REGISTER + cotizacion.codigoUsuario + '/contract', {
        "user_id": idUser
      });
    } catch (error) {
      console.log('Message Error: ', error.response.data)
    }

  }

  const emitirVoucher = async () => {
    setSending(true)
    let COD = localStorage.getItem('cotizacionID')
    let datos = await axios.get(process.env.NEXT_PUBLIC_URL_GET_COTIZACION_MULTI + '?cotizacionId=' + COD);
    let res = datos.data[0]

    const tarjeta = [{
      titular: formData.titular,
      dniTitular: formData.dniTitular,
      metodoDePago: null,
      tipoTarjeta: formData.tipoTarjeta,
      numeroTarjeta: formData.numeroTarjeta,
      mesVencimiento: formData.mesVencimiento,
      anioVencimiento: formData.anioVencimiento,
      codigoSeguridad: formData.codigoSeguridad,
      cuotas: formData.cuotas
    }]
    res.tarjetas = tarjeta

    res.productos = []

    res.medioDePago = producto.medioDePago
    let { idUser } = router.query
    res.id_seller = idUser

    try {

      let datos = await axios.post(process.env.NEXT_PUBLIC_URL_EMITIR_MULTI, res);
      let response = datos.data[0]

      localStorage.setItem('emisionId', response.emisionId)
      let user = localStorage.getItem('cod_user')
      let { idUser } = router.query
      // router.push(`/multigracias?${user}&idUser=${idUser}`)
      router.push({pathname: '/[userId]/multigracias', query: { userId: router.query.userId,idUser:idUser}})
    }
    catch (e) {
      if (e.response.data.message) {
        setMessageError(e.response.data.message)
      } else {
        setMessageError('Error al procesar el pago')
      }
      setSending(false)
      modal.current.openModal()
    }


  }

  const emailValid = (value) => {
    let valid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)

    return valid
  }
  const validarDatosSeguro = () => {
    let info = formData.datosSeguro
    if (formData.terminosCondicionesAceptados == false) return false
    let datosValidos = true
    info.map(dato => {
      Object.entries(dato).map(item => {
        let key = item[0]
        let value = item[1]
        switch (key) {
          case 'nombre':
          case 'apellido':
            if (value == '' || value.split('').length < 3) {
              datosValidos = false
            }
            break;

          case 'documento':
            if (value == '') {
              datosValidos = false
            }
            break;
          case 'email':
            if (value == '' || !emailValid(value)) {
              datosValidos = false
            }
            break;
        }
      })
    })

    return datosValidos
  }

  const validarDatosPago = () => {

    const metodoPago = 'Decidir'
    setSending(true)
    let valid = false
    let vencimiento = formData.mesVencimiento.split('/')

    let month = vencimiento[0]
    let year = vencimiento[1]
    // "03/23" => "03" "23"

    formData.mesVencimiento = month
    formData.anioVencimiento = year
    formData.cuotas = '1'

    if (metodoPago.toLowerCase() == 'decidir') {
      if (formData.tipoTarjeta == '') {
        formData.tipoTarjeta = '1'
      }
      if (validTarjeta(formData.numeroTarjeta, metodoPago)) {
        if (formData.mesVencimiento != '' && formData.anioVencimiento != '') {
          if (formData.codigoSeguridad != '' && (formData.codigoSeguridad.split('').length == 3 || formData.codigoSeguridad.split('').length == 4)) {
            if (formData.titular != '' && formData.dniTitular != '' && formData.tipoTarjeta != '') {
              valid = true
            }
          }
        }
      }
    } else {
      if (formData.titular != '' && formData.dniTitular != '' && formData.tipoTarjeta != '') {
        valid = true
      }
    }

    return valid
  }


  const validTarjeta = (numb, metodoPago) => {
    numb = numb.replace(/\s+/g, '')
    if (metodoPago.toLowerCase() == 'decidir') {
      let cardType = detectCardType(numb)
      switch (cardType) {
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
      if (formData.tipoTarjeta == '') {
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

  return (
    <>
      {sending && <Loading />}

      {
        PasoDisplay()
      }

      <footer className="flex flex-col md:flex-row flex-wrap gap-4 py-8">
        {paso == 0 ?
          <button className={`py-5 px-6 btn focus:text-principal hover:text-principal btn-gris w-full lg:w-56 text-xl font-bold lg:font-normal disabled:hidden lg:disabled:hidden`}
            onClick={() => {
              setIsSend(false)
              setShowPlanes(true)
            }}>
            {t("buttons.anterior")}
          </button>
          :
          <button className={`py-5 px-6 btn focus:text-principal hover:text-principal btn-gris w-full lg:w-56 text-xl font-bold lg:font-normal disabled:hidden lg:disabled:hidden`}
            disabled={paso == 0}
            onClick={() => {
              setPaso(0);
              setIsSend(false)
            }}>
            {t("buttons.anterior")}
          </button>
        }

        <button className="py-5 px-6 btn btn-amarillo w-full lg:w-56 text-xl font-bold lg:font-normal btn_google_pagar"
          onClick={() => {
            setIsSend(true)
            validarFormu(paso)
          }}>
          {paso === PasosLista.length - 1 ? `${t("buttons.pagar")}` : 'Continuar'}
        </button>

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

export default MultiAsistencia;

