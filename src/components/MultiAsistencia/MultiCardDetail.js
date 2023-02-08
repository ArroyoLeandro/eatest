import { formatNum } from "../../helpers/index"

export default function MultiCardDetail(props) {
    return (
        <>
            <article className="w-full max-w-screen-md max-h-full flex flex-col text-principal bg-white rounded-lg shadow-xl overflow-hidden">
                <header className="relative w-full flex gap-8 md:gap-12 p-6 md:p-10 bg-turquesa ">
                    <span className="hidden md:block" aria-hidden="true">
                        <img src="/assets/images/europ-assitance.svg" alt="Europ Asistance" className='w-full' />
                    </span>
                    <div className="flex flex-col gap-2 md:gap-4">
                        <h2 className="text-3xl md:text-5xl font-bold leading-7 md:leading-10">{props.producto?.producto.nombreB2C}</h2>
                        <p className='md:text-xl'><span className='whitespace-wrap'>{props.producto?.producto.descripcion}</span></p>
                    </div>
                </header>
                <div className="flex-1 bg-white p-6 md:p-10 flex flex-col md:flex-row gap-6 max-h-full overflow-auto">
                    <div className="flex-1">
                        <h3 className="font-bold pb-2 mb-4 border-b border-gris-medio">Prestaciones</h3>
                        <ul className='text-sm mt-2 pb-6 leading-4'>
                            {
                                props.producto?.producto.prestaciones.map((val, index) => {
                                    return (
                                        <li key={index} className='flex gap-2 pb-2'>
                                            <span className="flex-none icon-done text-[8px] w-4 h-4 -mt-1 flex justify-center items-center rounded-full bg-whatsapp text-white" aria-hidden="true">
                                            </span>
                                            {val.labelNombre} {val.tipo.toLowerCase() == 'por monto' ? ('($' + formatNum(val.montoMenores) + ')') : ''}
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>

            </article>
        </>
    )
}