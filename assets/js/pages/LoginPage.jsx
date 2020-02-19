import React, { useState, useContext } from 'react';
import authAPI from '../services/authAPI';
import AuthContext from '../contexts/AuthContext';

const LoginPage =({history}) => {

    const { setIsAuthenticated} = useContext(AuthContext)
    console.log(history);
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
         history.replace("/customers");

        } catch(error){
            setError("Aucun compte ne possède cette adresse ou les informations ne correspondent pas")
        }

        console.log(credentials);
    }

    return ( 
        <>
        <h1>Connexion</h1>
  
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="username">Adresse Email</label>
                <input 
                    onChange={handleChange}
                    value={credentials.username} 
                    type="text" 
                    placeholder="Saisissez votre Email... " 
                    name="username" 
                    id="username" 
                    className={"form-control" +(error && " is-invalid")}
                />
                {error && <p className="invalid-feedback "> {error} </p>}
            </div>
            <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input 
                    onChange={handleChange}
                    value={credentials.password} 
                    type="password" 
                    placeholder="Saisissez votre mot de passe..." 
                    name="password" 
                    id="password" 
                    className="form-control"
                    />
            </div>
            <div className="form-group"><button type="submit" className="btn btn-success">Connexion</button></div>
        </form>
        </>

     );
}
 
export default LoginPage;