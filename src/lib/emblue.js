import {GetTrackId} from './trackId'

export const listTags = [
  {
    pais: 'argentina',
    urlEmblue: process.env.NEXT_PUBLIC_URL_EMBLUE_ARGENTINA
  },
  {
    pais: 'uruguay',
    urlEmblue: process.env.NEXT_PUBLIC_URL_EMBLUE_URUGUAY
  },
  {
    pais: 'colombia',
    urlEmblue: process.env.NEXT_PUBLIC_URL_EMBLUE_COLOMBIA
  },
  {
    pais: 'ecuador',
    urlEmblue: process.env.NEXT_PUBLIC_URL_EMBLUE_ECUADOR
  },
  {
    pais: 'bolivia',
    urlEmblue: process.env.NEXT_PUBLIC_URL_EMBLUE_BOLIVIA
  },
  {
    pais: 'panama',
    urlEmblue: process.env.NEXT_PUBLIC_URL_EMBLUE_PANAMA
  },
  {
    pais: 'paraguay',
    urlEmblue: process.env.NEXT_PUBLIC_URL_EMBLUE_PARAGUAY
  },
  
]

export const EMBLUE_URL =  GetTrackId(listTags).urlEmblue

