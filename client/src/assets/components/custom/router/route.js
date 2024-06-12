import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider.js";

const PrivateRoute = () => {
    const auth = useAuth();
    if(auth.token === ''){
        return <Navigate to="/connexion" />;
    } 
    else{
        return <Outlet />;
    }
  };

export default PrivateRoute;