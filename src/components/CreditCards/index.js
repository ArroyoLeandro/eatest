
export default function CreditCards ({pais,config}) {
  return (
    <>
      {(pais?.toLowerCase() == 'argentina') && 
      <section className='w-full max-w-screen-xl mx-auto flex items-center justify-between lg:justify-center lg:gap-20 py-6 md:py-10 px-6 2xl:px-0'>
          <article className='flex flex-col items-center justify-center text-center leading-4'>
              <img src="/assets/images/logo-visa.png" alt="Visa" className='max-h-10 md:max-h-12 lg:max-h-20 mb-3' />
              <p className='text-xs md:text-sm lg:text-md font-light w-20 md:w-24'>{config?.etiquetas.Label_Hasta3Cuotas}</p>
          </article>
          <article className='flex flex-col items-center justify-center text-center leading-4'>
              <img src="/assets/images/logo-master.png" alt="Mastercard" className='max-h-10 md:max-h-12 lg:max-h-20 mb-3' />
              <p className='text-xs md:text-sm lg:text-md font-light w-20 md:w-24'>{config?.etiquetas.Label_Hasta3Cuotas}</p>
          </article>
          <article className='flex flex-col items-center justify-center text-center leading-4'>
              <img src="/assets/images/logo-american.png" alt="American Express" className='max-h-10 md:max-h-12 lg:max-h-20 mb-3' />
              <p className='text-xs md:text-sm lg:text-md font-light w-20 md:w-24'>{config?.etiquetas.Label_Hasta1Cuotas}</p>
          </article>
      </section>
      }
    </>
  )
}
