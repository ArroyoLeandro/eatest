import {GetTrackId} from './trackId'

export const listTags = [
    {
      pais: 'argentina',
      PIXEL_ID: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID_ARGENTINA,
    },
    {
      pais: 'uruguay',
      PIXEL_ID: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID_URUGUAY,
    },
    {
      pais: 'colombia',
      PIXEL_ID: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID_COLOMBIA,
    },
    {
      pais: 'ecuador',
      PIXEL_ID: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID_ECUADOR,
    },
    {
      pais: 'bolivia',
      PIXEL_ID: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID_BOLIVIA,
    },
    {
      pais: 'panama',
      PIXEL_ID: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID_PANAMA,
    },
    {
      pais: 'paraguay',
      PIXEL_ID: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID_PANAMA,
    }
  ]

export const FB_PIXEL_ID = GetTrackId(listTags).PIXEL_ID 



