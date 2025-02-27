import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFromServer, patchToServer } from "../../../globals/requests";
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";

interface RequestP {
    id: number,
    subject : string ,
    employee : string ,
    employee_id : number,
    approver : string,
    approver_id : number, 
    items: Record<string, any>; 
    conversation: Record<string, any>;
    note: string,
    status: string,
    created_on: string,
};

const EntryDetails = () => {
    const { id } = useParams(); 
    const [entry, setEntry] = useState<RequestP | null>(null);
    const [status, setStatus] = useState("");

    const getInitialList = async () => {
        const response = await getFromServer(`/store/daily-entry/${id}`)
        if (response?.status){setEntry(response?.data); setStatus(response?.data?.status)} 
        else{ toast.error("Something Went Wrong while fetching data")  }
    }
   
    useEffect(()=> {getInitialList();},[])

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg dark:bg-boxdark dark:border-strokedark">
            {/* Request Details */}
            <h2 className="mb-1 text-2xl font-bold text-gray-800 dark:text-white">{entry?.note}</h2>
            <p className="mb-1 text-gray-600 dark:text-gray-300">Location : {entry?.location}</p>
            <p className="mb-1 text-gray-600 dark:text-gray-300">Entry by: {entry?.employee}</p>
          
            <p className="text-gray-600 dark:text-gray-300">Created on: {entry?.created_on}</p>
            {/* Items Requested in Table Format */}
            <div className="mt-4 border-t border-gray-300 dark:border-strokedark pt-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Items Entry</h3>
                <table className="w-full border-collapse border border-gray-300 dark:border-strokedark mt-2">
                    <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white">
                        <tr>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Model</th>
                            <th className="p-2 border">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                    {Object.entries(entry?.items || {})?.map(([key, item]) => (   
                              <tr key={key} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                            <td className="p-2 border text-center">{item?.name}</td>
                            <td className="p-2 border text-center">{item?.model}</td>
                            <td className="p-2 border text-center">{item?.design}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default EntryDetails;
