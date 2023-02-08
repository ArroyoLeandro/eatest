import React, { useState, useImperativeHandle, forwardRef, useCallback, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

export function Modal({ children, initialValue=false }, ref) {

    const [isOpenModal, setIsOpenModal] = useState(initialValue)
    const closeModal = useCallback(() => setIsOpenModal(false), [])
    const handleModalContainerClick = (e) => e.stopPropagation() //para que el click en la ventana no cierre el modal
    //console.log('ref2'+openButtonRef)

    useImperativeHandle(ref, () => ({
        openModal: () => setIsOpenModal(true),
        closeModal
    }),[closeModal])

    ///agrego el esc para cerrar el modal
    const handleEscape = useCallback(event => {
        if(event.keyCode === 27) closeModal()
    }, [closeModal])

    useEffect(() => {
        if (isOpenModal) {
            document.addEventListener('keydown', handleEscape, false);
            document.body.classList.add('overflow-hidden', 'pr-4'); //saco el scroll del body
        }
        return () => {
            document.removeEventListener('keydown', handleEscape, false);
            document.body.classList.remove('overflow-hidden', 'pr-4'); //vuelvo el scroll del body
        }
      }, [handleEscape, isOpenModal]);


      
    ///trampa para capturar el foco en el modal
    const inputRef = useRef()
    const inputRef2 = useRef()
    const handleTab = useCallback(event => {
        if(event.keyCode === 9 && event.target === inputRef.current) {inputRef2.current.focus();}
    }, [])

    useEffect(() => {
        if (isOpenModal) {document.addEventListener('keyup', handleTab, false)}
        return () => {
            document.removeEventListener('keyup', handleTab, false)
        }
    }, [handleTab, isOpenModal]);


    return isOpenModal ? ReactDOM.createPortal(
        <React.Fragment>
            <div role="dialog" aria-modal="true" className="fixed flex items-center justify-center w-full h-full p-6 bg-black top-0 left-0 bg-opacity-20 z-50" onClick={closeModal}>
                <div aria-label="Ventana Modal" className="relative flex max-h-full" onClick={handleModalContainerClick}>
                    <input ref={inputRef} autoFocus readOnly aria-label="Ventana modal - use Escape para salir" className="bg-transparent absolute w-1 h-1 transparent border-none outline-none focus:outline-none" />
                    {children}
                    <button ref={inputRef2} aria-label="Cerrar ventana" onClick={closeModal} className="absolute top-0 right-0 m-2 z-20 flex items-center justify-center w-7 h-7 bg-white rounded-full ">
                        <span className="icon-mas text-2xl text-turquesa rotate-45 leading-3"></span>
                    </button>
                </div>
            </div>
        </React.Fragment>, document.body
    ) : null;
}

export default forwardRef (Modal);