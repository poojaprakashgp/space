import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children}) => {
    const auth = useSelector(state => state.auth.user);
    if(!auth){
        return <Navigate to="/" />
    }
    return children
}

export default ProtectedRoutes