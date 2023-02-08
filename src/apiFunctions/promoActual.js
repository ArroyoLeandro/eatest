import axios from 'axios'

export async function  getPromoActual(user){
    let promo = undefined
    try {
        // const response = await fetch(process.env.NEXT_PUBLIC_URL_PROMOACTUAL+'?codigoUsuario='+user,headerGet);
        // let datos= await response.json();
        //   const data = datos
        let logData = await axios.get(process.env.NEXT_PUBLIC_URL_PROMOACTUAL+'?codigoUsuario='+user);
        const data = logData.data[0]
        promo = data
        }
        catch (e) {
        console.log(e.response.data)
        }
    return promo
}


export async function  getPromoActualMulti(user){
    let promo = undefined
    try {
            let logData = await axios.get(process.env.NEXT_PUBLIC_URL_PROMO_ACTUAL_MULTI+'?codigoUsuario='+user);
            const data = logData.data[0]
            promo = data
        }
        catch (e) {
            console.log(e.response.data)

        }
    return promo
}