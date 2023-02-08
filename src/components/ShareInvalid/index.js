import {useRouter} from 'next/router';
import { useEffect } from 'react';

export default function ShareInvalid({phone}) {
    const router = useRouter()

    useEffect(() => {
        document.body.classList.add('overflow-hidden');
    },[])
   
    return ( 
        <div className="fixed z-50 inset-0 w-full h-full flex items-center justify-center bg-white bg-opacity-60">
            <div className='flex flex-col gap-10 items-center'>
                <span className="icon-ico-alert text-3xl lg:text-6xl " aria-hidden="true"><span className="path1 text-amarillo"></span><span className='path2 text-principal'></span></span>
                <h3 className='text-principal text-center text-4xl font-extrabold'>Esta oferta ya caducó <br/> Vuelve a contactar con tu vendedor</h3>
                <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer" className="flex-1 text-center cursor-pointer py-5 px-6 rounded bg-terciario btn btn-amarillo lg:w-56 shadow-2xl shadow-amarillo hover:shadow-principal focus:shadow-principal">
                Contactar 
                </a>
            </div>
        </div>
    )
}
    

