import { ReactNode, useEffect, useState } from "react";

export const ClientComponent = ({children} : {children : ReactNode}) => {
  const [isClient, setIsClient] = useState(false);
 
  useEffect(() => {
    setIsClient(true);
 
    return () => {
      setIsClient(false);
    }
  }, []);
 
  return isClient ? children : null;
}