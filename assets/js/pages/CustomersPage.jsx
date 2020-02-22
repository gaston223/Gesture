import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import CustomersApi from "../services/customersAPI";
import {Link} from "react-router-dom";
import { toast } from 'react-toastify';
import TableLoader from '../components/loaders/Tableloader';


const CustomersPage = (props) => {

    const[customers, setCustomers]=useState([]);
    const[currentPage, setCurrentPage]= useState(1);
    const[search, setSearch]= useState("");
    const[loading, setLoading]= useState(true);


    //Permet d'aller récuperer les customers
    const fetchCustomers = async() => {
        try{
            const data = await CustomersApi.findAll()
            setCustomers(data);
            setLoading(false);
        } catch(error){
            toast.error("Impossible de charger les clients");
        }
    }

    useEffect(()=> {
        fetchCustomers();
    },[]);


    //Gestion de la suppression d'un customer
    const handleDelete = async id => {
        
        const originalCustomers = [... customers];

        setCustomers(customers.filter(customer=>customer.id!==id));

        try{
            await CustomersApi.delete(id);
            toast.success("Le client a bien été supprimé !");
        }catch(error){
            setCustomers(originalCustomers);
            toast.error("La suppression du client n'a pas pu fonctionné")
        }

    }

    //Gestion du changement de page
    const handlePageChange = page => setCurrentPage(page);
    

    //Gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }

    const itemsPerPage =12;

    //Filtrage des customers en fonction de la recherche
    const filteredCustomers = customers.filter(c => 
        c.firstName.toLowerCase().includes(search.toLowerCase())||
        c.lastName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLocaleString().includes(search.toLowerCase()) ||
        (c.company && c.company.toLowerCase().includes(search.toLowerCase())))

    
   
    // d'ou on part (start) pendant combien (itemPerPage)

    const paginatedCustomers =Pagination.getData(filteredCustomers, currentPage, itemsPerPage);
    return (
        <>
            <div className=" mb-3 d-flex justify-content-between align-items-center">
                <h1>Liste des clients</h1>
                <Link to="/customers/new" className="btn btn-primary"> <i className="fas fa-user-plus"></i>&nbsp; Créer un client</Link>
                
            </div>

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher ..."/>
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th>Factures</th>
                        <th>Montant Total</th>
                        <th></th>
                    </tr>
                </thead>
                {!loading && <tbody>
                    {paginatedCustomers.map(customer =><tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td> <Link to={"/customers/"+customer.id}> {customer.firstName} {customer.lastName}</Link></td>
                        <td>{customer.email}</td>
                        <td>{customer.company}</td>
                        <td className="text-center"><span className="badge badge-primary">{customer.invoices.length}</span></td>
                        <td>{customer.totalAmount.toLocaleString()} €</td>
                        <td>
                            <button 
                                onClick={()=> handleDelete(customer.id)}
                                disabled={customer.invoices.length>0} 
                                className="btn btn-sm btn-danger"> <i className="fas fa-trash-alt"></i> Supprimer
                            </button>
                        </td>
                    </tr> )}
                    
                </tbody>
                }
            </table>
            {loading &&<TableLoader />}
            {itemsPerPage<filteredCustomers.length && (
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={filteredCustomers.length} onPageChanged={handlePageChange} />
            )}
           
        </>
    );
}
 
export default CustomersPage;