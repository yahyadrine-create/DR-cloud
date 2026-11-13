import { createContext , useContext, useEffect, useState,useCallback } from "react";
import toast from 'react-hot-toast';
import api from "../config/api";

const AppContext =createContext()

const ROOT_BREADCRUMB = [{id:null ,name:"My Drive"}]
const getErrMsg =(err,fallback) => err.response?.data?.error || fallback;

export const AppProvider = ({children})=>{


    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    //Upload Global State
    const [isUploading, setIsUploading] = useState(true);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Drive View State
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [breadcrumbs,setBreadcrumbs]=useState(ROOT_BREADCRUMB);
    const [folders,setFolders]=useState([]);
    const [files,setFiles]=useState([]);
    const [isDriveLoading,setIsDriveLoading]=useState(false);

    //Filter & Sort State
    const [searchQuery, setSearchQuery]=useState("")
    const [sortBy,setSortBy]=useState("name_asc")

    //Refresh User Profile & Storage State
    const refreshUser = useCallback(async() => {
        try{
            const {data} = await api.get("/api/auth/me");
            setUser(data.user)
            return data.user;


        }catch(error){
            setUser(null)
            return null
        }
    },[])

    // Check if user is authenticated on app load
    useEffect(()=>{
        refreshUser().finally(()=> setIsLoading(false))
    },[refreshUser])

    //Check if user is authenticated
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

    const fetchDriveContent = useCallback(()=>{
        async(folderId=currentFolderId ,search = searchQuery, sort= sortBy)=>{
            if(!user) return;
            setIsDriveLoading(true)
            try{
                const parentParam = folderId || "null";
                const[folderRes,fileres, detailres] = await Promise.all([
                    api.get("/api/folders",{params:{parent_id:parentParam}}),
                    api.get("/api/files",{params:{folder_id:parentParam, search,sort}}),
                    folderId ? api.get(`/api/folders/${folderId}`) :null,
                    
                ])

                setFolders(folderRes.data.folders);
                setFiles(fileres.data.files);
                setBreadcrumbs(detailres?.data?.breadcrumbs || ROOT_BREADCRUMB)
                
            }catch(error){
                toast.error("Failed to fetch drive content")
            }finally{
                setIsDriveLoading(false)
            }


        }
    },[user,currentFolderId,searchQuery,sortBy])

    const value = {user,setUser,login,register,logout,isLoading,isAuthenticated:!!user,
        isUploading,setIsUploading,uploadProgress,setUploadProgress,refreshUser,currentFolderId,
        setCurrentFolderId,breadcrumbs,folders,setFolders,files,setFiles,isDriveLoading,fetchDriveContent,
        searchQuery,setSearchQuery,sortBy,setSortBy
    }
    return <AppContext.Provider value={value}>  
        {children}
    </AppContext.Provider>
}

export const useApp = () => useContext(AppContext);
