import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'
import * as googleTag from '../lib/gtag'
import  * as metaPixel from '../lib/fpixel'
import * as GTM from '../lib/gtm'


export default function Document() {

  return (
    <Html>
      <Head>
                <meta name="description" content="Nuestras asistencias al viajero se encuentran permanentemente actualizadas y siempre adaptadas a las necesidades de los consumidores. Porque sabemos que no todas las personas necesitan lo mismo, contamos con una amplia variedad de planes y Upgrades para que cada una de ellas pueda armar el plan de viaje más acorde a sus necesidades y momentos."/>
                <meta name="keywords" content="Europ Assistance, asistencia al viajero, asistencia médica, asistencia en viajes, viajes, planes familiares, cobertura de viajes, pérdida de equipaje, seguro de viajes, seguros, latam, latinoamerica, argentina, chile, colombia, ecuador, panamá, paraguay, perú, uruguay, proteccion covid 19, embarazadas, garantia de cruceros, equipaje protegido"/>
                {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests"/> */}
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
        <noscript>
          <img height="1" width="1" style={{display:"none"}} alt="fbpixel"
          src={`https://www.facebook.com/tr?id=${metaPixel.FB_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
      </Head>
      <body>
        <Main />
        <NextScript />

        {/* Global Site Tag (gtag.js) - Google Analytics */}
        {/* <Script async src={`https://www.googletagmanager.com/gtag/js?id=${googleTag.GA_TRACKING_ID}`}></Script>
          <Script
            id="gtags-id"
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', ${googleTag.GA_TRACKING_ID}); 
              `,
            }}
          /> */}
          {/* Global Site Tag (gtm.js) - Google tag manager */}

        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM.GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      </body>
    </Html>
  )
}