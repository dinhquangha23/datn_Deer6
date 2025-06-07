import React,{ useEffect, useState } from "react";
import {storecontext} from "./Context"

export const StoreProvider=({children})=>{
    const[numberCart, setNumberCart]=useState(0);
    
    return(
        <storecontext.Provider value={{numberCart,setNumberCart}}>
            {children}
        </storecontext.Provider>
    )
}