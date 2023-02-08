import { useState,useRef } from "react";
import axios from 'axios'
import { useTranslation } from 'react-i18next';
import Cookie from 'js-cookie';

import Loading from '../Loading';
import Modal from '../Modal';

function FormContacto() {

  const [translate, i18n] = useTranslation('global');

    const initialState = {
        nombre: "",
        apellido: "",
        email: "",
        motivo: "",
        codigo: Cookie.get('location'),
        type: 1
    }
    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);

    const modal = useRef(null)
  
  const [messageError, setMessageError] = useState('')
  const messageSuccess = translate("formContacto.sendSuccess")

const send = async () => {
        setLoading(true);
        if(ValidateEmail(formData.email) && validateForm()){
            try {
                // console.log('data',formData)
                let logData = await axios.post(process.env.NEXT_PUBLIC_URL_POST_SEND_EMAIL_FORM,formData);
                const response = logData.data[0]
                setMessageError('')
                setFormData(initialState)
            } catch (error) {
                setMessageError(translate("formContacto.sendError"))
                console.log('err=>',error.response.data)
            }
        }
        modal.current.openModal()        
        setLoading(false);

    }

    function validateForm(){
        let info = Object.entries(formData)
        let valid = true
        let campos = ''
        let first = true
        let varios = false
        info.map((item,idx)=>{
            if(item[1] == '') {
                if(first){
                    campos += ' '+item[0]+' '
                    first = false    
                }else{
                    campos += '- '+item[0]+''
                    varios = true
                } 
                valid = false;
                return
            }
        })
        if(valid == false){
           if(!varios){
               setMessageError('El campo '+campos.toUpperCase()+' es obligatorio')
            } 
            else{
               setMessageError('Los campos '+campos.toUpperCase()+' son obligatorios')

            }
        }
        return valid
    }

    function ValidateEmail(mail){

        let valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)
        
        if(valid) return true
        else{
            setMessageError('El email es invalido')
        }
        return false

    }

    return ( 
        <>
            <div role='form' aria-label="Contacto" className='w-full max-w-screen-lg mx-auto flex flex-col gap-6 py-10 lg:py-16 px-6 items-center'>
                <div className='w-full flex flex-col lg:grid lg:grid-cols-3 gap-4 py-6 px-6 rounded-lg shadow-3xl overflow-hidden'>
                    <label className='flex-1 relative group' htmlFor="name"><input 
                        type='text' 
                        name="name"
                        value={formData.nombre} 
                        onChange={(e) => {
                            setFormData({...formData, nombre:e.target.value});
                        }}
                        className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio '></input>
                        <span className={`absolute pointer-events-none left-4 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${ formData.nombre != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>Nombre</span>
                    </label>
                    <label className='flex-1 relative group' htmlFor="apellido"><input 
                        name="lastname"
                        type='text' 
                        value={formData.apellido} 
                        onChange={(e) => {
                            setFormData({...formData, apellido:e.target.value});
                        }} 
                        className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio '></input>
                        <span className={`absolute pointer-events-none left-4 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${ formData.apellido != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>Apellido</span>
                    </label>
                    <label className='flex-1 relative group' htmlFor="email"><input 
                        type='text' 
                        name="email"
                        value={formData.email} 
                        onChange={(e) => {
                            setFormData({...formData, email:e.target.value});
                        }}
                        className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio '></input>
                        <span className={`absolute pointer-events-none left-4 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${ formData.email != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>E-mail</span>
                    </label>
                    <label className='flex-none w-full col-span-3 relative group' htmlFor="motivo"><textarea 
                        name="subject"
                        value={formData.motivo} 
                        onChange={(e) => {
                            setFormData({...formData, motivo:e.target.value});
                        }}
                        className='w-full py-3 px-4 border border-principal rounded focus:outline-none focus:border-gris-medio '></textarea>
                        <span className={`absolute pointer-events-none left-4 px-1 text-gris-medio transition-all ease-out origin-left whitespace-nowrap group-focus-within:-translate-y-2 group-focus-within:scale-75 group-focus-within:bg-white group-focus-within:py-0 top-0 ${ formData.motivo != '' ? 'scale-75 -translate-y-2 bg-white' : 'py-3 scale-100'} `}>¿En qué podemos ayudarte?</span>
                    </label>
                    
                </div>
                <button className="py-5 px-6 btn btn-amarillo w-full lg:w-56 text-xl font-bold lg:font-normal shadow-2xl shadow-amarillo hover:shadow-principal focus:shadow-principal" 
                    onClick={() => {send()}}>
                        Enviar
                </button>
            </div>
           {loading &&  <Loading/>}
           <Modal ref={modal}>
          <article className="w-full min-h-[200px] max-w-screen-md max-h-full flex flex-col text-principal bg-white rounded-lg shadow-xl overflow-hidden">
                {messageError != '' ?
                    <header className="relative w-full h-full flex p-6 md:p-10">
                    <span className="icon-ico-alert text-3xl lg:text-6xl" aria-hidden="true"><span className="path1 text-amarillo"></span><span className='path2 text-principal'></span></span>
                    <div className="flex flex-col gap-3 md:gap-4 p-4">
                        <h2 className="text-2xl md:text-4xl font-bold leading-none md:leading-10">Ocurrió un error!</h2>
                        <h3 className="flex-1 flex items-center text-xl leading-none md:leading-10 font-bold">{messageError}</h3>
                    </div>
                </header>
                : 
                <header className="relative w-full h-full flex p-6 md:p-10">
                    <span className="icon-apertura text-3xl lg:text-6xl" aria-hidden="true"><span className="path1 text-amarillo"></span><span className='path2 text-principal'></span></span>
                    <div className="flex flex-col gap-3 md:gap-4 p-4">
                        <h2 className="text-2xl md:text-4xl font-bold leading-none md:leading-10 text-center">Enviado con Exito!</h2>
                        <h3 className="flex-1 flex items-center text-xl leading-none md:leading-10 font-bold">{messageSuccess}</h3>
                    </div>
                    <span className="icon-cierre text-3xl lg:text-6xl text-violeta self-end translate-x-2 -translate-y-3" aria-hidden="true"></span>
                </header>
                }
                
            </article>
          </Modal>
        </>
    )
}

export default FormContacto