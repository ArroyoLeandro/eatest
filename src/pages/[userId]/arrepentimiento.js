import { useEffect} from 'react';
import Cookie from 'js-cookie'
import { useRouter } from 'next/router';

import Banner from '../../components/Banner';
import FormArrepentimiento from '../../components/FormArrepentimiento';

function Arepentimiento() {
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
            <Banner banner='arrepentimiento'/>
            <section className='w-full text-principal bg-white'>
                <div className='max-w-screen-xl mx-auto flex flex-col px-6 2xl:px-0'>
                    <div className='flex flex-col justify-between gap-4 sm:gap-6 w-full max-w-screen-sm mx-auto text-center'>
                        <h2 className='flex-1 text-3xl px-0 lg:px-16'>Inicia el proceso de arrepentimiento de compra ahora mismo.</h2>
                        <p className='font-light px-0 lg:px-16'>
                        Por favor completá el siguiente formulario para iniciar la cancelación del producto en nuestrosl sistemas. Recordá que sólo podrás hacerlo
                        si realizaste tu compra hace menos de 10 días. 
                        </p>
                    </div>
                    <span className="icon-cierre text-5xl lg:text-8xl text-principal self-end translate-x-2 -translate-y-3" aria-hidden="true"></span>

                </div>
            </section>
            <FormArrepentimiento/>
        </>
           // </AppLayout>
        )
    }
    
export default Arepentimiento;