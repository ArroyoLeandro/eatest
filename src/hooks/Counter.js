import {useState} from "react"


export const useCounter = () => {
    const [counter, setCounter] = useState(0)
    const incrementar = () => setCounter(counter + 1)
    const decrementar = () => counter > 0  ? setCounter(counter - 1):  setCounter(0)

    return {
        counter,
        setCounter,
        incrementar,
        decrementar
    }
}