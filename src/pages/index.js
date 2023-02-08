
import Cookie from 'js-cookie';
import { useTranslation } from 'react-i18next';

import PaisesItem from '../components/PaisesItem';

export default function Home() {
  const [t, i18n] = useTranslation('global');
  Cookie.set('location', 'ARGENTINA')
  return (
    <>
        <div className='text-principal w-max max-w-full mx-auto self-center sm:my-auto px-6 lg:px-0'>
          <span className='flex gap-2 mb-4'><span className="icon-avion" aria-hidden="true"></span><span className="icon-slash" aria-hidden="true"></span><span className="icon-corazon" aria-hidden="true"></span></span>
          <h1 className='text-6xl sm:text-7xl font-extrabold'>{t("preHome.hola")}<span className='block'>{t("preHome.selecciona")}</span></h1>
          <PaisesItem />
        </div>

    </>
  )
}