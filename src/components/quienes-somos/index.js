
import Banner from '../Banner';
import { useRef, useEffect } from 'react';
import useOnScreen from '../../hooks/useOnScreen';
import CountUp from 'react-countup';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';

import { useTranslation } from 'react-i18next';

function QuienesSomos() {
    const [t, i18n] = useTranslation('global');
    // Ref para elementos animados on screen
    const refInView = useRef();
    const router = useRouter()

    

    useEffect(() => {
        // if(!Cookie.get('location')){
        //     router.replace('/')
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return ( 
        // <AppLayout>
            <>
            <Banner banner='quienes-somos'/>
            <section className='w-full bg-principal text-white text-center px-6 2xl:px-0 py-14 lg:pt-28 lg:pb-20'>
                <h1 ref={refInView} className={`text-4xl lg:text-6xl font-extrabold drop-shadow-4xl uppercase transition-all motion-reduce:transition-none ease-in-out duration-500 ${useOnScreen(refInView, "150%") ? 'md:opacity-100 md:translate-y-0' : 'md:opacity-0 md:translate-y-8'}`}>
                    {t("pageQuienes.mision")}
                </h1>
                <h2 ref={refInView} className={`text-4xl lg:text-6xl font-extrabold text-principal drop-shadow-4xl uppercase leading-[.8] max-w-screen-lg mx-auto transition-all motion-reduce:transition-none ease-in-out duration-500 ${useOnScreen(refInView, "150%") ? 'md:opacity-100 md:translate-y-0' : 'md:opacity-0 md:translate-y-8'}`}>
                    {t("pageQuienes.tobe")}
                </h2>
                <div ref={refInView} className={`pt-6 max-w-screen-lg mx-auto transition-all motion-reduce:transition-none ease-in-out duration-500 ${useOnScreen(refInView, "130%") ? 'md:opacity-100 md:translate-y-0' : 'md:opacity-0 md:translate-y-8'}`}>
                    <p className='inline lg:block'>{t("pageQuienes.mision_parrafoA")}</p>
                    <p className='inline lg:block'>{t("pageQuienes.mision_parrafoB")} <strong>{t("pageQuienes.mision_parrafoB_bold")}</strong></p>
                    <p className='inline lg:block'><strong>{t("pageQuienes.mision_parrafoC")}</strong></p>
                </div>
            </section>
            <section ref={refInView} className={`w-full bg-gris-claro text-principal text-center px-6 2xl:px-0 py-14 transition-all motion-reduce:transition-none ease-in-out duration-500 ${useOnScreen(refInView, "100%") ? 'md:opacity-100 md:translate-y-0' : 'md:opacity-0 md:translate-y-14'}`}>
                <h2 className='text-4xl lg:text-6xl font-extrabold uppercase max-w-screen-md mx-auto'>
                    {t("pageQuienes.from")}
                </h2>
                <p className='pt-6 max-w-screen-md mx-auto'>
                    {t("pageQuienes.from_parrafo1")}
                </p>
            </section>
            <section className='text-principal py-14 bg-contain bg-no-repeat mx-6 ' style={{backgroundImage : 'url(../../assets/images/mapa.png)'}}>
                <div className='max-w-screen-lg mx-auto flex flex-wrap flex-col lg:flex-row justify-between gap-6 lg:gap-16'>
                    <div ref={refInView} className={`lg:flex-1 transition-all motion-reduce:transition-none ease-in-out duration-500 ${useOnScreen(refInView, "85%") ? 'md:opacity-100 md:translate-y-0' : 'md:opacity-0 md:translate-y-28'}`}>
                        <p>
                            {t("pageQuienes.parrafo3")}
                        </p>
                        <p className='pt-8 text-3xl lg:text-4xl font-light max-w-sm'>
                            {t("pageQuienes.parrafo4A")} <span className='whitespace-nowrap'>{t("pageQuienes.parrafo4_bold")}</span>{t("pageQuienes.parrafo4B")}
                        </p>
                    </div>
                    <div ref={refInView} className={`lg:flex-1 flex relative transition-all motion-reduce:transition-none ease-in-out duration-500 ${useOnScreen(refInView, "85%") ? 'md:opacity-100 md:translate-y-0' : 'md:opacity-0 md:translate-y-28'}`}>
                        <span className="icon-apertura text-5xl lg:text-8xl text-rosa absolute -top-3 lg:top-0 left-3 lg:left-16" aria-hidden="true"></span>
                        <img src="/assets/images/img-qs1.jpg" alt="Foto" className='max-w-lg w-full mx-auto mt-auto mb-6' />
                        <span className="icon-cierre text-5xl lg:text-8xl text-amarillo absolute bottom-8 lg:bottom-14 -right-3 xl:-right-10" aria-hidden="true"></span>
                    </div>
                    <div ref={refInView} className={`flex-none w-full text-center transition-all motion-reduce:transition-none ease-in-out duration-500 ${useOnScreen(refInView, "50%") ? 'md:opacity-100 md:translate-y-0' : 'md:opacity-0 md:translate-y-28'}`}>
                        <h2 className='text-4xl lg:text-6xl font-extrabold uppercase max-w-screen-md mx-auto'>
                            {t("pageQuienes.datos")}
                        </h2>
                    </div>
                    
                    <div ref={refInView} className='flex-none w-full flex flex-wrap justify-between gap-6 min-h-[100px] text-center lg:text-left'>
                        {useOnScreen(refInView, "10%") && 
                        <>
                            <div className='flex-1'>
                                <p className='text-4xl lg:text-6xl font-extrabold'><CountUp end={208} /></p>
                                <p className='text-2xl font-extrabold uppercase'>{t("pageQuienes.item1")}</p>
                                <p className='text-xs md:text-sm font-light text-black pt-1 lg:pt-3 leading-tight'>{t("pageQuienes.item1_textA")} <span className='lg:block'>{t("pageQuienes.item1_textB")}</span> </p>
                            </div>
                            <div className='flex-1'>
                                <p className='text-4xl lg:text-6xl font-extrabold'><CountUp end={300} /></p>
                                <p className='text-2xl font-extrabold uppercase'>{t("pageQuienes.item2")}</p>
                                <p className='text-sm font-light text-black pt-1 lg:pt-3 leading-tight'>{t("pageQuienes.item2_text")}</p>
                            </div>
                            <div className='flex-1'>
                                <p className='text-4xl lg:text-6xl font-extrabold'><CountUp end={62} /></p>
                                <p className='text-2xl font-extrabold uppercase'>{t("pageQuienes.item3")}</p>
                                <p className='text-sm font-light text-black pt-1 lg:pt-3 leading-tight'>{t("pageQuienes.item3_text")}</p>
                            </div>
                            <div className=''>
                                <p className='text-4xl lg:text-6xl font-extrabold'><CountUp end={1} /></p>
                                <p className='text-2xl font-extrabold uppercase'>{t("pageQuienes.item4")}</p>
                                <p className='text-sm font-light text-black pt-1 lg:pt-3 leading-tight'>{t("pageQuienes.item4_textA")}<span className='block'>{t("pageQuienes.item4_textB")}</span></p>
                            </div>
                        </>
                        }
                    </div>
                    <div ref={refInView} className='flex-none w-full grid grid-cols-2 md:flex justify-between gap-y-2 lg:gap-y-0 min-h-[50px] text-center lg:text-left'>
                        {useOnScreen(refInView, "0%") && 
                        <>
                            <div className=''>
                            <p className='text-4xl font-extrabold'><CountUp end={5000} /></p>
                            <p className='text-xs'>{t("pageQuienes.item5")}</p>
                            </div>
                            <hr className='hidden lg:block w-0.5 h-full bg-principal'/>
                            <div className=''>
                                <p className='text-4xl font-extrabold'><CountUp end={7898} /></p>
                                <p className='text-xs'>{t("pageQuienes.item6")}</p>
                            </div>
                            <hr className='hidden lg:block w-0.5 h-full bg-principal'/>
                            <div className=''>
                                <p className='text-4xl font-extrabold'><CountUp end={44} /></p>
                                <p className='text-xs'>{t("pageQuienes.item7")}</p>
                            </div>
                            <hr className='hidden lg:block w-0.5 h-full bg-principal'/>
                            <div className=''>
                                <p className='text-4xl font-extrabold'><CountUp end={750000} /></p>
                                <p className='text-xs'>{t("pageQuienes.item8")}</p>
                            </div>
                            <hr className='hidden lg:block w-0.5 h-full bg-principal'/>
                            <div className=''>
                                <p className='text-4xl font-extrabold'><CountUp end={2} /></p>
                                <p className='text-xs'>{t("pageQuienes.item9")}</p>
                            </div>
                            <hr className='hidden lg:block w-0.5 h-full bg-principal'/>
                            <div className=''>
                                <p className='text-4xl font-extrabold'><CountUp end={35} /></p>
                                <p className='text-xs'>{t("pageQuienes.item10")}</p>
                            </div>
                        </>
                        }
                        </div>
                </div>
            </section>
            </>
        //</></AppLayout>
        )
    }
    
export default QuienesSomos;