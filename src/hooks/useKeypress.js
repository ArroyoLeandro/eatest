import { useEffect } from 'react';

export  default  function  useKeypress ( key ,  action ) {
    
    useEffect(() => {
        function onKeyup(e) {
          if (e.key === key) {e.preventDefault(); action();}
        }
        window.addEventListener('keyup', onKeyup);
        return () => window.removeEventListener('keyup', onKeyup);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
}