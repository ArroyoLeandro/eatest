
export default function Contador(props) {
    return (
        <div className='flex gap-2 justify-center mt-3'>
            <button aria-label='Restar viajeros' disabled={props.handleCounter.counter == 0 }
            onClick={() => {
                if(props.handleCounter.counter > 0){
                    props.handleCounter.decrementar()
                }
               }} className='w-8 h-8 text-2xl pt-1 leading-none bg-principal-claro text-white rounded-full hover:bg-principal focus:bg-principal focus:outline-none'>-</button>
            <span aria-live='polite' className='w-8 lg:w-20 h-8 text-2xl bg-gris-claro text-principal rounded-full text-center'>{props.handleCounter.counter}</span>
            <button aria-label='Agregar viajeros' onClick={() => {props.handleCounter.incrementar();}} className='w-8 h-8 text-2xl pt-1 leading-none bg-principal-claro text-white rounded-full hover:bg-principal focus:bg-principal focus:outline-none'>+</button>
        </div>
      );
  }