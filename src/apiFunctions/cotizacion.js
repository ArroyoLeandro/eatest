import axios from 'axios'
import Cookie from 'js-cookie'

export async function  getCotizacion(){
    let cotizacion = null
    try {
            let COD = Cookie.get('cotizacionID')
            let datos = await axios.get(process.env.NEXT_PUBLIC_URL_COTIZACION+'?cotizacionId='+COD);
            cotizacion = datos.data[0]
        }
    catch (e) {
        console.log(e.response.data)
    }
    return cotizacion
}