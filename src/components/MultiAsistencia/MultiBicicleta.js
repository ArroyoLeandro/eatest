import { useState, useEffect } from "react";

function MultiBicicleta({ formData, setFormData, initPersona, position, config, isSend }) {

    const [datoSeguro, setDatoSeguro] = useState(initPersona)

    useEffect(() => {
        if (formData.datosSeguro.length > 0) {
            setDatoSeguro(formData.datosSeguro[0])
        }
    }, [])



    const setDato = (name, value) => {
        setDatoSeguro({ ...datoSeguro, [name]: value })
    }

    useEffect(() => {
        let info = formData.datosSeguro
        info[position] = datoSeguro
        info[position].id = position
        setFormData({ ...formData, datosSeguro: info })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [datoSeguro])


    const emailValid = (value) => {
        let valid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
        return valid
    }

    return (
        <>
            <div className='flex flex-col'>
                <div className='flex flex-col lg:grid lg:grid-cols-3 gap-4 py-6 px-6 rounded-lg shadow-3xl'>
                    <p className="flex-none col-span-full text-principal">Datos del Beneficiario</p>
                    <label className='flex-1 relative group' htmlFor="firstName">
                        <input
                            name="firstName"
                            type='text'
                            value={datoSeguro?.nombre}
                            onChange={(e) => {
                                setDato('nombre', e.target.value);
                            }}
                            className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio '></input>
                        <span className={`absolute pointer-events-none left-4 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${datoSeguro?.nombre != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>Nombre</span>
                        {
                            datoSeguro?.nombre == '' && isSend && <span className="text-red-600 text-sm">Nombre inválido</span>
                        }
                    </label>
                    <label className='flex-1 relative group' htmlFor="lastName">
                        <input
                            name="lastName"
                            type='text'
                            value={datoSeguro?.apellido}
                            onChange={(e) => {
                                setDato('apellido', e.target.value);
                            }}
                            className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio'></input>
                        <span className={`absolute pointer-events-none left-4 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${datoSeguro?.apellido != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>Apellido</span>
                        {
                            datoSeguro?.apellido == '' && isSend &&
                            <span className="text-red-600 text-sm">Apellido inválido</span>
                        }
                    </label>
                    <label className='flex-1 relative group' htmlFor="dni">
                        <input
                            type='text'
                            name="dni"
                            value={datoSeguro?.documento}
                            onChange={(e) => {
                                setDato('documento', e.target.value);
                            }}
                            className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio'></input>
                        <span className={`absolute pointer-events-none left-4 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${datoSeguro?.documento != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>Número de Documento</span>
                        {
                            datoSeguro?.documento == '' && isSend &&
                            <span className="text-red-600 text-sm">Documento inválido</span>
                        }
                    </label>
                    <label className='flex-1 relative group' htmlFor="email">
                        <input
                            type='email'
                            name="email"
                            value={datoSeguro?.email}
                            onChange={(e) => {
                                setDato('email', e.target.value);
                            }}
                            className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio'></input>
                        <span className={`absolute pointer-events-none left-4 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${datoSeguro?.email != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>Email</span>

                        {(emailValid(datoSeguro?.email) && isSend) || (datoSeguro?.email == '' && isSend) &&
                            <span className="text-red-600 text-sm">Email inválido</span>
                        }
                    </label>
                    <label className='flex-1 relative group' htmlFor="tel">
                        <input
                            type='number'
                            name="tel"
                            value={datoSeguro?.telefono}
                            onChange={(e) => {
                                setDato('telefono', e.target.value);
                            }}
                            className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio appearance-none'></input>
                        <span className={`absolute pointer-events-none left-4 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${datoSeguro?.telefono != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>Telefono</span>
                    </label>
                    <label className="flex-none w-full col-span-full flex gap-3 flex-wrap items-center mt-2" htmlFor="terms">
                        <input type='checkbox'
                            onChange={(e) => {
                                setFormData({ ...formData, terminosCondicionesAceptados: e.target.checked })
                            }}
                            name="terms" className="border border-principal rounded w-5 h-5 appearance-none checked:bg-principal cursor-pointer" />
                        <a href={config?.etiquetas.Url_CondicionesGenerales} target="_blank" rel="noreferrer" className="text-sm hover:underline focus:underline focus:outline-none">Acepto los términos y condiciones</a>
                        {formData.terminosCondicionesAceptados == false && <span className="text-red-600 text-sm ">Debe aceptar los términos y condiciones</span>}
                    </label>
                </div>
            </div>
        </>
    )
}

export default MultiBicicleta
