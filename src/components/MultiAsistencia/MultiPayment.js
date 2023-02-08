import { useState } from "react";
import { useTranslation } from 'react-i18next';
import Cards from 'react-credit-cards';

import 'react-credit-cards/es/styles-compiled.css';

function MultiPayment({ formData, setFormData }) {
    const [t, i18n] = useTranslation('global');
    const [focusInput, setFocusInput] = useState('')
    const [vencimiento, setVencimiento] = useState('')

    const setDato = (name, value) => {
        if (name == 'numeroTarjeta' && /[^0-9-\s]+/.test(value)) return
        setFormData({ ...formData, [name]: value })
    }

    const setVenc = (value) => {
        setVencimiento(value)
        setDato('mesVencimiento', value)
    }


    const cc_expires_format = (string) => {
        return string.replace(
            /[^0-9]/g, '' // To allow only numbers
        ).replace(
            /^([2-9])$/g, '0$1' // To handle 3 > 03
        ).replace(
            /^(1{1})([3-9]{1})$/g, '0$1/$2' // 13 > 01/3
        ).replace(
            /^0{1,}/g, '0' // To handle 00 > 0
        ).replace(
            /^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g, '$1/$2' // To handle 113 > 11/3
        );
    }

    const cc_format = (value) => {
        var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        var matches = v.match(/\d{4,16}/g);
        var match = matches && matches[0] || ''
        var parts = []
        let len = match.length
        for (let i = 0; i < len; i += 4) {
            parts.push(match.substring(i, i + 4))
        }

        if (parts.length) {
            return parts.join(' ')
        } else {
            return value
        }
    }



    return (
        <>
            <div className='flex flex-col'>

                <div className='flex flex-col gap-2 py-6 px-6 rounded-lg shadow-3xl overflow-hidden'>
                    <p className="flex-none col-span-full mb-2">Último paso. Tené a disposición la tarjeta con que se efecturá el pago.</p>
                    <div className="flex flex-col sm:flex-row gap-10">
                        <div className="sm:order-2 row-span-full">
                            <Cards
                                number={formData.numeroTarjeta}
                                expiry={vencimiento}
                                focused={focusInput}
                                cvc={formData.codigoSeguridad}
                                name={formData.titular}
                                acceptedCards={['visa', 'mastercard']}
                                placeholders={{ name: 'Nombre y Apellido' }}
                                locale={{ valid: 'vencimiento' }}
                            />
                        </div>

                        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:order-1 ">

                            <label className='flex-1 relative group ' htmlFor="cc-number">
                                <input
                                    type='tel'
                                    name="cc-number"
                                    id="cc_pan"
                                    value={cc_format(formData?.numeroTarjeta)}
                                    onChange={(e) => {
                                        setDato('numeroTarjeta', e.target.value);
                                    }}
                                    onFocus={(e) => setFocusInput('cc-number')}
                                    className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio'></input>
                                <span className={`absolute pointer-events-none left-3 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${cc_format(formData?.numeroTarjeta) != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>Nro de Tarjeta</span>
                            </label>

                            <div className="flex gap-4">
                                <label className='flex-1 relative group ' htmlFor="cc-exp">
                                    <input
                                        type='tel'
                                        placeholder='mm/aa'
                                        pattern="\d\d/\d\d"
                                        name="cc-exp"
                                        id="cc_expiration"
                                        value={cc_expires_format(vencimiento)}
                                        onChange={(e) => {
                                            setVenc(e.target.value);
                                        }}
                                        onFocus={(e) => setFocusInput('cc-exp')}
                                        className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio'></input>
                                    <span className={`absolute pointer-events-none left-3 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:opacity-100 top-0 ${cc_expires_format(vencimiento) != '' ? 'scale-75 -translate-y-2 bg-white' : 'opacity-0'} `}>Vencimiento</span>
                                </label>

                                <label className='flex-1 relative group' htmlFor="cvc">
                                    <input
                                        type='tel'
                                        value={formData?.codigoSeguridad}
                                        name="cvc"
                                        id="cc_cvv"
                                        onFocus={() => setFocusInput('cvc')}
                                        onChange={(e) => {
                                            setDato('codigoSeguridad', e.target.value);
                                        }}
                                        className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio' ></input>
                                    <span className={`absolute pointer-events-none left-3 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${formData?.codigoSeguridad != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>Cód. seg.</span>
                                </label>
                            </div>
                            {/* <label className='flex-1 relative group' htmlFor="cuotas">
                                <select name="cuotas" className='appearance-none w-full py-3 px-3 border border-principal rounded bg-white focus:outline-none focus:border-gris-medio'
                                    onChange={(e) => {
                                        setDato('cuotas', e.target.value);
                                    }}>
                                    <option value="1" defaultValue>1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                                <div className="flex items-center absolute right-0 top-0 h-[50px] pointer-events-none"><div className=" border-l border-gray-300 px-2 my-auto h-6 text-gray-400 group-hover:text-gray-500 group-focus:text-gray-500 opacity-80" aria-hidden="true"><svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="inline-block fill-current stroke-none leading-none"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg></div></div>
                                <span className={`absolute pointer-events-none left-4 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${formData?.cuotas != '' ? 'scale-75 -translate-y-2 bg-white' : 'opacity-0'} `}>{t("formContratar.cuotas")}</span>
                            </label> */}
                            <h2 className="flex-none col-span-full -mb-4">{t("formContratar.titularTarjeta")}</h2>
                            <label className='flex-1 relative group' htmlFor="cc-name">
                                <input
                                    type='text'
                                    name="cc-name"
                                    value={formData?.titular}
                                    onFocus={() => setFocusInput('cc-name')}
                                    onChange={(e) => {
                                        setDato('titular', e.target.value);
                                    }}
                                    className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio' ></input>
                                <span className={`absolute pointer-events-none left-3 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${formData?.titular != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>Nombre y Apellido</span>
                            </label>
                            <label className='flex-1 relative group' htmlFor="dniTitular">
                                <input
                                    type='number'
                                    name="dniTitular"
                                    value={formData?.dniTitular}
                                    onFocus={() => setFocusInput('dniTitular')}
                                    onChange={(e) => {
                                        setDato('dniTitular', e.target.value);
                                    }}
                                    className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio' ></input>
                                <span className={`absolute pointer-events-none left-3 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${formData?.dniTitular != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>Documento Nro.</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MultiPayment;