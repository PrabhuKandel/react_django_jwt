import {createContext, useState, useEffect, Children} from 'react'
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const AuthContext =  createContext()

export default AuthContext;


export const AuthProvider = ({children}) =>
{
  
    const [authTokens, setAuthTokens] = useState( ()=>localStorage.getItem('authTokens')?JSON.parse(localStorage.getItem('authTokens')):null);
    const [user, setUser] = useState(()=>localStorage.getItem('authTokens')?jwtDecode(localStorage.getItem('authTokens')):null);
    let [loading,setLoading] = useState(true);

    let navigate = useNavigate();

    let loginUser = async (e)=>{
        e.preventDefault();
        
        let response = await fetch('http://127.0.0.1:8000/api/token/',{
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                'username':e.target.username.value,
                'password':e.target.password.value
            })
        }

        )
        let data =await response.json()
        if(response.status == 200)
        {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens' , JSON.stringify(data))
            // Redirecting to the home page after successful login
            navigate("/");
        }
        else
        {
         alert("Something went wrong")   
        }

    }
    let logoutUser = ()=>{
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate("/login");

    }
   
    // let updateToken = async ()=>{
   
    //     let response = await fetch('http://127.0.0.1:8000/api/token/refresh/',{
    //         method: 'POST',
    //         headers:{
    //             'Content-Type':'application/json'
    //         },
    //         body:JSON.stringify({
    //             'refresh': authTokens?.refresh
    //         })
    //     })
         
    //     let data = await response.json()

    //     if(response.status == 200)
    //     {
    //         setAuthTokens(data)
    //         setUser(jwtDecode(data.access))
    //         localStorage.setItem('authTokens' , JSON.stringify(data))
         
    //     }
    //     else
    //     {
    //         logoutUser()
    //     }

    //     if(loading)
    //     {
    //         setLoading(false)
    //     }

        
    // }

    let contextData = {
        user:user,
        authTokens:authTokens,
        setAuthTokens:setAuthTokens,
        setUser:setUser,
        loginUser:loginUser,
        logoutUser:logoutUser,   
    }

    useEffect(()=>{

        if(authTokens)
        {   
            setUser(jwtDecode(authTokens.access))

        }
        setLoading(false)


    },[authTokens,loading])


    return (
    <AuthContext.Provider value={contextData}>{loading?null:children}</AuthContext.Provider>
);

};