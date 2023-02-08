
import { useEffect, useRef} from 'react';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import useOnScreen from '../../hooks/useOnScreen';
import Banner from '../../components/Banner';


function NuestrasCoberturas() {
    const [t, i18n] = useTranslation('global');
    const router = useRouter();
    // Ref para elementos animados on screen
    const refInView = useRef();
    
    useEffect(() => {
        if(!Cookie.get('location')){
            router.replace('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])



    return ( 
        //<AppLayout>
        <>
            <Banner banner='nuestras-coberturas'/>
            <section className='w-full flex flex-col bg-celeste text-white'>
                <div className='max-w-screen-xl mx-auto flex flex-col sm:flex-row sm:flex-wrap justify-center gap-4 px-6 2xl:px-0 pb-14'>
                    <article className='sm:max-w-[250px] sm:min-w-[200px] flex-1 flex flex-col py-6 px-6 lg:pt-10 lg:pb-8 lg:px-8 rounded-lg bg-white text-principal shadow-3xl overflow-hidden'>
                        <h3 className='text-3xl font-bold'>TITANIUM PLUS</h3>
                        <p className='text-xl mt-1 mb-4'>Cobertura médica: <span className='whitespace-nowrap'>U$D 150.000.-</span></p>
                        <p className='text-xs font-light flex-1'>Este es el tope de cobertura por asistencia médica de este plan.</p>
                    </article>
                    <article className='sm:max-w-[250px] sm:min-w-[200px] flex-1 flex flex-col py-6 px-6 lg:pt-10 lg:pb-8 lg:px-8 rounded-lg bg-white text-principal shadow-3xl overflow-hidden'>
                        <h3 className='text-3xl font-bold'>TITANIUM </h3>
                        <p className='text-xl mt-1 mb-4'>Cobertura médica: <span className='whitespace-nowrap'>U$D 100.000.-</span></p>
                        <p className='text-xs font-light flex-1'>Este es el tope de cobertura por asistencia médica de este plan.</p>
                    </article>
                    <article className='sm:max-w-[250px] sm:min-w-[200px] flex-1 flex flex-col py-6 px-6 lg:pt-10 lg:pb-8 lg:px-8 rounded-lg bg-white text-principal shadow-3xl overflow-hidden'>
                        <h3 className='text-3xl font-bold'>GOLD</h3>
                        <p className='text-xl mt-1 mb-4'>Cobertura médica: <span className='whitespace-nowrap'>U$D 60.000.-</span></p>
                        <p className='text-xs font-light flex-1'>Este es el tope de cobertura por asistencia médica de este plan.</p>
                    </article>
                    <article className='sm:max-w-[250px] sm:min-w-[200px] flex-1 flex flex-col py-6 px-6 lg:pt-10 lg:pb-8 lg:px-8 justify-start rounded-lg bg-white text-principal shadow-3xl overflow-hidden'>
                        <h3 className='text-3xl font-bold'>SILVER</h3>
                        <p className='text-xl mt-1 mb-4'>Cobertura médica: <span className='whitespace-nowrap'>U$D 35.000.-</span></p>
                        <p className='text-xs font-light flex-1'>Este es el tope de cobertura por asistencia médica de este plan.</p>
                    </article>
                    <article className='sm:max-w-[250px] sm:min-w-[200px] flex-1 flex flex-col py-6 px-6 lg:pt-10 lg:pb-8 lg:px-8 rounded-lg bg-white text-principal shadow-3xl overflow-hidden'>
                        <h3 className='text-3xl font-bold'>BRONCE</h3>
                        <p className='text-xl mt-1 mb-4'>Cobertura médica: <span className='whitespace-nowrap'>U$D 15.000.-</span></p>
                        <p className='text-xs font-light flex-1'>Este es el tope de cobertura por asistencia médica de este plan.</p>
                    </article>
                </div>
                <button className='mb-5 lg:mb-10 mx-auto py-3 px-8 btn btn-principal shadow-sm'
                    onClick={() => {router.push({pathname: '/[userId]', query: { userId: router.query.userId}})}}
                    >Cotizá tu asistencia al viajero
                </button>
            </section>
            <section className='w-full text-principal relative'>
                <span className="absolute left-0 top-0.5 icon-apertura text-5xl lg:text-[15rem] text-gris-claro -z-10" aria-hidden="true"></span>
                <div className='max-w-screen-md mx-auto flex flex-col gap-6 lg:gap-8 px-6 2xl:px-0 py-14'>
                    <header ref={refInView} className={`flex flex-col lg:flex-row gap-6 lg:gap-8 justify-between transition-all motion-reduce:transition-none ease-in-out duration-500 ${useOnScreen(refInView, "100%") ? 'md:opacity-100 md:translate-y-0' : 'md:opacity-0 md:translate-y-8'} `}>
                        <h2 className='flex-1 text-4xl lg:text-6xl font-extrabold'>
                            {t("pagePlanes.upgradesA")}<span className='block'>{t("pagePlanes.upgradesB")}</span>
                        </h2>
                        <p className='flex-1 text-sm font-light'>
                            {t("pagePlanes.parrafo3")}
                        </p>
                    </header>
                    <article ref={refInView} className={`relative flex flex-col sm:grid grid-flow-col text-center sm:text-left rounded-lg border border-principal p-6 gap-x-4 gap-y-3 transition-all motion-reduce:transition-none ease-in-out duration-500 ${useOnScreen(refInView, "75%") ? 'md:opacity-100 md:translate-y-0' : 'md:opacity-0 md:translate-y-8'}`}>
                        <span className="sm:row-span-2 icon-ico-enfermedad text-7xl self-center" aria-hidden="true"><span className="path1 text-rosa"></span><span className='path2 '></span></span>
                        <h3 className='flex-1 uppercase text-2xl font-semibold'>{t("pagePlanes.item1")}</h3>
                        <p className='sm:flex-initial text-sm font-light'>{t("pagePlanes.item1_parrafo")}</p>
                    </article>
                    <article ref={refInView} className={`relative flex flex-col sm:grid grid-flow-col text-center sm:text-left rounded-lg border border-principal p-6 gap-x-4 gap-y-3 transition-all motion-reduce:transition-none ease-in-out duration-500 ${useOnScreen(refInView, "50%") ? 'md:opacity-100 md:translate-y-0' : 'md:opacity-0 md:translate-y-8'}`}>
                    <span className="row-span-2 icon-ico-deportes text-7xl sm:self-center" aria-hidden="true"><span className="path1 text-rosa"></span><span className='path2 '></span></span>
                        <h3 className='uppercase text-2xl font-semibold'>{t("pagePlanes.item2")}</h3>
                        <p className='text-sm font-light'>{t("pagePlanes.item2_parrafo")}</p>
                    </article>
                    <article ref={refInView} className={`relative flex flex-col sm:grid grid-flow-col text-center sm:text-left rounded-lg border border-principal p-6 gap-x-4 gap-y-3 transition-all motion-reduce:transition-none ease-in-out duration-500 ${useOnScreen(refInView, "25%") ? 'md:opacity-100 md:translate-y-0' : 'md:opacity-0 md:translate-y-8'}`}>
                        <span className="row-span-2 icon-ico-extras text-7xl sm:self-center" aria-hidden="true"><span className="path1 text-rosa"></span><span className='path2 '></span></span>
                        <h3 className='uppercase text-2xl font-semibold'>{t("pagePlanes.item3")}</h3>
                        <p className='text-sm font-light'>{t("pagePlanes.item3_parrafo")}</p>
                    </article>
                    <article ref={refInView} className={`bg-principal text-white relative flex flex-col sm:grid grid-flow-col text-center sm:text-left rounded-lg border border-principal p-6 gap-x-4 gap-y-3 transition-all motion-reduce:transition-none ease-in-out duration-500 ${useOnScreen(refInView, "0%") ? 'md:opacity-100 md:translate-y-0' : 'md:opacity-0 md:translate-y-8'}`}>
                        <span className="row-span-2 icon-ico-embarazadas2 text-7xl sm:self-center" aria-hidden="true"><span className="path1 text-rosa"></span><span className='path2'></span></span>
                        <p className=''>{t("pagePlanes.item4_parrafoA")} <strong>{t("pagePlanes.item4_parrafoA_bold")}</strong> 
                        {t("pagePlanes.item4_parrafoB")} <strong>{t("pagePlanes.item4_parrafoB_bold")}</strong>
                        </p>
                    </article>
                </div>
                <span className="absolute right-0 bottom-0 icon-cierre text-5xl lg:text-[15rem] text-gris-claro -z-10" aria-hidden="true"></span>
            </section>
            <section ref={refInView} className='w-full text-principal mb-6'>
                <div className={`relative max-w-screen-md mx-auto flex flex-col gap-2 items-center text-center px-6 2xl:px-0 py-14 transition-all motion-reduce:transition-none ease-in-out duration-500 ${useOnScreen(refInView, "-15%") ? 'md:opacity-100 md:translate-y-0' : 'md:opacity-0 md:translate-y-8'}`}>
                    <span className="absolute left-0 lg:-translate-x-full top-0.5 icon-apertura text-5xl lg:text-6xl text-amarillo" aria-hidden="true"></span>
                    <p className='text-2xl lg:px-6'><strong className='font-extrabold'>{t("pagePlanes.europ")}</strong> {t("pagePlanes.europ_parrafo")} </p>
                    <p className='text-sm font-light mt-10'>{t("pagePlanes.europ_todavia")}</p>
                    <button className="py-5 px-6 btn-amarillo rounded-xl sm:rounded-full shadow-2xl shadow-amarillo hover:shadow-principal focus:shadow-principal"
                        onClick={() => {router.push({pathname: '/[userId]', query: { userId: router.query.userId}})}}
                    >
                        {t("pagePlanes.europ_button")}
                    </button>
                    <span className="absolute right-0 lg:translate-x-full bottom-0 icon-cierre text-5xl lg:text-6xl text-secundario" aria-hidden="true"></span>
                </div>
            </section>
            </>
       // </AppLayout>
        )
    }
    
export default NuestrasCoberturas;