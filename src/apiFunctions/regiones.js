import axios from 'axios'

export async function  getRegion(user){
    let regiones = undefined
    try {
        let logData = await axios.get(process.env.NEXT_PUBLIC_URL_REGIONES+'?codigoUsuario='+user);
        const data = logData.data[0]
        regiones = data
      }
      catch (e) {
        console.log(e.response.data)

      }
     return regiones
}