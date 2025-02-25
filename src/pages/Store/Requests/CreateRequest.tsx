import { useEffect, useState } from "react";
import { getFromServer, postToServer } from "../../../globals/requests";
import {toast} from 'react-toastify';
import { useNavigate } from "react-router-dom";



const CreateRequest = () => {
    const navigate = useNavigate();
    const [subject, setSubject] = useState("");
    const [note, setNote] = useState("");
    const [approver, setApprover] = useState("");
    const [conversation, setConversation] = useState("");
    const [users, setUsers] = useState([])
    const [items, setItems] = useState({});

    const handleAddItem = () => {
        const newIndex = Object.keys(items).length;
        setItems({
            ...items,
            [newIndex]: { name: "", model: "", design: "", color: "" },
        });
    };
    const getUsers = async()=> {
        const response = await getFromServer("/accounts/get-all-user");
        if (response.status){setUsers(response.data.results)}
    }

    const handleItemChange = (index, field, value) => {
        setItems((prevItems) => ({
            ...prevItems,
            [index]: { ...prevItems[index], [field]: value },
        }));
    };

    const createRequest = async() => {
        const requestData = {subject,approver,items,note,conversation};
        const response = await postToServer("/store/store-requests/",requestData)
        if (response.status == 200 || response.status == 201){toast.success("New Request Added");navigate(`/store/requests/${response?.data?.id}`);}
        else{toast.error("Something Went Wrong")}
    }

    useEffect(()=>{getUsers();},[])
    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg dark:bg-boxdark dark:border-strokedark">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Create Product Request</h2>
            
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Enter Request Subject" className="w-full p-2 mt-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white"/>
            
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" className="w-full p-2 mt-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white"/>
            
            <select value={approver} onChange={(e) => setApprover(e.target.value)} className="w-full p-2 mt-4 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white">
                <option value="">Select Approver</option>
                {users?.map((user:any) => (<option key={user?.id} value={user?.id}>{user?.first_name} {user?.last_name} </option> ))}
            </select>
            
            <div className="mt-4 border-t border-gray-300 dark:border-strokedark pt-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Items</h3>
                <table className="w-full border-collapse border border-gray-300 dark:border-strokedark mt-2">
                    <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white">
                        <tr>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Model</th>
                            <th className="p-2 border">Design</th>
                            <th className="p-2 border">Color</th>
                        </tr>
                    </thead>
                    <tbody>
                    {Object.entries(items).map(([index, item]) => (
                        <tr key={index}>
                            <td className="p-2 border"><input type="text" value={item.name} onChange={(e) => handleItemChange(index, "name", e.target.value)} className="w-full p-1 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white" /></td>
                            <td className="p-2 border"><input type="text" value={item.model} onChange={(e) => handleItemChange(index, "model", e.target.value)} className="w-full p-1 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white" /></td>
                            <td className="p-2 border"><input type="text" value={item.design} onChange={(e) => handleItemChange(index, "design", e.target.value)} className="w-full p-1 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white" /></td>
                            <td className="p-2 border"><input type="text" value={item.color} onChange={(e) => handleItemChange(index, "color", e.target.value)} className="w-full p-1 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white" /></td>
                        </tr>
                    ))}

                    </tbody>
                </table>
                <button onClick={handleAddItem} className="mt-2 px-4 py-2 text-sm transition bg-primary text-white hover:bg-blue-700 rounded-lg"  >
                    + Add Item
                </button>
            </div>
 
            <textarea placeholder="Add conversation..." value={conversation} onChange={(e) => setConversation(e.target.value)} className="w-full p-2 mt-4 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white" > </textarea>
 
            <button onClick={createRequest} className="w-full mt-4 px-4 py-2 text-sm transition bg-primary text-white hover:bg-blue-700 rounded-lg cursor-pointer" >
                Submit Request
            </button>
        </div>
    );
};

export default CreateRequest;
