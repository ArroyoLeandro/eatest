import Head from 'next/head';
import Footer from './Footer';
import Header from './Header';
import {useRouter} from 'next/router'

import {LocationProvider} from '../../context/locationContext'
import {ConfigProvider} from '../../context/configContext'
import { useEffect } from 'react';


export default function AppLayout({children}){
    
    const router = useRouter();
    useEffect(()=>{
    },[])
    return (
        <LocationProvider>
            <Head>
                <meta charset="utf-8"/>
                <title>Europ Assistance: Cotizador de Asistencia al Viajero</title>
                <meta name="description" content="Nuestras asistencias al viajero se encuentran permanentemente actualizadas y siempre adaptadas a las necesidades de los consumidores. Porque sabemos que no todas las personas necesitan lo mismo, contamos con una amplia variedad de planes y Upgrades para que cada una de ellas pueda armar el plan de viaje más acorde a sus necesidades y momentos."/>
                <meta name="keywords" content="Europ Assistance, asistencia al viajero, asistencia médica, asistencia en viajes, viajes, planes familiares, cobertura de viajes, pérdida de equipaje, seguro de viajes, seguros, latam, latinoamerica, argentina, chile, colombia, ecuador, panamá, paraguay, perú, uruguay, proteccion covid 19, embarazadas, garantia de cruceros, equipaje protegido"/>
                {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests"/> */}
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <input id='seoH1' type='hidden' value='Cotiza tu asistencia al viajero' />
                <meta name="author" content="FlexyStore"/>
                <meta name="copyright" content="flexystore.com"/>
                <link rel="icon" href="/favicon.ico" />
                <link rel="icon" href="/assets/iconos/iconos.css" />

                {/* <!-- open graph --> */}
                <meta property="og:title" content="Europ Assistance: Cotizador de Asistencia al Viajero" />
                <meta property="og:site_name" content="https://europ-assistance.lat/" />
                <meta property="og:description" content="Nuestras asistencias al viajero se encuentran permanentemente actualizadas y siempre adaptadas a las necesidades de los consumidores. Porque sabemos que no todas las personas necesitan lo mismo, contamos con una amplia variedad de planes y Upgrades para que cada una de ellas pueda armar el plan de viaje más acorde a sus necesidades y momentos." />
                <meta property="og:image" content="/assets/images/europ-assitance.svg" />
                {/* <!-- fin open graph --> */}
            </Head>
          <ConfigProvider>
             {router.pathname != "/[userId]/multiasistencia" && router.pathname != "/[userId]/multigracias" && <Header page={router.pathname}/> }
              <main role='main' className='w-full flex-1 flex flex-col'>
                  {children}
              </main>
              {router.pathname !=='/' && router.pathname != "/[userId]/multiasistencia" && router.pathname != "/[userId]/multigracias"  && <Footer/>}
          </ConfigProvider>
        </LocationProvider>
    )
}