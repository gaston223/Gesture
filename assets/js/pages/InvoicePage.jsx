import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Field from '../components/forms/field';
import Select from '../components/forms/Select';
import CustomersAPI from '../services/customersAPI';
import InvoicesAPI from '../services/invoicesAPI';
import FormContentLoader from '../components/loaders/FormContentLoader';
import ContentLoader from 'react-content-loader';

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
    });
    const[loading, setLoading]= useState(true);

    //Récupération des clients
    const fetchCustomers = async () =>{
        try{
           const data= await CustomersAPI.findAll();
           setCustomers(data);
           setLoading(false);
           if(!invoice.customer) setInvoice({...invoice, customer: data[0].id});
        } catch (error){
            toast.error("Impossible de charger les clients !")
            history.replace('/invoices')
        }
    }


    //Récupération d'une facture
    const fetchInvoices = async id =>{
        try{
             const { amount, status, customer }= await InvoicesAPI.find(id);
                setInvoice({amount, status, customer: customer.id});
                setLoading(false);

        }catch(error){
            toast.error("Impossible de charger la facture demandée");
            history.replace('/invoices')
        }
    }

    //Récupération de la liste des clients à chaque chargement du composant
    useEffect( ()=> {
        fetchCustomers();
    }, []);

    //Récupération de la bonne facture quand l'identifiant de l'url change
    useEffect( ()=> {
        if (id !== "new" ){
            setEditing(true);
            fetchInvoices(id);
        }
    }, [id]);

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
                toast.success("La facture a bien été modifiée");
            } else {
                await InvoicesAPI.create(invoice);
                toast.success("La facture a bien été créee");
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
                    toast.error("Des erreurs dans votre formulaire");
                }
            }
    };


    return ( <>

        
        {(editing && <h1>Modification d'une facture</h1>) || (<h1>Création d'une facture</h1>)}

        {loading && <ContentLoader />}

        {!loading && <form onSubmit={handleSubmit}>
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

            
        </form>}

    </> );
}
 
export default InvoicePage;