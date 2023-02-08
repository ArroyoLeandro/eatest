import {useState,useEffect} from 'react'
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';

import Script from 'next/script'
import { useRouter } from 'next/router'
// import * as gtag from '../lib/gtag'
import * as fbPixel from '../lib/fpixel'

import * as GTM from '../lib/gtm'

import * as emblue from '../lib/emblue'

import '../../styles/globals.css';
import { ConfigProvider } from "../context/configContext";
import { ShareProvider } from "../context/shareContext";
import { LoadingProvider } from "../context/loadingContext";
import AppLayout from '../components/AppLayout'
import Maintenance from '../components/Maintenance'

import global_es from '../translations/es/global.json';
import global_ar from '../translations/ar/global.json';
import global_en from '../translations/en/global.json';



import Cookie from 'js-cookie';

i18next.init({
  interpolation: {escapeValue: false},
  lng: 'es',
  resources: {
    es: {
      global: global_es
    },
    ar: {
      global: global_ar
    },
    en: {
      global: global_en
    },
  }
})

function App({ Component, pageProps }) {
  // return <Component {...pageProps} /> //original
  //modo mantenimiento
  const [maintenance,setMaintenance] = useState(false)

  const [showChild, setShowChild] = useState(false)


  const router = useRouter()
  // const codigoUserParam = router.asPath.split('?')[1]  
  // const codigoUserParam = router.asPath.split('?')[1].includes('=') ? router.asPath.split('?')[1].split('=')[0].trim() : router.asPath.split('?')[1]


  useEffect(() => {
    localStorage.removeItem('etiquetas') 
    // fbPixel.pageview()

    const handleRouteChange = (url) => {
      // gtag.pageview(url)
      GTM.pageview(url)
      // fbPixel.pageview()
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    router.events.on('hashChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
      router.events.off('hashChangeComplete', handleRouteChange)
    }
  }, [router.events])

  useEffect(() => {
    setShowChild(true)
    // if(router.pathname == '/[userId]') Cookie.set('location','')
  }, [router.pathname])

  if (!showChild) {
    return null
  }

  if(!maintenance){
  return (<>
   {/* Global Site Tag (gtag.js) - Google Analytics */}
   {/* <Script
        strategy="afterInteractive"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        async

        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      /> */}



    <Script
        id="embluemail"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          (function(d,t,u,s,c,f){f=function(m){m=new Date();return m.getFullYear()+''+(m.getMonth()+1)+''+m.getDate()+'T'+m.getHours()+''+m.getMinutes()+''+m.getSeconds()};
          u='${emblue.EMBLUE_URL}?ts='+f();s=d.createElement(t);
          s.async=1;s.src=u;c=d.getElementsByTagName(t)[0];c.parentNode.insertBefore(s,c);})(document,'script');
          `,
        }}
      />


   {/* Global Site Code Pixel (fpixel.js) - Facebook Pixel */}
       <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init',  '${fbPixel.FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />

 {/* Google Tag Manager (gtm.js)- Global base code */}
      <Script
        id="gtag-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${GTM.GTM_ID}');
          `,
        }}
      />
       {/* Metrika */}
    {/* <Script id="Yandex-Metrika-counter"strategy="afterInteractive">
        {
          `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
      
          ym(91011104, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true,
              ecommerce:"dataLayer"
          });`
        }
      </Script> */}
        {/* metrika */}
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/91011104" style={{position:"absolute",left:"-9999px"}} alt="" />
          </div>
        </noscript>

      <ConfigProvider>
      <I18nextProvider i18n={i18next}>
        <ShareProvider>
          <LoadingProvider>
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
          </LoadingProvider>
        </ShareProvider>
      </I18nextProvider>
    </ConfigProvider>
  </>
  )
  }
  return  <Maintenance /> ;
 
}




   // if (process.env.MAINTENANCE) {
  //   return <Maintenance />;
  // }
  // return <Component {...pageProps} />;
  // --------
//   <ConfigProvider>
//   <I18nextProvider i18n={i18next}>
//     <AppLayout>
//       <Component {...pageProps} />
//     </AppLayout>
//   </I18nextProvider>
// </ConfigProvider>
// );

export default App
