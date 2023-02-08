
export default function FaqItem(props) {

   function PreguntasList(){
        return props.preguntasFaq.map(pregunta => (
            <details key={pregunta.cod} className='relative group rounded-lg border-2 border-principal text-principal open:bg-principal open:text-white hover:bg-principal hover:text-white focus-within:bg-principal focus-within:text-white focus-within:border-black transition-all'>
                <summary className='py-6 px-8 text-2xl font-bold cursor-pointer focus:outline-none border-transparent group group-open:focus:border-white group-open:active:border-transparent'>
                    {pregunta.title}
                    <span className='icon-chevron text-sm absolute top-6 right-5 p-1 transition-all ease-linear group-open:rotate-180 aspect-square rounded-full border border-inherit'></span>
                </summary>
                <div className='pb-6 px-8 text-sm font-light' dangerouslySetInnerHTML={{__html: pregunta.detail}}></div>
            </details>
        ))
    }
    
    
    return (
        <> 
        <div className='max-w-screen-md mx-auto flex flex-col gap-6 lg:gap-8 px-6 2xl:px-0 py-14'>
            {PreguntasList()}
        </div>
        </>
    )
}