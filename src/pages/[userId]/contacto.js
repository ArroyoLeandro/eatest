

import { useEffect} from 'react';
import Cookie from 'js-cookie'
import { useRouter } from 'next/router';

import Banner from '../../components/Banner';
import FormContacto from '../../components/FormContacto';

function Contacto() {
    const router = useRouter();
    useEffect(() => {
        if(!Cookie.get('location')){
            router.replace('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return ( 
        // <AppLayout>
        <>
            <Banner banner='contacto'/>
            <section className='w-full text-principal bg-white'>
                <div className='max-w-screen-xl mx-auto flex flex-col px-6 2xl:px-0'>
                    <div className='flex flex-col justify-between gap-4 sm:gap-6 w-full max-w-screen-sm mx-auto text-center'>
                        <h2 className='flex-1 text-3xl lg:px-16'>Hablemos.</h2>
                        <p className='font-light lg:px-16'>
                        Por cualquier duda o consulta dejanos tus datos que a la brevedad nos comunicaremos con vos.
                        </p>
                    </div>
                    <span className="icon-cierre text-5xl lg:text-8xl text-violeta self-end translate-x-2 -translate-y-3" aria-hidden="true"></span>
                </div>
            </section>
            <FormContacto/>
        </>
        // </AppLayout> 
        )
    }
    
export default Contacto;