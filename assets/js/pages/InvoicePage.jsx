import React, { useState, useEffect } from 'react';
import Field from '../components/forms/field';
import Select from '../components/forms/Select';
import { Link } from 'react-router-dom';
import CustomersAPI from '../services/customersAPI';
import axios from 'axios';
import InvoicesAPI from '../services/invoicesAPI';

const InvoicePage = ({history, match}) => {

    const{ id= "new"} = match.params;

    const[invoice, setInvoice] = useState({
        amount: "",
        customer:"",
        status:'SENT',
    });

    const[customers, setCustomers] = useState([]);
    const[editing, setEditing] = useState(false);

    const [errors, setErrors]= useState({
        amount: "",
        customer:"",
        status:'',
    })

    //Récupération des clients
    const fetchCustomers = async () =>{
        try{
           const data= await CustomersAPI.findAll();
           setCustomers(data);
           if(!invoice.customer) setInvoice({...invoice, customer: data[0].id});
        } catch (error){
              //TODO : Flash Notif erreurs
            history.replace('/invoices')
        }
    }


    //Récupération d'une facture
    const fetchInvoices = async id =>{
        try{
             const { amount, status, customer }= await InvoicesAPI.find(id);
                setInvoice({amount, status, customer: customer.id});

        }catch(error){
            console.log(error.response);
            //TODO : Flash Notif erreurs
            history.replace('/invoices')
        }
    }

    //Récupération de la liste des clients à chaque chargement du composant
    useEffect( ()=> {
        fetchCustomers();
    }, [])

    //Récupération de la bonne facture quand l'identifiant de l'url change
    useEffect( ()=> {
        if (id !== "new" ){
            setEditing(true);
            fetchInvoices(id);
        }
    }, [id])

    // Gestion des changements d'input
    const handleChange = ({currentTarget})=>{
        const {value, name} = currentTarget;
        setInvoice({... invoice,[name]:value});
    }

    //Gestion de la soumission
    const handleSubmit = async event =>{
        event.preventDefault();
        try{
            if(editing){
                 await InvoicesAPI.update(id, invoice);
                // TODO Flash notif success
            } else {
                await InvoicesAPI.create(invoice);
                // TODO Flash notif succes
                history.replace("/invoices");
            }
        }catch({response}) {
            const {violations} = response.data;

            if(violations){
                const apiErrors = {};
                    violations.forEach(({propertyPath, message}) =>{
                        apiErrors[propertyPath] = message
                    });
                    setErrors(apiErrors);
                    //TODO : Flash notifications d'erreurs
                }
            }
    };


    return ( <>
        {(editing && <h1>Modification d'une facture</h1>) || (<h1>Création d'une facture</h1>)}
        <form onSubmit={handleSubmit}>
            <Field name="amount" type="number" placeholder="Montant de la facture" onChange={handleChange} value={invoice.amount} error={errors.amount} onChange={handleChange} />

            
            <Select 
                name="customer" 
                label="Client" 
                value={invoice.customer} 
                error={errors.customer}
                onChange={handleChange}
            >
             {customers.map(customer =><option key={customer.id} value={customer.id}> {customer.firstName} {customer.lastName} </option>)}

            </Select>
            
            <Select name="status" label="Statut" value={invoice.status} error={errors.status} onChange={handleChange}>
                <option value="SENT">Envoyée</option>
                <option value="PAID">Payée</option>
                <option value="CANCELLED">Annulée</option>
            </Select>

            <div className="form-group">
                <button type="submit" className="btn btn-success">Enregistrer</button>
                <Link to="/invoices" className="btn btn-link">Retour aux factures</Link>
            </div>

            
        </form>

    </> );
}
 
export default InvoicePage;