import jwt_decode from 'jwt-decode';
import { UserType } from '../types/types';


function getUserFromToken(): UserType | null {
    const token = localStorage.getItem('token');
    
    // Check if token exists
    if (!token || token == "") {
        return null;
    }
    // Check if token is expired
    const decoded: any = jwt_decode(token);
    if (Date.now() >= decoded.exp * 1000) {
        return null;
    }
    // return data if token is valid
    return decoded;
}

export { getUserFromToken };