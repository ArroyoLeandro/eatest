import {GetTrackId} from './trackId'


export const listTags = [
  {
    pais: 'argentina',
    gtagID: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID_ARGENTINA,
  },
  {
    pais: 'uruguay',
    gtagID: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID_URUGUAY,
  },
  {
    pais: 'colombia',
    gtagID: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID_COLOMBIA,
  },
  {
    pais: 'ecuador',
    gtagID: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID_ECUADOR,
  },
  {
    pais: 'bolivia',
    gtagID: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID_BOLIVIA,
  },
  {
    pais: 'panama',
    gtagID: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID_PANAMA,
  },
  {
    pais: 'paraguay',
    gtagID: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID_PARAGUAY,
  },
  
]


// process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID

export const GTM_ID = GetTrackId(listTags).gtagID 

export const pageview = (url) => {
  window.dataLayer.push({
    event: 'pageview',
    page: url,
  })
}


//listado en planes

export const view_item_list = (items) => {
  window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push({
    event: "view_item_list",
    ecommerce: {
      currency: 'USD',
      value: items[0].price,
      items: items
    }
  });

}


//agregar al carrito
export const add_to_cart = (items) => {
  window.dataLayer.push({ ecommerce: null })
  
  window.dataLayer.push({
    event: "add_to_cart",
    ecommerce: {
      currency: 'USD',
      value: items[0].price,
      items: items
    }
  });

}

//en proceso de compra
export const begin_checkout = (items) => {
  window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push({
    event: "begin_checkout",
    ecommerce: {
      currency: 'USD',
      value: items[0].price,
      items: items
    }
  });

}


//compra exitosa
export const purchase = (items) => {
  window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push({
    event: "purchase",
    ecommerce: {
      currency: 'USD',
      name:  items[0].name,
      value: items[0].value,
      items: items[0].items
    }
  });
}

export const event = (type,action,data) => {
  window.gtag(type, action, data)
}