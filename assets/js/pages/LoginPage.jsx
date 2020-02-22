import React, { useState, useContext } from 'react';
import authAPI from '../services/authAPI';
import AuthContext from '../contexts/AuthContext';
import Field from '../components/forms/field';
import { toast } from 'react-toastify';

const LoginPage =({history}) => {

    const { setIsAuthenticated} = useContext(AuthContext)
    //console.log(history);
    const[credentials, setCredentials] = useState({
        username:"",
        password: ""
    });

    // Gestion des champs
    const[error, setError]= useState("");

    const handleChange = ({currentTarget})=>{
        const {value, name} = currentTarget;
        setCredentials({... credentials,[name]:value});
    }

    //Gestion du submit
    const handleSubmit = async event => {
        event.preventDefault();
        try {
         await authAPI.authenticate(credentials);
         setError("");
         setIsAuthenticated(true);
         toast.success("Vous êtes désormais connecté 🦄😎")
         history.replace("/customers");

        } catch(error){
            setError("Aucun compte ne possède cette adresse ou les informations ne correspondent pas");
            toast.error("Une erreur est survenue");
        }

        //console.log(credentials);
    }

    return ( 
        <>
        <h1>Connexion</h1>
  
        <form onSubmit={handleSubmit}>
            <Field label="Adresse Email" name="username" 
            value={credentials.username} 
            onChange={handleChange} placeholder="Adresse Email" error={error} />

            <Field name="password" label="Mot de passe" value={credentials.value} onChange={handleChange} type="password" />
            <div className="form-group"><button type="submit" className="btn btn-success">Je me connecte <i className="fas fa-arrow-circle-right"></i></button></div>
        </form>
        </>

     );
}
 
export default LoginPage;