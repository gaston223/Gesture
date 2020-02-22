import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/field';
import CustomersAPI from '../services/customersAPI';
import { toast } from 'react-toastify';
import ContentLoader from 'react-content-loader';

const CustomerPage =({match, history}) => {

    const { id = "new" } =match.params;

    const[customer, setCustomer]=useState({
        lastName:"",
        firstName: "",
        email: "",
        company: "",
    })

    const[errors, setErrors]= useState({
        lastName:"",
        firstName: "",
        email: "",
        company: "",
    })

    const[editing, setEditing] = useState(false);
  

    // Recuperation du customer en fonction de l'identifiant
    const fetchCustomer = async id =>{
    try {
        const{ firstName, lastName, email, company} = await CustomersAPI.find(id);
        setCustomer({ firstName, lastName, email, company});
    }catch(error){
        toast.error("Le client n'a pas pu être chargé ! ");
        history.replace("/customers");
    }
};
    useEffect(() => {
    if (id !== "new") {  
      setEditing(true);
      fetchCustomer(id);
    }
  }, [id]);

   
    const handleChange = ({currentTarget})=>{
        const {value, name} = currentTarget;
        setCustomer({... customer,[name]:value});
    };

     // Gestion de la soumission du formulaire
    const handleSubmit =async event=>{
        event.preventDefault();
        try {   
            setErrors({});         
            if(editing){
                await CustomersAPI.update(id, customer);
                toast.success("Le client a bien été modifié");                
            }else{
             await CustomersAPI.create(customer);
             toast.success("Le client a bien été crée");
             history.replace("/customers");
        }
        } catch({response}) {
            const {violations} = response.data;

            if(violations){
                const apiErrors = {};
                    violations.forEach(({propertyPath, message}) =>{
                        apiErrors[propertyPath] = message
                    });
                    setErrors(apiErrors);
                    toast.error("Des erreurs dans votre formulaire")
                }
            }
        };

    return ( <>
        {(!editing && <h1>Création d'un client</h1>) || (<h1>Modification d'un client</h1>) }

        <form onSubmit={handleSubmit}>
            <Field name="lastName" label="Nom de famille" placeholder="Nom de famille du client" value={customer.lastName} onChange={handleChange} error={errors.lastName} />
            <Field name="firstName" label="Prénom" placeholder="Prénom du client" value={customer.firstName} onChange={handleChange} error={errors.firstName}  />
            <Field name="email" label="Email" placeholder="Email du client" type="email"value={customer.email} onChange={handleChange} error={errors.email}  />
            <Field name="company" label="Entreprise" placeholder="Entreprise du client" value={customer.company} onChange={handleChange} error={errors.company}  />

            <div className="form-group">
                <button className="btn btn-success">Enregistrer</button>
                <Link to="/customers" className="btn btn-link">Retour à la liste</Link>
            </div>
        </form>
    </> );
}
 
export default CustomerPage;