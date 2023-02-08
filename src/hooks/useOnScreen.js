import { useLayoutEffect, useState } from "react";

function useOnScreen(refInView, rootMargin = "0px") {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false);


  if  ( typeof  window  !==  "undefined" ) {
    useLayoutEffect(() => {
      const referr = refInView.current
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Update our state when observer callback fires
          setIntersecting(entry.isIntersecting);
        },
        {
          rootMargin,
        }
      );
      if (referr) {
        observer.observe(referr);
      }
      return () => {
        observer.unobserve(referr);
      };
      
    }, []); // Empty array ensures that effect is only run on mount and unmount
    return isIntersecting;
  
  }

}

export default useOnScreen;