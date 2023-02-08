import { useTranslation } from 'react-i18next';

export const FooterMulti = ({ config }) => {
  
  const [t, i18n] = useTranslation('global');
  const socialMedia = {
    facebook: 'https://www.facebook.com/EuropAssistanceLatam',
    instagram: 'https://www.instagram.com/europassistance_latam'
  }
  return (
    <footer role='contentinfo' className='bg-principal text-white px-6 relative'>
      <div className='max-w-screen-xl mx-auto relative px-6'>
        <div className='flex flex-col lg:flex-row items-center justify-between text-center lg:text-left gap-x-8 py-8'>
          <div className="hidden lg:block"><img src="/assets/images/europ-assitance-bco.svg" alt={t("menu.marca")} className='w-28' /></div>
          <div className="justify-self-end flex items-center gap-4 py-4 border-t border-b lg:border-none border-white">
            <img src="/assets/images/logo-ssl.png" alt="SSL" className='h-10 lg:h-12' />
            <img src="/assets/images/logo-visa-bco.png" alt="Visa" className='h-10 lg:h-12' />
            <img src="/assets/images/logo-master-bco.png" alt="Mastercard" className='h-10 lg:h-12' />
          </div>
        </div>
        <div className={`flex items-center justify-center lg:justify-end gap-4 pb-5 `}>
          {t("redes.seguinos")}
          <a target="_blank" href={socialMedia.facebook} rel="noopener noreferrer" aria-label='Facebook' className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-principal ">
            <span className="icon-facebook text-2xl" aria-hidden="true"></span>
          </a>
          <a target="_blank" href={socialMedia.instagram} rel="noopener noreferrer" aria-label='Instagram' className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-principal ">
            <span className="icon-instagram text-2xl" aria-hidden="true"></span>
          </a>
        </div>
      </div>
      <div className='max-w-screen-xl mx-auto flex flex-col gap-4 px-6 py-8 text-xs font-light text-justify border-t border-white'>
        <p>{config?.etiquetas.Label_Copyright}</p>
      </div>
    </footer>
  )
}
