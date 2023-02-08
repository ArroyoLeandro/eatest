export const paises = [
    {nombre: 'Argentina',flag:'/assets/images/banderas/flag-argentina.png',codigo:'ARGENTINA'},
    {nombre: 'Uruguay',flag:'/assets/images/banderas/flag-uruguay.png',codigo:'URUGUAY'},
    {nombre: 'Colombia',flag:'/assets/images/banderas/flag-colombia.png',codigo:'COLOMBIA'},
    {nombre: 'Ecuador',flag:'/assets/images/banderas/flag-ecuador.png',codigo:'ECUADOR'},
    {nombre: 'Bolivia',flag:'/assets/images/banderas/flag-ecuador.png',codigo:'BOLIVIA'},
    {nombre: 'Panama',flag:'/assets/images/banderas/flag-ecuador.png',codigo:'PANAMA'},
    {nombre: 'Paraguay',flag:'/assets/images/banderas/flag-ecuador.png',codigo:'PARAGUAY'},
  ]

  export const isCountry =  ( codigoUser )=>{
    let state = false
    if (typeof window !== 'undefined') {
      paises.map(item=>{
          if(item.codigo.toLowerCase() == codigoUser.toLowerCase()){ 
            state = true
          }
        })
    }
    return state
  }


  export const GetTrackId = ( listTags ) => {
    let codigoUser = 'Argentina'
    if (typeof window !== 'undefined') {
      if(window.location.href.split('/')[3] != ''){
        codigoUser = window.location.href.split('/')[3]
      }
      localStorage.removeItem('location')
      let trackTag = listTags.filter(item => item.pais.toLowerCase() == codigoUser.toLowerCase())
      if(trackTag.length > 0) {
        return trackTag[0]
      }
    }
    return  ''
  }

 
