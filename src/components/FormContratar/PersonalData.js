import {useState,useEffect,useCallback} from "react";
import axios from 'axios'
import { useTranslation } from 'react-i18next';
import Select from 'react-select';


import { useShare } from '../../context/shareContext';
import {useConfig} from '../../context/configContext'


import { Calendar } from 'react-date-range';
import spanish from 'date-fns/locale/es';
import { addDays,addYears, format } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file



function PersonalData({formData, setFormData,config,errors,setErrors,position,setPosition,initPersona,msgDate,setMsgDate}) {
    const [t, i18n] = useTranslation('global');

    const today= format(new Date(), 'yyyy-MM-dd')


    const {setConfig} = useConfig()

    const [paises, setPaises] = useState([])
    const [personasState, setPersonasState] = useState(null)
    const [datoPersona, setDatoPersona] = useState(initPersona)
    const [tiposDoc, setTiposDoc] = useState([])
    
    const [personasEdad, setPersonasEdad] = useState(JSON.parse(localStorage.getItem('planContratar')).personas)
    const { isShared, setIsShared } = useShare()

    //fecha
    const [openInfo, setOpenInfo] = useState(null);
    const [fechaNacimiento, setFechaNacimiento] = useState('')


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
                // setPaises(data)
            }
            catch (e) {
                console.log(e.response.data)

            }
       
      } 
      
      useEffect(()=>{

        getPaises()
        setDatoPersona(formData.datosPersonales)
        setPosition(0)

        let tipos = config?.etiquetas?.List_TiposDocumentos.split(',')
        setTiposDoc(tipos)
        
        if(isShared) {
            let id = JSON.parse(localStorage.getItem('planContratar'))?.id_store
            setRangos()
            getConfig(id)
        } 
// eslint-disable-next-line react-hooks/exhaustive-deps
       },[])

       const handleEscape = useCallback(event => {
        if (event.keyCode === 27) setOpenInfo(null)
    })
    useEffect(() => {
        if (openInfo) document.addEventListener('keydown', handleEscape, false)
        return () => {
            document.removeEventListener('keydown', handleEscape, false)
        }
    }, [handleEscape, openInfo]);


       const getConfig = async (COD) => {
        try {
          let logData = await axios.get(process.env.NEXT_PUBLIC_API_CONFIG+'?codigo='+COD);
          const data = logData.data[0]
            setConfig(data)

            let tipos = data.etiquetas.List_TiposDocumentos.split(',')
            setTiposDoc(tipos)
        }
        catch (e) {
            console.log(e.response.data)

        }
      } 

      

       const setRangos = () =>{
        
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

        setPersonasEdad(personas)
         
       }
       
        useEffect(()=>{
          planes()
        })

 

        useEffect(()=>{
             let persona = formData.datosPersonales[position]
             let pers = initPersona
             let keys = Object.keys(initPersona)
             keys.map(item=>{ 
                if(persona[item]) pers[item] = persona[item]
             })
             setDatoPersona(pers)
             setErrors(formData)
             // eslint-disable-next-line react-hooks/exhaustive-deps
        },[position])

      const planes = ()=>{

        if(localStorage.getItem('planContratar') != null){

            let personas = JSON.parse(localStorage.getItem('planContratar')).personas
            if(personasState == null || personas.length != personasState.length){
                setPersonasState(personas)
                if(position == 0){

                    let existe = true
                   let datos = formData.datosPersonales.map((item,index)=>{
                      if(Object.values(item).length == 18){
                        existe = false
                     }
                     item.id = index
                     return item
                    })

                    formData.datosPersonales = datos
                    
                    if(existe){
                    
                        let info = formData
                        personas = personas.map(item=>{ 
                            item.fechaNacimiento = ''
                            item.id = position
                            return item
                        })
                        info.datosPersonales = personas
                        setFormData(info)
                    }
                 
               }

            }
        }       
        
      }

      const emailValid = (value)=>{
       let valid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)

       return valid
      }

      const setDato = (name,value)=>{
        setDatoPersona({...datoPersona,[name]:value})
        errors[position].fechaNacimiento = ''      
      }

      useEffect(() => {
        let info = formData.datosPersonales
        info[position].id = position
        info[position] = datoPersona
        setFormData({...formData,datosPersonales:info})
        // eslint-disable-next-line react-hooks/exhaustive-deps
      },[datoPersona])

    const customStyles = {
        menu: (provided, state) => ({
          padding: 0,
        })
    }

    const setDate = (val,name) => {
       let valid_date = /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})$/.test(val)
       errors[position].fechaNacimiento = ''
        setDatoPersona({...datoPersona,[name]:val})
       if(valid_date){
        let value = val.split('/').reverse().join('-')
        setFechaNacimiento(value)
        setOpenInfo(null);
        setMsgDate('')
       }else{
        setMsgDate('Formato inválido, debe ser: dd/mm/yyyy ')
       }
    
    }

    const handleClickOpenInfo = (cual) => {
        if (openInfo != cual) {
            setOpenInfo(cual)
        }
        else { setOpenInfo(null); }
    };



    const dateFormat = (string) => {
        return string.replace(/^(\d\d)(\d)$/g,'$1/$2').replace(/^(\d\d\/\d\d)(\d+)$/g,'$1/$2').replace(/[^\d\/]/g,'')
    }
  
      return ( 
        <>
            <div className='flex flex-col'>
                <header className='flex flex-wrap gap-x-4 gap-y-1 pt-8 pb-2 lg:py-6 lg:px-6'>
                {/* <h1 className="text-xl">{t("formContratar.datosPersonales")}</h1> */}

                    {
                        personasState?.map((item,idx)=>{ 
                            return ( <button key={idx} onClick={()=>{setPosition(idx)}}
                                    className={`px-2 lg:px-0 rounded ${idx === position ? "text-white lg:text-principal bg-principal lg:bg-transparent" : "text-gris-medio bg-gris-claro lg:bg-transparent"}`}>
                                    Pasajero {idx+1}
                                </button>)
                        })
                    }
                </header>
                <div className='flex flex-col lg:grid lg:grid-cols-3 gap-4 py-6 px-6 rounded-lg shadow-3xl'>
                <p className="flex-none col-span-full text-red-600">{config?.etiquetas.Step3_DatosPasajeros} {personasEdad.length > 1  ? `del pasajero de ${personasEdad[position].edadMinima} a ${personasEdad[position].edadMaxima} años`:''}</p>

                    <label className='flex-1 relative group' htmlFor="name">
                        <input 
                        name="name"
                        type='text' 
                        value={datoPersona?.nombre} 
                        onChange={(e) => {
                            setDato('nombre',e.target.value);
                        }}
                        className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio '></input>
                        <span className={`absolute pointer-events-none left-4 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${ datoPersona?.nombre != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>{config?.etiquetas.Label_Nombres}</span>
                       {
                        datoPersona?.nombre == '' && 
                        <span className="text-red-600 text-sm">{errors[position]?.nombre}</span>
                       }
                    </label>
                    <label className='flex-1 relative group' htmlFor="apellido">
                        <input 
                        name="lastname"
                        type='text' 
                        value={datoPersona?.apellido} 
                        onChange={(e) => {
                            setDato('apellido',e.target.value);
                        }}
                        className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio'></input>
                        <span className={`absolute pointer-events-none left-4 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${ datoPersona?.apellido != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>{config?.etiquetas.Label_Apellidos}</span>
                       {
                        datoPersona?.apellido == '' && 
                        <span className="text-red-600 text-sm">{errors[position]?.apellido}</span>
                       }
                       </label>
                    <label className='flex-1 relative group' htmlFor="sexo">
                        <select value={datoPersona.sexo} onChange={(e) => {
                            setDato('sexo',e.target.value);
                            }} className='appearance-none w-full py-3 px-4 border border-principal rounded bg-white focus:outline-none focus:border-gris-medio' name="genre">
                            <option value="">Sexo</option>
                            <option value="femenino">Femenino</option>
                            <option value="masculino">Masculino</option>
                        </select>
                        <div className="flex items-center absolute right-0 top-0 h-[50px] pointer-events-none"><div className=" border-l border-gray-300 px-2 my-auto h-6 text-gray-400 group-hover:text-gray-500 group-focus:text-gray-500 opacity-80" aria-hidden="true"><svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="inline-block fill-current stroke-none leading-none"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg></div></div>
                        <span className={`absolute pointer-events-none left-4 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${ datoPersona.sexo != '' ? 'scale-75 -translate-y-2 bg-white' : 'opacity-0'} `}>Sexo</span>
                        {
                         datoPersona?.sexo == '' && 
                            <span className="text-red-600 text-sm">{errors[position]?.sexo}</span>
                        }
                    </label>

                    <label className='flex-1 relative group' htmlFor="nacionalidad">
                        <Select
                            name="nacionalidad"
                            placeholder={datoPersona?.nacionalidad}
                            value={
                                paises.filter(option => 
                                option.value === datoPersona?.nacionalidad)
                                }
                            styles={customStyles}
                            className="selector"
                            options = { paises }
                            onChange={ (e)=>setDato('nacionalidad',e.value)}
                        />
                        <span className={`absolute pointer-events-none left-4 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${ datoPersona?.nacionalidad != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>{config?.etiquetas.Label_Nacionalidad}</span>
                        {
                         datoPersona?.nacionalidad == '' && 
                            <span className="text-red-600 text-sm">{errors[position]?.nacionalidad}</span>
                        }
                    </label>                  
                    <label className='flex-1 relative group' htmlFor="sexo">
                        <select value={datoPersona.documentoTipo} onChange={(e) => {
                            setDato('documentoTipo',e.target.value);
                            }} className='appearance-none w-full py-3 px-4 border border-principal rounded bg-white focus:outline-none focus:border-gris-medio' name="genre">
                            <option value="">{config?.etiquetas.Label_TipoDocumento}</option>
           
                            {
                                tiposDoc?.map((item,idx)=>{
                                    return (
                                       <option key={idx} value={item}>{item}</option>
                                    )
                                })
                            }
                        </select>
                        <div className="flex items-center absolute right-0 top-0 h-[50px] pointer-events-none"><div className=" border-l border-gray-300 px-2 my-auto h-6 text-gray-400 group-hover:text-gray-500 group-focus:text-gray-500 opacity-80" aria-hidden="true"><svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="inline-block fill-current stroke-none leading-none"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg></div></div>
                        <span className={`absolute pointer-events-none left-4 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 scale-75 -translate-y-2 bg-white`}>Documento</span>
                        {
                         datoPersona?.documentoTipo == '' && 
                            <span className="text-red-600 text-sm">{errors[position]?.documentoTipo}</span>
                        }
                    </label>
                      <label className='flex-1 relative group' htmlFor="dni">
                          <input
                              type='text'
                              name="dni"
                              value={datoPersona?.documento}
                              onChange={(e) => {
                                  setDato('documento', e.target.value);
                              }}
                              className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio'></input>
                          <span className={`absolute pointer-events-none left-4 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${datoPersona?.documento != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>Número</span>
                          {
                              datoPersona?.documento == '' &&
                              <span className="text-red-600 text-sm">{errors[position]?.documento}</span>
                          }
                      </label>
                      <label className='flex-1 relative group' htmlFor="fecha" >
                          <input
                              type='text'
                              name="fecha"
                              value={dateFormat(datoPersona?.fechaNacimiento)}
                              placeholder='dd/mm/aaaa'
                              onChange={(e) => {
                                  setDate(e.target.value, 'fechaNacimiento')
                              }}
                              className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio'>

                          </input>
                          <span className={`absolute pointer-events-none left-4 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 scale-75 -translate-y-2 bg-white `}>Fecha de nacimiento</span>
                          {(datoPersona?.fechaNacimiento == '' || errors[position]?.fechaNacimiento != datoPersona?.fechaNacimiento) &&
                              <span className="text-red-600 text-sm" >{errors[position]?.fechaNacimiento}</span>
                          }
                      </label>
                  
                    <label className='flex-1 relative group' htmlFor="email">
                        <input 
                        type='email' 
                        name="email" 
                        value={datoPersona?.email} 
                        onChange={(e) => {
                            setDato('email',e.target.value);
                        }}
                        className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio'></input>
                        <span className={`absolute pointer-events-none left-4 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${ datoPersona?.email != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>{config?.etiquetas.Label_Email}</span>
                        {
                        (datoPersona?.email == '' || errors[position]?.email != datoPersona?.email) && 
                            <span className="text-red-600 text-sm">
                                {!emailValid(datoPersona?.email ) &&
                                    errors[position]?.email
                                }
                            </span>
                        }
                    </label>
                    <label className='flex-1 relative group' htmlFor="tel">
                        <input 
                        type='number'
                        name="telefono"
                        value={datoPersona?.telefono} 
                        onChange={(e) => {
                            setDato('telefono',e.target.value);
                        }}
                        className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio appearance-none'></input>
                        <span className={`absolute pointer-events-none left-4 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${ datoPersona?.telefono != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>{config?.etiquetas.Label_TelefonoPersona} </span>
                        {
                         datoPersona?.telefono == '' && 
                            <span className="text-red-600 text-sm">{errors[position]?.telefono}</span>
                        }
                    </label>
                </div>
            </div>
        </>
    )
}

export default PersonalData;