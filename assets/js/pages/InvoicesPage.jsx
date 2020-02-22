import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import invoicesAPI from '../services/invoicesAPI';
import {Link} from "react-router-dom";
import { toast } from 'react-toastify';
import TableLoader from '../components/loaders/Tableloader';

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
    const[loading, setLoading]= useState(true);

    // Récupération des invoices auprès de l'API
    const fetchInvoices = async()=> {
        try{
            const data = await invoicesAPI.findAll();
            setInvoices(data);
            setLoading(false);

        }catch(error){
            toast.error("Erreur los du chargement des factures !")
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
        toast.success("La facture a bien été supprimée ")
        } catch(error){
        toast.error("Une erreur est survenue");
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
        <div className=" mb-3 d-flex justify-content-between align-items-center">
                <h1>Liste des factures</h1>
                <Link to="/invoices/new" className="btn btn-primary"> <i className="fas fa-user-plus"></i>&nbsp; Créer une facture</Link>
                
            </div>

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
            {!loading && <tbody>
                {paginatedInvoices.map(invoice=>
                    <tr key={invoice.id}>
                        <td> {invoice.chrono} </td>
                        <td> <Link to={"/customers/"+invoice.customer.id}> {invoice.customer.firstName} {invoice.customer.lastName}</Link></td>
                        <td className="text-center">{invoice.amount.toLocaleString()}</td>
                        <td className="text-center">
                            <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>
                                {STATUS_LABELS[invoice.status]}
                            </span>
                        </td>
                        <td className="text-center">{formatDate(invoice.sentAt)}</td>
                        <td>
                            <Link to={"/invoices/" + invoice.id} className="btn btn-sm btn-warning mr-1"> <i className="far fa-edit"></i> Editer</Link>
                            <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(invoice.id)}><i className="fas fa-trash-alt"></i> Supprimer</button>
                        </td>
                    </tr>
                    )}
                
            </tbody>}
            {loading &&<TableLoader />}
        </table>

        <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChanged={handlePageChange} length={filteredInvoices.length} />

        </>
    );
}
 
export default InvoicesPage;