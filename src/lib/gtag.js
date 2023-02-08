import {GetTrackId} from './trackId'

export const listTags = [
  {
    pais: 'argentina',
    tagID: process.env.NEXT_PUBLIC_GTAG_ID_ARGENTINA,
    send_to_cotizar: process.env.NEXT_PUBLIC_GTAG_SEND_TO_COTIZAR_ARGENTINA,
    send_to_pagar: process.env.NEXT_PUBLIC_GTAG_SEND_TO_PAGAR_ARGENTINA,
    send_to_llamar: process.env.NEXT_PUBLIC_GTAG_SEND_TO_LLAMADA_ARGENTINA,
    send_to_whatsapp: process.env.NEXT_PUBLIC_GTAG_SEND_TO_WHATSAPP_ARGENTINA
  },
  {
    pais: 'uruguay',
    tagID: process.env.NEXT_PUBLIC_GTAG_ID_URUGUAY,
    send_to_cotizar: process.env.NEXT_PUBLIC_GTAG_SEND_TO_COTIZAR_URUGUAY,
    send_to_pagar: process.env.NEXT_PUBLIC_GTAG_SEND_TO_PAGAR_URUGUAY,
    send_to_llamar: process.env.NEXT_PUBLIC_GTAG_SEND_TO_LLAMADA_URUGUAY,
    send_to_whatsapp: process.env.NEXT_PUBLIC_GTAG_SEND_TO_WHATSAPP_URUGUAY
  },
  {
    pais: 'colombia',
    tagID: process.env.NEXT_PUBLIC_GTAG_ID_COLOMBIA,
    send_to_cotizar: process.env.NEXT_PUBLIC_GTAG_SEND_TO_COTIZAR_COLOMBIA,
    send_to_pagar: process.env.NEXT_PUBLIC_GTAG_SEND_TO_PAGAR_COLOMBIA,
    send_to_llamar: process.env.NEXT_PUBLIC_GTAG_SEND_TO_LLAMADA_COLOMBIA,
    send_to_whatsapp: process.env.NEXT_PUBLIC_GTAG_SEND_TO_WHATSAPP_COLOMBIA
  },
  {
    pais: 'ecuador',
    tagID: process.env.NEXT_PUBLIC_GTAG_ID_ECUADOR,
    send_to_cotizar: process.env.NEXT_PUBLIC_GTAG_SEND_TO_COTIZAR_ECUADOR,
    send_to_pagar: process.env.NEXT_PUBLIC_GTAG_SEND_TO_PAGAR_ECUADOR,
    send_to_llamar: process.env.NEXT_PUBLIC_GTAG_SEND_TO_LLAMADA_ECUADOR,
    send_to_whatsapp: process.env.NEXT_PUBLIC_GTAG_SEND_TO_WHATSAPP_ECUADOR
  },
  {
    pais: 'bolivia',
    tagID: process.env.NEXT_PUBLIC_GTAG_ID_BOLIVIA,
    send_to_cotizar: process.env.NEXT_PUBLIC_GTAG_SEND_TO_COTIZAR_BOLIVIA,
    send_to_pagar: process.env.NEXT_PUBLIC_GTAG_SEND_TO_PAGAR_BOLIVIA,
    send_to_llamar: process.env.NEXT_PUBLIC_GTAG_SEND_TO_LLAMADA_BOLIVIA,
    send_to_whatsapp: process.env.NEXT_PUBLIC_GTAG_SEND_TO_WHATSAPP_BOLIVIA
  },
  {
    pais: 'panama',
    tagID: process.env.NEXT_PUBLIC_GTAG_ID_PANAMA,
    send_to_cotizar: process.env.NEXT_PUBLIC_GTAG_SEND_TO_COTIZAR_PANAMA,
    send_to_pagar: process.env.NEXT_PUBLIC_GTAG_SEND_TO_PAGAR_PANAMA,
    send_to_llamar: process.env.NEXT_PUBLIC_GTAG_SEND_TO_LLAMADA_PANAMA,
    send_to_whatsapp: process.env.NEXT_PUBLIC_GTAG_SEND_TO_WHATSAPP_PANAMA
  },
  {
    pais: 'paraguay',
    tagID: process.env.NEXT_PUBLIC_GTAG_ID_PARAGUAY,
    send_to_cotizar: process.env.NEXT_PUBLIC_GTAG_SEND_TO_COTIZAR_PARAGUAY,
    send_to_pagar: process.env.NEXT_PUBLIC_GTAG_SEND_TO_PAGAR_PARAGUAY,
    send_to_llamar: process.env.NEXT_PUBLIC_GTAG_SEND_TO_LLAMADA_PARAGUAY,
    send_to_whatsapp: process.env.NEXT_PUBLIC_GTAG_SEND_TO_WHATSAPP_PARAGUAY
  },
  
]

export const GA_TRACKING_ID =  GetTrackId(listTags).tagID


// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
  window.gtag('config',GA_TRACKING_ID, {
    page_path: url,
  })
}

// export const event = ({ action, category, label, value }) => {
  //   window.gtag('event', action, {
    //     event_category: category,
    //     event_label: label,
    //     value: value,
    //   })
    // }
    
// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (type,action,data) => {
  window.gtag(type, action, data)
}