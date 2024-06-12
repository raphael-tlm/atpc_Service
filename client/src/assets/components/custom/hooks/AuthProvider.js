import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => { 

    const [name, setName] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [email, setEmail] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') ||'');
    const [id, setId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();
    const loginAction = async (data) => {
        try{
            const response = await fetch('http://localhost:6958/TryLogin?mail='+data.mail+'&password='+data.password);
            const res = await response.json();
            if(res.data){
                setName(res.data.name);
                setFirstName(res.data.firstName);
                setEmail(res.data.mail);
                setToken(res.data.token);
                localStorage.setItem('token', res.data.token);
                setId(res.data.id);
                setIsAdmin(res.data.isAdmin);
                navigate('/');
                return;
            }
            throw new Error(res.err);
            }
        catch(e){
            console.error(e);
            alert(e.message);
        }
    }

    const registerAction = async (data) => {
        try{
            const response = await fetch('http://localhost:6958/TryRegister?name='+data.name+'&firstName='+data.firstName+'&mail='+data.mail+'&password='+data.password);
            const res = await response.json();
            if(res.data){
                setName(res.data.name);
                setFirstName(res.data.firstName);
                setEmail(res.data.email);
                setToken(res.data.token);
                localStorage.setItem('token', res.data.token);
                setId(res.data.id);
                setIsAdmin(res.data.isAdmin);
                navigate('/');
                return;
            }
            throw new Error(res.err);
            }
        catch(e){
            console.error(e);
        }
    }

    const verifToken = async (token, email) => {
        try{
            const response = await fetch('http://localhost:6958/verifToken?token='+token+'&mail='+email);
            const res = await response.json();
            if(res.data){
                return true;
            }
            return false;
            }
        catch(e){
            console.error(e);
        }
    }

    useEffect(() => {
        const getInfo = async () => {
            try{
                const response = await fetch('http://localhost:6958/TryGetInfo?token='+localStorage.getItem('token'));
                const res = await response.json();
                if(res.data){
                    setName(res.data.name);
                    setFirstName(res.data.firstName);
                    setEmail(res.data.email);
                    setId(res.data.id);
                    setIsAdmin(res.data.isAdmin);
                    return;
                }
                throw new Error(res.err);
                }
            catch(e){
                console.error(e);
            }
        }

        if(localStorage.getItem('token')){
            getInfo();
        }
    }, [])

    const logoutAction = () => {
        setName(null);
        setFirstName(null);
        setEmail(null);
        setToken('');
        localStorage.removeItem('token');
        setId(null);
        setIsAdmin(false);
        navigate('/connexion');
    }

    return (
        <AuthContext.Provider value={{name, firstName, email, token, id, isAdmin, loginAction, registerAction, verifToken, logoutAction}}>
            {children}
        </AuthContext.Provider>
    );
}


export const useAuth = () => {
    return useContext(AuthContext);
};

