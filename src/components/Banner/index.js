import { useEffect, useRef, useState} from 'react';

import styles from './Banner.module.css';
import FormPrincipal from '../../components/FormPrincipal';
import {useLocalStorage} from '../../helpers/index';

import { useTranslation } from 'react-i18next';
import {useConfig} from '../../context/configContext'
import Cookie from 'js-cookie';
import Loading from '../../components/Loading';


export default function Banner(props){
    const [t, i18n] = useTranslation('global');
    //para que se oculte el form en planes si es mobile
    const [isShowCotizar, setIsShowCotizar] = useState()
    const urlAssets=process.env.NEXT_PUBLIC_URL_BASE_ASSETS
    const {config, setConfig} = useConfig()
    const country = Cookie.get('location')
    useEffect(() => {
        if (props.showCotizar) {
            setIsShowCotizar(props.showCotizar)
        } else {
            setIsShowCotizar(false)
        }
        }, [props.showCotizar]);

    return (
        <>
        {props.banner=='home' && <>
        <section aria-label='Cotizar asistencia'
        className={`flex flex-col gap-6 py-6 sm:py-10 lg:py-16 px-6 justify-center relative  ${( config && config.codigo.toLowerCase() == country.toLowerCase() ) ? 'bg-[#69543f]' : 'bg-[#69543f]'}`}>
            {/* <div className='w-full xl:w-auto max-w-screen-xl mx-auto text-white flex flex-col xl:flex-row justify-between sm:justify-center gap-x-6 z-10'>
                <span className="icon-apertura text-5xl md:text-8xl text-amarillo self-start -translate-x-3 -translate-y-3 sm:transform-none" aria-hidden="true"></span>
                <div className='lg:py-10 xl:pt-20 grid md:grid-cols-2 mx-auto sm:w-auto items-center gap-x-6 my-0 lg:-my-10 xl:my-0 sm:text-justify'>
                    <h4 className='text-7xl md:text-8xl font-bold whitespace-nowrap lg:-mb-4'>
                        <span className='text-8xl md:text-[8rem] leading-4'>60</span>%off
                    </h4>
                    <h4 className='text-3xl lg:text-4xl'>
                        <span className='block'>en tu plan de</span>
                        <span className='font-extrabold sm:tracking-wide'>Asistencia al viajero</span>
                    </h4>
                    <p className='text-xl sm:text-2xl lg:text-3xl tracking-wide sm:tracking-normal border-t border-white md:border-none pt-2 md:pt-0 mt-2 md:mt-0'>
                        Además 
                        <span className='text-4xl sm:text-6xl px-2 border-text font-bold text-transparent border-white'>3</span>
                        cuotas sin interés</p>
                    <p className='px-2 sm:px-3 py-1 mt-3 rounded-lg sm:rounded-full bg-principal text-white flex items-center gap-1 lg:gap-3'>
                    <span className="icon-ico-covid text-lg sm:text-xl" aria-hidden="true"><span className="path1 text-secundario"></span><span className='path2 text-white'></span></span>
                    <span className='uppercase text-[10px] sm:text-xs tracking-tight'>Todas nuestras coberturas incluyen cobertura COVID</span></p>
                </div>
                <span className="icon-cierre text-5xl md:text-8xl text-fucsia self-end transform translate-x-3 sm:transform-none" aria-hidden="true"></span>
            </div> */}
            <FormPrincipal/>
            <div className='absolute top-0 inset-x-0 sm:bottom-0 w-full max-h-full sm:h-full z-0 overflow-hidden'>
                {config? <>
                {/* <div className='absolute block sm:hidden left-0 bottom-0 w-full h-full z-10 bg-gradient-to-t from-[#69543f] via-transparent to-transparent'></div> */}
                <picture>
                    <source media="(min-width:1280px)" srcSet={`${urlAssets}${config.backgroundDesktop}`}/>
                    <source media="(min-width:640px)" srcSet={`${urlAssets}${config.backgroundTablet}`}/>
                    <img src={`${urlAssets}${config.background}`} alt="" className='w-full lg:h-full object-content lg:object-cover object-top -z-10' />
                </picture>
                </>
                :
                null
                }
                
            </div>
            {/* 
            <div className='absolute top-0 inset-x-0 sm:bottom-0 w-full max-h-full sm:h-full z-0 overflow-hidden'>
            <div className='absolute block sm:hidden left-0 bottom-0 w-full h-full z-10 bg-gradient-to-t from-[#69543f] via-transparent to-transparent'></div>
                <picture>
                    <source media="(min-width:1280px)" srcSet="../../assets/images/banner/arg-uru-home-1920.jpg"/>
                    <source media="(min-width:640px)" srcSet="../../assets/images/banner/arg-uru-home-1280.jpg"/>
                    <img src="../../assets/images/banner/arg-uru-home-640.jpg" alt="" className='w-full lg:h-full object-content lg:object-cover object-top -z-10' />
                </picture>
            </div>
             */}
        </section>
        </>
        }
        {props.banner=='home-secundario' && <>
        <section className={`relative flex min-h-[350px] bg-principal transition-all duration-150 ease-in-out translate-y-0 opacity-1`}>
            <div className='max-w-screen-md h-full m-auto flex flex-col items-center lg:justify-center gap-6 py-6 px-6 2xl:px-0 text-white lg:text-center z-10'>
                <h2 className='text-3xl lg:text-4xl font-semibold uppercase'>{props.config?.etiquetas.Option_Elegirnos1}</h2>
                <p className='font-light'>{props.config?.etiquetas.Description_Elegirnos1}</p>
            </div>
            <div style={{backgroundImage : 'url(../../assets/images/banner/banner2-home-1920.jpg)'}} className='absolute inset-0 lg:bg-cover bg-center bg-no-repeat z-0'></div>
        </section>
        </>
        }
       {props.banner=='planes-seleccionados' && <>
        <section className='flex flex-col gap-6 py-10 lg:py-16 px-6 justify-center relative lg:min-h-[250px] bg-[#7c6a5c]' >
            {!isShowCotizar ? <FormPrincipal planes={true}/> : <button onClick={() => {setIsShowCotizar(false) }} 
                className="z-30 m-auto py-5 px-6 btn btn-amarillo">Volver a cotizar</button> }
            <div className='absolute inset-0 w-full h-full z-0 overflow-hidden'>
                <div className='absolute block sm:hidden left-0 bottom-0 w-full h-full z-10 bg-gradient-to-t from-[#7c6a5c] via-transparent to-transparent'></div>
                {/* {config ?  */}
                {/* <picture> */}
                    {/* <source media="(min-width:1280px)" srcSet={`${urlAssets}${config.backgroundDesktop}`}/> */}
                    {/* <source media="(min-width:640px)" srcSet={`${urlAssets}${config.backgroundTablet}`}/> */}
                    {/* <img src={`${urlAssets}${config.background}`} alt="" className='w-full lg:h-full object-content lg:object-cover object-top -z-10' /> */}
                {/* </picture> */}
                {/* :  */}
                <picture>
                    <source media="(min-width:640px)" srcSet="../../assets/images/banner/banner-planes-1920.jpg"/>
                    {/* <source media="(min-width:640px)" srcSet="../../assets/images/banner/banner-planes-1280.jpg"/> */}
                    <img src="../../assets/images/banner/banner-planes-640.jpg" alt="" className='w-full sm:h-full object-fill sm:object-cover object-top -z-10' />
                </picture>
                {/* } */}
                
            </div>
        </section>
        </>
        }
        {props.banner=='gracias' && <>
        <section className='flex flex-col gap-6 py-10 lg:py-16 px-6 justify-center relative sm:min-h-[250px] bg-[#7c6a5c]' >
            <h1 className='text-4xl font-extrabold text-white relative w-full max-w-screen-xl mx-auto text-center z-30'>MUCHAS GRACIAS POR TU COMPRA</h1>
            <div className='absolute inset-0 w-full h-full z-0 overflow-hidden'>
                <picture>
                    <source media="(min-width:1280px)" srcSet="../../assets/images/banner/banner-planes-1920.jpg"/>
                    {/* <source media="(min-width:640px)" srcSet="../../assets/images/banner/banner-planes-1280.jpg"/> */}
                    <img src="../../assets/images/banner/banner-planes-640.jpg" alt="" className='w-full h-full object-cover object-top -z-10' />
                </picture>
            </div>
        </section>
        </>
        }
        {props.banner=='quienes-somos' && <>
        <section className='flex flex-col pt-10 lg:pt-16 px-6 justify-center relative lg:min-h-[250px] bg-principal' >
            <h1 className='uppercase text-2xl sm:text-4xl lg:text-6xl font-extrabold text-white relative w-full max-w-screen-xl mx-auto text-center z-30'>
                <span className='block'> {t("pageQuienes.tituloA")} </span>
                <span className='block'> {t("pageQuienes.tituloB")} </span>
                <span className='block'> {t("pageQuienes.tituloC")} </span>
            </h1>
            <div className='w-full max-w-screen-xl mx-auto text-white flex flex-col lg:flex-row justify-between z-20'>
                <span className="icon-apertura text-5xl lg:text-8xl text-amarillo self-start -ml-4 sm:ml-0" aria-hidden="true"></span>
                <div className='pt-10 mt-20 lg:mt-[26vh] flex flex-col mx-auto w-full max-w-screen-sm justify-between gap-6 text-center'>
                    <p className='text-sm sm:text-base font-light drop-shadow-4xl '>
                        {t("pageQuienes.parrafo1")}
                    </p>
                    <p className='text-sm sm:text-base font-light drop-shadow-4xl '>
                        {t("pageQuienes.parrafo2")}
                    </p>
                </div>
                <span className="icon-cierre text-5xl lg:text-8xl text-fucsia self-end -mr-4 sm:mr-0" aria-hidden="true"></span>
            </div>
            <div className='absolute top-0 inset-x-0 sm:bottom-0 w-full max-h-full sm:h-full z-0 overflow-hidden'>
                <div className='absolute left-0 bottom-0 w-full h-full z-10 bg-gradient-to-t from-principal via-transparent to-transparent'></div>
                <picture>
                    <source media="(min-width:1280px)" srcSet="../../assets/images/banner/banner-quienes-somos-1920.jpg"/>
                    <source media="(min-width:640px)" srcSet="../../assets/images/banner/banner-quienes-somos-1280.jpg"/>
                    <img src="../../assets/images/banner/banner-quienes-somos-640.jpg" alt="" className='w-full sm:h-full object-contain sm:object-cover object-top -z-10' />
                </picture>
            </div>
        </section>
        </>
        }
        {props.banner == 'Maintenance' && <>
        <section className='flex flex-col pt-10 lg:pt-16 px-6 justify-center md:justify-start relative h-screen bg-principal' >
            
            <div className='w-full max-w-screen-xl mx-auto text-white flex flex-col lg:flex-row justify-between z-20'>
                
                <span className="icon-apertura text-5xl lg:text-8xl text-amarillo self-start -ml-4 sm:ml-0" aria-hidden="true"></span>
                <h1 className='uppercase text-2xl sm:text-4xl lg:text-6xl font-extrabold text-white relative w-full max-w-screen-xl py-10 mx-auto text-center z-30'>
                    Estamos construyendo la mejor experiencia de asistencia para tu próximo viaje.
                </h1>
                <span className="icon-cierre text-5xl lg:text-8xl text-fucsia self-end -mr-4 sm:mr-0" aria-hidden="true"></span>
            </div>
            <div className='absolute top-0 inset-x-0 sm:bottom-0 w-full max-h-full sm:h-full z-0 overflow-hidden'>
                <div className='absolute left-0 bottom-0 w-full h-full z-10 bg-gradient-to-t from-principal via-transparent to-transparent'></div>
                <picture>
                    <source media="(min-width:1280px)" srcSet="../../assets/images/banner/banner-quienes-somos-1920.jpg"/>
                    <source media="(min-width:640px)" srcSet="../../assets/images/banner/banner-quienes-somos-1280.jpg"/>
                    <img src="../../assets/images/banner/banner-quienes-somos-640.jpg" alt="" className='w-full sm:h-full object-contain sm:object-cover object-top -z-10' />
                </picture>
            </div>
        </section>
        </>}
        {props.banner=='nuestras-coberturas' && <>
        <section className='flex flex-col py-10 lg:py-16 px-6 justify-center relative lg:min-h-[250px] bg-celeste' >
            <h1 className='text-4xl lg:text-6xl font-extrabold text-white relative w-full max-w-screen-xl mx-auto text-center z-30'>{t("pagePlanes.tituloA")}<span className='block'>{t("pagePlanes.tituloB")}</span></h1>
            <div className='w-full lg:w-auto max-w-screen-xl mx-auto text-white flex flex-col lg:flex-row justify-center lg:gap-6 z-20'>
                <span className="icon-apertura text-5xl lg:text-8xl text-amarillo self-start -translate-x-2 translate-y-3" aria-hidden="true"></span>
                <div className='lg:py-10 mt-8 sm:mt-[10vh] lg:mt-[20vh] flex flex-col md:flex-row mx-auto w-full text-center md:text-left md:justify-between gap-y-3 gap-x-6'>
                    <h2 className='flex-1 text-xl sm:text-3xl leading-tight'>{t("pagePlanes.parrafo1")}</h2>
                    <p className='flex-1 text-sm sm:text-base font-light '>{t("pagePlanes.parrafo2")}</p>
                </div>
                <span className="icon-cierre text-5xl lg:text-8xl text-fucsia self-end translate-x-2 -translate-y-3" aria-hidden="true"></span>
            </div>
            <div className='absolute top-0 inset-x-0 sm:bottom-0 w-full max-h-full sm:h-full z-0 overflow-hidden'>
                <div className='absolute left-0 bottom-0 w-full h-full z-10 bg-gradient-to-t from-celeste via-transparent to-transparent'></div>
                <picture>
                <source media="(min-width:1280px)" srcSet="../../assets/images/banner/banner-nuestras-coberturas-1920.jpg"/>
                <source media="(min-width:640px)" srcSet="../../assets/images/banner/banner-nuestras-coberturas-1280.jpg"/>
                    <img src="../../assets/images/banner/banner-nuestras-coberturas-640.jpg" alt="" className='w-full sm:h-full object-contain sm:object-cover object-top -z-10' />
                </picture>
            </div>
        </section>
        </>
        }
        {props.banner=='preguntas-frecuentes' && <>
        <section className='flex flex-col py-10 lg:py-16 px-6 justify-center relative lg:min-h-[250px]' >
            <h1 className='text-4xl lg:text-6xl font-extrabold text-white relative w-full max-w-screen-xl mx-auto text-center z-30'>
                PREGUNTAS<span className='block'>FRECUENTES</span></h1>
            <div className='w-full lg:w-auto max-w-screen-xl mx-auto text-white flex flex-col lg:flex-row justify-center lg:gap-6 z-20'>
            </div>
            <div className='absolute top-0 inset-x-0 sm:bottom-0 w-full h-full z-0 overflow-hidden'>
                <div className='absolute left-0 bottom-0 w-full h-full z-10 bg-gradient-to-t via-transparent from-white to-transparent'></div>
                <picture className='flex-none'>
                    <source media="(min-width:1280px)" srcSet="../../assets/images/banner/banner-preguntas-frecuentes-1920.jpg"/>
                    <source media="(min-width:640px)" srcSet="../../assets/images/banner/banner-preguntas-frecuentes-1280.jpg"/>
                    <img src="../../assets/images/banner/banner-preguntas-frecuentes-640.jpg" alt="" className='w-full h-full object-cover object-top -z-10' />
                </picture>
            </div>
        </section>
        </>
        }
        {props.banner=='arrepentimiento' && <>
        <section className='flex flex-col pt-10 lg:pt-16 px-6 justify-center relative lg:min-h-[250px] bg-white' >
            <h1 className='text-4xl lg:text-6xl font-extrabold text-white relative w-full max-w-screen-md mx-auto text-center z-30'>
            ¿QUERÉS REALIZAR<span className='block'>UNA DEVOLUCIÓN?</span></h1>
            <div className='w-full max-w-screen-xl mx-auto text-principal flex flex-col justify-center z-20'>
                <span className="icon-apertura text-5xl lg:text-8xl text-secundario self-start -translate-x-2 translate-y-3" aria-hidden="true"></span>
            </div>
            <div className='absolute top-0 inset-x-0 sm:bottom-0 w-full h-full z-0 overflow-hidden'>
                <div className='absolute left-0 bottom-0 w-full h-full z-10 bg-gradient-to-t via-transparent from-white to-transparent'></div>
                <picture className='flex-none'>
                    <source media="(min-width:1280px)" srcSet="../../assets/images/banner/banner-arrepentimiento-1920.jpg"/>
                    <source media="(min-width:640px)" srcSet="../../assets/images/banner/banner-arrepentimiento-1280.jpg"/>
                    <img src="../../assets/images/banner/banner-arrepentimiento-640.jpg" alt="" className='w-full h-full object-cover object-top -z-10' />
                </picture>
            </div>
        </section>
        </>
        }
        {props.banner=='contacto' && <>
        <section className='flex flex-col pt-10 lg:pt-16 px-6 justify-center relative lg:min-h-[250px] bg-white' >
            <h1 className='text-4xl lg:text-6xl font-extrabold text-white relative w-full max-w-screen-md mx-auto text-center z-30'>
            CONTACTANOS</h1>
            <div className='w-full max-w-screen-xl mx-auto text-principal flex flex-col justify-center z-20 pt-8 lg:pt-14'>
                <span className="icon-apertura text-5xl lg:text-8xl text-celeste self-start -translate-x-2 translate-y-3" aria-hidden="true"></span>
            </div>
            <div className='absolute top-0 inset-x-0 sm:bottom-0 w-full h-full z-0 overflow-hidden'>
                <div className='absolute left-0 bottom-0 w-full h-full z-10 bg-gradient-to-t via-transparent from-white to-transparent'></div>
                <picture className='flex-none'>
                <source media="(min-width:1280px)" srcSet="../../assets/images/banner/banner-contacto-1920.jpg"/>
                <source media="(min-width:640px)" srcSet="../../assets/images/banner/banner-contacto-1280.jpg"/>
                <img src="../../assets/images/banner/banner-contacto-640.jpg" alt="" className='w-full h-full object-cover object-top -z-10' />
                </picture>
            </div>
        </section>
        </>
        }
        </>
    )
}