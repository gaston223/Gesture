import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/field';
import usersAPI from '../services/usersAPI';
import { toast } from 'react-toastify';

const RegisterPage = ({history})=> {

    const [user, setUser]= useState({
        firstName: '',
        lastName: '',
        email : '',
        password: '',
        passwordConfirm: ''
    })

     const [errors, setErrors]= useState({
        firstName: '',
        lastName: '',
        email : '',
        password: '',
        passwordConfirm:''
    })

    // Gestion des changements d'input du formulaire
    const handleChange = ({currentTarget})=>{
        const {value, name} = currentTarget;
        setUser({... user,[name]:value});
    }

    //Gestion de la soumission
    const handleSubmit = async event =>{
        event.preventDefault();

        const apiErrors = {};
        if(user.password!== user.passwordConfirm){
            apiErrors.passwordConfirm="Votre confirmation de mot de passe n'est pas ideentique au mot de passe saisi";
            setErrors(apiErrors);
            toast.error("Des erreurs dans votre formulaire !");
            return; 
        }
        try{
            await usersAPI.register(user);
            //TODO : Flash success
            toast.success("Vous êtes désormais inscrits, vous pouvez vous connecter !");
            setErrors({});
            history.replace('/login');
            
        }catch(error){
            console.log(error.response);
            const {violations} = error.response.data

            if(violations){
                const apiErrors={};
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath]= violation.message
                });
                setErrors(apiErrors);
            }
            toast.error("Des erreurs dans votre formulaire !");
        }
    }

    return ( <>
    <h1 className="mb-5">Inscription</h1>

    <form onSubmit={handleSubmit}>
        <Field 
            name="firstName" 
            label="Prénom" 
            placeholder="Votre prénom" 
            error={errors.firstName} 
            value={user.firstName} 
            onChange={handleChange} 
        />

        <Field 
            name="lastName" 
            label="Nom de famille" 
            placeholder="Votre Nom" 
            error={errors.lastName} 
            value={user.lastName} 
            onChange={handleChange} 
        />

        <Field 
            name="email" 
            label="Adresse Email" 
            placeholder="Votre adresse email" 
            error={errors.email} 
            value={user.email} 
            onChange={handleChange} 
            type="email" 
        />
        <Field 
            name="password" 
            label="Mot de passe" 
            placeholder="Votre mot de passe" 
            error={errors.password} 
            value={user.password} 
            onChange={handleChange} 
            type="password"
        />
        <Field 
            name="passwordConfirm" 
            label="Confirmation du Mot de passe" 
            placeholder="Confirmez votre mot de passe" 
            error={errors.passwordConfirm} 
            value={user.passwordConfirm} 
            onChange={handleChange}
            type="password"
        />
        
        <div className="form-group">
            <button type="submit" className="btn btn-success"><i className="fas fa-user-plus"></i> Je m'inscris</button>
            <Link to="/login" className="btn btn-link">J'ai déja un compte</Link>
        </div>


    </form>

    </> );
}
 
export default RegisterPage;