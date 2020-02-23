import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { LOGIN_API } from '../config';


/**
 * Requête HTTP d'authentification et stockage du token et sur Axios
 * @param {object} credentials 
 */ 
function authenticate(credentials){
   return axios
        .post(LOGIN_API, credentials)
        .then(response => response.data.token)
        .then(token => {
            // Je stocke le token dans mon LocalStorage
            window.localStorage.setItem("authToken", token);
            //On previent Axios qu'on a maintenant un header par defaut sur toutes nos futures requetes HTTP
            setAxiosToken(token);
        });
                    
}

/**
 * Deconnexion ( suppression du token du localStorage)
 */
function logout(){
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

/**
 * Positionne le token sur Axios
 * @param {string} token le token JWT
 */
function setAxiosToken(token){
    axios.defaults.headers["Authorization"]="Bearer " + token; 
}


/**
 * Mise en place lors du chargement de l'app
 */
function setup(){
    //1. Voir si on a un token ?
    const token = window.localStorage.getItem("authToken");

    //2. Si le token est encore valide
    if(token){
        const {exp: expiration}= jwtDecode(token)
        //console.log(expiration);
        if(expiration *1000 > new Date().getTime()){
            setAxiosToken(token);
        }
    }

}

/**
 * Permet de savoir si on est authentifié ou pas
 * @return boolean
 */
function isAuthenticated(){
     const token = window.localStorage.getItem("authToken");

    //2. Si le token est encore valide
    if(token){
        const {exp: expiration}= jwtDecode(token)
        if(expiration *1000 > new Date().getTime()){
           return true;
        }
        return false;
    }
    return false;
}
export default {
    authenticate, logout, setup, isAuthenticated
}