import {useState} from 'react'

export function useLocalStorage(key, initialValue){
    const [valueStored, setValueStored] = useState(()=>{
        try{
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        }
        catch(er){
            return initialValue
        }
    })

    const setValue = value => {
        try{
            setValueStored(value)
            localStorage.setItem(key, JSON.stringify(value))
        }
        catch(er){
            console.error(er)
        }
    }
    return [valueStored, setValue]
}