import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFromServer, patchToServer } from "../../../globals/requests";
import {toast} from 'react-toastify';



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

const RequestViewPage = () => {
    const { id } = useParams(); // Get request ID from URL
    const [conversation, setConversation] = useState("");
    const [pRequest, setPRequest] = useState<RequestP | null>(null);
    const [status, setStatus] = useState("");
    const getInitialList = async () => {
        const response = await getFromServer(`/store/store-requests/${id}`)
        if (response.status){setPRequest(response.data); setStatus(response.data.status)} 
        else{ toast.error("Something Went Wrong while fetching data")  }
    }
   
    const handleSendMessage = async() => {
        if (conversation.trim() === "") return ( toast.error("Please write message") );
        const response = await patchToServer(`/store/store-requests/${id}/add-conversation/`, {"conversation":conversation})
        if (response.status == 200 || response.status == 201){getInitialList();toast.success("Conversation Added")}
        else{toast.error("Something went wrong")};
        console.log("Sending message:", conversation);
        setConversation("");
    };

    const ChangeStatus = async() => {
        if (status.trim() === "" ) return( toast.error("Please Select Status"));
        const response = await patchToServer(`/store/store-requests/${id}/change-status/`, {"status":status})
        if (response.status == 200 || response.status == 201){getInitialList();toast.success("Status Updated")}
        else{toast.error("Something went wrong")};
    }

    useEffect(()=> {getInitialList();},[])

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg dark:bg-boxdark dark:border-strokedark">
            {/* Request Details */}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{pRequest?.subject}</h2>
            <p className="text-gray-600 dark:text-gray-300">Requested by: {pRequest?.employee}</p>
            <p className="text-gray-600 dark:text-gray-300">Approver: {pRequest?.approver}</p>
            <p className="text-gray-600 dark:text-gray-300">Status: {pRequest?.status}</p>
            <p className="text-gray-600 dark:text-gray-300">Created on: {pRequest?.created_on}</p>
            {/* Items Requested in Table Format */}
            <div className="mt-4 border-t border-gray-300 dark:border-strokedark pt-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Items Requested</h3>
                <table className="w-full border-collapse border border-gray-300 dark:border-strokedark mt-2">
                    <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white">
                        <tr>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Model</th>
                            <th className="p-2 border">Quantity</th>
                            <th className="p-2 border">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                    {Object.entries(pRequest?.items || {})?.map(([key, item]) => (   
                              <tr key={key} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                            <td className="p-2 border text-center">{item?.name}</td>
                            <td className="p-2 border text-center">{item?.model}</td>
                            <td className="p-2 border text-center">{item?.design}</td>
                            <td className="p-2 border text-center">{item?.color}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Conversation Box */}
            <div className="mt-6 border-t border-gray-300 dark:border-strokedark pt-4">
                {/* <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Conversation</h3> */}
                <div className="h-40 overflow-y-auto bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                    {Object.entries(pRequest?.conversation || {})?.map(([key, msg]) => (
                        <div key={key} className="mb-2">
                            <p className="text-sm text-gray-900 dark:text-white font-bold">{msg?.user}</p>
                            <p className="text-gray-700 dark:text-gray-300">{msg?.message}</p>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{msg?.timestamp}</span>
                        </div>
                    ))}
                </div>

                {/* Message Input */}

                <div className="mt-4 flex items-center">
                    <div className="mr-4">
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Select Status</option>
                            <option value="1">Approved</option>
                            <option value="2">Not Approved</option>
                            <option value="3">Not Valid</option>
                        </select>
                    </div>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={conversation}
                        onChange={(e) => setConversation(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white"
                    />
                    <button  onClick={handleSendMessage} className="ml-2 rounded-lg px-4 py-2 text-sm transition bg-primary text-white hover:bg-blue-700">
                        ⚆_⚆
                    </button>
                    <button  onClick={ChangeStatus} className="ml-2 rounded-lg px-4 py-2 text-sm transition bg-primary text-white hover:bg-blue-700">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RequestViewPage;
