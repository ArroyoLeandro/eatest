import { useState, useEffect } from "react";
import axios from 'axios'
import { useTranslation } from 'react-i18next';
import Select from 'react-select';


function FacturacionData({ formData, setFormData, config, errors, setErrors, position, setPosition, initPersona,errors2,  firstChange, setFirstChange}) {
    const [t, i18n] = useTranslation('global');

    const [personasState, setPersonasState] = useState(null)
    const [datoPersona, setDatoPersona] = useState(initPersona)
    const [paises, setPaises] = useState([])


    useEffect(() => {
        setPosition(0)
        getPaises()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        let persona = formData.datosPersonales[position]
        let pers = initPersona
        let keys = Object.keys(initPersona)
        keys.map(item => {
            if (persona[item]) pers[item] = persona[item]
        })
        setDatoPersona(pers)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position])



    useEffect(() => {
        planes()
    })

    const getPaises = async () => {
        try {
            let datos = await axios.get(process.env.NEXT_PUBLIC_URL_PAISES);
            const data = datos.data[0]
            let options = data.map(item=>{
                let value = item.nombre
                let label = value
                let val = {value,label}
                return val
           })
           setPaises(options)
        }
        catch (e) {
            console.log(e.response.data)
        }
      } 
    const planes = () => {
        if (localStorage.getItem('planContratar') != null) {
            let personas = JSON.parse(localStorage.getItem('planContratar')).personas
            if (personasState == null || personas.length != personasState.length) {
                setPersonasState(personas)
            }
        }
    }

    const setDato = (name, value) => {
        setDatoPersona({ ...datoPersona, [name]: value })
    }

    useEffect(() => {
        let info = formData.datosPersonales
        info[position].id = position
        if(firstChange){
            info.map((item,idx)=>{
           let {domicilioCalle, domicilioCodigoPostal,domicilioDpto,domicilioNumero,domicilioPiso,localidad,provincia,destino } = datoPersona
                info[idx].id = idx
                info[idx].domicilioCalle = domicilioCalle
                info[idx].domicilioCodigoPostal = domicilioCodigoPostal
                info[idx].domicilioDpto = domicilioDpto
                info[idx].domicilioNumero = domicilioNumero
                info[idx].domicilioPiso = domicilioPiso
                info[idx].localidad = localidad
                info[idx].provincia = provincia
                info[idx].destino = destino
                info[idx].origen = 'uruguay'
            })
            
        }else{
            info[position] = datoPersona
            info[position].origen = 'uruguay'
            info[position].id = position
        }
        setFormData({ ...formData, datosPersonales: info })
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [datoPersona])

    const customStyles = {
        menu: (provided, state) => ({
          padding: 0,
        })
    }

    return (
        <>
            <div className='flex flex-col'>
                <header className='flex gap-4 py-6 px-6'>
                    <h1 className="text-xl">{t("formContratar.datosFacturacion")}</h1>
       
                </header>
                <div className='flex flex-col lg:grid lg:grid-cols-3 gap-4 py-6 px-6 rounded-lg shadow-3xl'>                  
                    <div className="flex-none col-span-full mt-4">
                        <h2 className="">¿A dónde viajás?</h2>
                        <p className="text-gris-medio">Selecciona el pais de destino. Si vas a más de un país deberás seleccionar uno de ellos.</p>
                    </div>
                    <label className='flex-1 relative group' htmlFor="destino">
                    <Select
                            name="destino"
                            placeholder={datoPersona?.destino}
                            styles={customStyles}
                            className="selector"
                            options = { paises }
                            value = {paises.filter(option => option.value === datoPersona?.destino)}
                            onChange={ (e)=>setDato('destino',e.value)}
                        />
                        <span className={`absolute pointer-events-none left-4 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${ datoPersona?.destino != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>Destino</span>

                         {/* <select value={datoPersona?.destino} onChange={(e) => {
                               setDato('destino', e.target.value);
                            }} className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio' name="nacionalidad">
                            <option value="default">Seleccione</option>
                            {
                                paises?.map(val=>{
                                    return <option key={val.id} value={val.nombre}>{val.nombre}</option>
                                })
                            }
                            
                        </select> */}

                        {
                            datoPersona?.destino == '' &&
                            <span className="text-red-600">{errors[position]?.destino}</span>
                        }
                    </label>
                  
                </div>
                <div className='flex flex-col lg:grid lg:grid-cols-3 gap-4 py-6 px-6 rounded-lg shadow-3xl'>
                    
                    <div className="flex-none col-span-full mt-4">
                        <h2 className="">{config?.etiquetas.Title_ContactoEmergencia}</h2>
                        <p className="text-gris-medio">{config?.etiquetas.Label_SolicitudDatosEmergencia}</p>
                    </div>
                    <label className='flex-1 relative group' htmlFor="nameContacto">
                        <input
                        type='text'
                        value={formData?.nameContacto}
                        onChange={(e) => {
                            setFormData({ ...formData, nameContacto: e.target.value });
                        }}
                        className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio'></input>
                        <span className={`absolute pointer-events-none left-3 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${ formData?.nameContacto != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>{config?.etiquetas.Label_Nombres}</span>
                        {
                            formData?.nameContacto == '' &&
                            <span className="text-red-600">{errors2?.nameContacto}</span>
                        }
                    </label>
                    <label className='flex-1 relative group' htmlFor="apellidoContacto">
                        <input
                        type='text'
                        value={formData?.apellidoContacto}
                        onChange={(e) => {
                            setFormData({ ...formData, apellidoContacto: e.target.value });
                        }}
                        className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio'></input>
                        <span className={`absolute pointer-events-none left-3 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${ formData?.apellidoContacto != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>{config?.etiquetas.Label_Apellidos}</span>
                        {
                            formData?.apellidoContacto == '' &&
                            <span className="text-red-600">{errors2?.apellidoContacto}</span>
                        }
                    </label>
                    <label className='flex-1 relative group' htmlFor="telContacto">
                        <input
                        type='number'
                        value={formData?.telContacto}
                        onChange={(e) => {
                            setFormData({ ...formData, telContacto: e.target.value });
                        }}
                        className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio'></input>
                        <span className={`absolute pointer-events-none left-3 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${ formData?.telContacto != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>{config?.etiquetas.Label_TelefonoPersona}</span>
                         {
                            formData?.telContacto == '' &&
                            <span className="text-red-600">{errors2?.telContacto}</span>
                        }
                    </label>
                    
                    
                </div>
            </div>
        </>
    )
}

export default FacturacionData;