export const HeaderMulti = ({ config }) => {
  return (
    <div className='w-full'>
      <div className="hidden md:flex flex-col xl:flex-row items-center xl:items-stretch justify-center">
        <address className='border-t sm:border-t-0 border-principal bg-white sm:bg-transparent py-3 sm:py-0 px-6 not-italic text-principal flex flex-col sm:flex-row items-center sm:items-end justify-center sm:justify-end sm:gap-2'>
          <span className='text-sm uppercase order-3 sm:order-1 whitespace-nowrap'>Atención telefónica</span>
          <a href="tel:08002223553" className='lg:text-2xl font-extrabold order-2 whitespace-nowrap'> 0800 222 3553 </a>
          <span className='text-sm uppercase order-4 whitespace-nowrap'>{config?.etiquetas.Label_HorarioTelefono}</span>
        </address>
      </div>
    </div>
  )
}
