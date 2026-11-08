import { createContext , useContext, useState} from "react";
import toast from 'react-hot-toast';
import api from "../config/api";

const AppContext =createContext()

const getErrMsg =(err,fallback) => err.response?.data?.error || fallback;

export const AppProvider = ({children})=>{


    const [user, setUser] = useState(null);

    const authAction = async (requestFn, successMsg, errorFallback) => {
        try {
                const data = await requestFn();
                setUser(data.user)
                if(successMsg) toast.success(successMsg)
                return true;
                
        }catch(error){
                toast.error(getErrMsg(error,errorFallback))
                return false
        }
    }

    const login = (email, password)=>{
        return authAction(()=> api.post("/api/auth/login",{email,password}), "Login successful", "Failed to login")
    }

      const register = (name,email, password)=>{
        return authAction(()=> api.post("/api/auth/regester",{name,email,password}), "Account Created successful", "Failed to register")
    }

    const logout = async ()=>{
        try{
            await api.post("/api/auth/logout")
            setUser(null)
            toast.success("Logout successful")

        }catch(error){
            toast.error("Failed to logout")
        }
    }

    const value = {user,setUser,login,register,logout}
    return <AppContext.Provider value={value}>  
        {children}
    </AppContext.Provider>
}

export const useApp = () => useContext(AppContext);
