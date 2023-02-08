
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios'


import { useTranslation } from 'react-i18next';
import { HeaderMulti } from '../../components/AppLayout/HeaderMulti';
import { FooterMulti } from '../../components/AppLayout/FooterMulti';
import { useConfig } from '../../context/configContext';



function MultiGracias() {
    const [t, i18n] = useTranslation('global');

    const [emisionId, setEmisionId] = useState(null);
    const [condiciones, setCondiciones] = useState('#');

    const { config, setConfig } = useConfig()

    useEffect(() => {
        getConfig()
        if (localStorage.getItem('cotizacionID')) {

            getCotizacion().then(res => {
                let emision = localStorage.getItem('emisionId')
                setEmisionId(emision);
                if (localStorage.getItem('etiquetas')) {
                    setCondiciones(JSON.parse(localStorage.getItem('etiquetas')).etiquetas.Url_CondicionesGenerales)
                }
                sendVoucher(emision)
            })
        }
        else {
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getConfig = async () => {
        try {
           let codigo =  localStorage.getItem('cod_user')
            let logData = await axios.get(process.env.NEXT_PUBLIC_URL_CONFIG_MULTI + '?codigo=' + codigo);
            const data = logData.data[0]
            setConfig(data)
        }
        catch (e) {
            console.log(e.response.data)
        }
    }

    const getCotizacion = async () => {
        let COD = localStorage.getItem('cotizacionID')
        let datos = await axios.get(process.env.NEXT_PUBLIC_URL_GET_COTIZACION_MULTI + '?cotizacionId=' + COD);
        const data = datos.data[0]
        return data
    }

    const sendVoucher = async (id) => {
        try {
            let user = localStorage.getItem('cod_user')
            let logData = await axios.get(process.env.NEXT_PUBLIC_URL_VOUCHER_ENVIAR_MULTI + '?emisionId=' + id + '&codigoUsuario=' + user);
            const data = logData.data[0]
        }
        catch (e) {
            console.log(e.response.data)
        }
    }

    const downloadVoucher = async () => {
        try {
            let user = localStorage.getItem('cotizacionID')
            let logData = await axios.get(process.env.NEXT_PUBLIC_URL_VOUCHER_DOWNLOAD_MULTI + '?emisionId=' + emisionId + '&codigoUsuario=' + user);
            const data = logData.data[0]
            let fileName = data.split('/').pop()
            let alink = document.createElement('a');
            alink.href = data;
            alink.download = fileName;
            alink.target = '_blank';
            alink.click();
        }
        catch (e) {
            console.log(e.response.data)
        }
    }




    return (
        <>
            <header role='banner'>
                <div className='w-full max-w-screen-xl flex items-center gap-4 lg:gap-6 py-4 lg:py-6 px-6 2xl:px-0 m-auto'>
                    <div className='flex-1 min-w-max'>
                        <div className="flex items-center p-2 gap-2">
                            <img src="/assets/images/europ-assitance.svg" alt={t("menu.marca")} className='w-28' />
                            {
                                config != null && config.logo != null && <img id="img_logo2" src={`${urlAssets}${config.logo}`} alt={t("menu.marca")} className='w-28' />
                            }
                        </div>
                    </div>
                    {config != null && <HeaderMulti config={config} />}
                </div>
            </header>
            <section className='flex flex-col gap-6 py-10 lg:py-16 px-6 justify-center relative sm:min-h-[250px] bg-[#7c6a5c]' >
                <h1 className='text-4xl font-extrabold text-white relative w-full max-w-screen-xl mx-auto text-center z-30'>MUCHAS GRACIAS POR TU COMPRA</h1>
                <div className='absolute inset-0 w-full h-full z-0 overflow-hidden'>
                    <picture>
                        <source media="(min-width:1280px)" srcSet="../../assets/images/banner/banner-planes-1920.jpg" />
                        <img src="../../assets/images/banner/banner-planes-640.jpg" alt="" className='w-full h-full object-cover object-top -z-10' />
                    </picture>
                </div>
            </section>
            <section className='w-full bg-gris-claro text-principal flex-1'>
                <div className='max-w-screen-md mx-auto flex flex-col gap-6 lg:gap-8 items-center text-center px-6 2xl:px-0 py-14'>
                    <header>
                        <h2 className='text-3xl sm:text-4xl font-extrabold'>
                            Con <span className='whitespace-nowrap'>Europ Assistance</span> estás tranquilo.
                        </h2>
                    </header>
                    <p className='text-xl'>Estarás recibiendo un correo electrónico al mail informado con los detalles de la prestación contratada.
                    </p>
                    <footer className="flex gap-4">
                    </footer>
                </div>
            </section>
            {config != null && <FooterMulti config={config} />}
        </>
    )
}

export default MultiGracias;

