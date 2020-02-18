import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import invoicesAPI from '../services/invoicesAPI';

const STATUS_CLASSES ={
    PAID: "success",
    SENT: "primary",
    CANCELLED:"danger"
}

const STATUS_LABELS ={
    PAID:"PAYÉE",
    SENT:"ENVOYÉE",
    CANCELLED:"ANNULÉE"
}

const itemsPerPage =12;

const InvoicesPage = props => {

    const[invoices, setInvoices]= useState([]);
    const[currentPage, setCurrentPage]= useState(1);
    const[search, setSearch]= useState("");

    // Récupération des invoices auprès de l'API
    const fetchInvoices = async()=> {
        try{
            const data= await invoicesAPI.findAll();
            setInvoices(data);

        }catch(error){
            console.log(error.response);
        }
        
    }


    // Charger les invoices au chargement du composant
    useEffect(()=>{
        fetchInvoices();
    }, []);

     //Gestion du changement de page
    const handlePageChange = page => setCurrentPage(page);
    

    //Gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }

    //Gestion de la suppression
    const handleDelete = async id =>{
        const originalInvoices = [... invoices];
        setInvoices(invoices.filter(invoice => invoice.id!== id));

        try{
        //
        await invoicesAPI.delete(id);
        } catch(error){
        console.log(error.response);
        setInvoices(originalInvoices);
        }

    }

  

    //Gestion de la recherche :
    const filteredInvoices = invoices.filter(i => 
        i.customer.lastName.toLowerCase().includes(search.toLowerCase())|| 
        i.customer.firstName.toLowerCase().includes(search.toLowerCase())||
        i.amount.toString().startsWith(search.toLowerCase()) ||
        STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
        );


    // Gestion du format date
    const formatDate = (str)=> moment(str).format('DD/MM/YYYY');

    //Pagination des données
     const paginatedInvoices =Pagination.getData(filteredInvoices, currentPage, itemsPerPage);

    return (  
        <>
        <h1>Liste des Factures</h1>

        <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher ..."/>
            </div>

        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Numéro de facture</th>
                    <th>Client</th>
                    <th className="text-center">Montant</th>
                    <th className="text-center">Statut</th>
                    <th className="text-center">Date d'envoi</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {paginatedInvoices.map(invoice=>
                    <tr key={invoice.id}>
                        <td> {invoice.chrono} </td>
                        <td><a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a></td>
                        <td className="text-center">{invoice.amount.toLocaleString()}</td>
                        <td className="text-center">
                            <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>
                                {STATUS_LABELS[invoice.status]}
                            </span>
                        </td>
                        <td className="text-center">{formatDate(invoice.sentAt)}</td>
                        <td>
                            <button className="btn btn-sm btn-warning mr-1">Editer</button>
                            <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(invoice.id)}>Supprimer</button>
                        </td>
                    </tr>
                    )}
                
            </tbody>
        </table>

        <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChanged={handlePageChange} length={filteredInvoices.length} />

        </>
    );
}
 
export default InvoicesPage;