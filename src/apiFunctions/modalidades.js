import axios from 'axios'

export async function  getModalidades(user){
    let multiples = undefined
    try {
        let logData = await axios.get(process.env.NEXT_PUBLIC_URL_MULTIPLES+'?codigoUsuario='+user);
        const data = logData.data[0]
        multiples = data
    }
    catch (e) {
        console.log(e.response.data)

    }
    return multiples
}