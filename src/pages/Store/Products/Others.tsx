import { useEffect, useState } from "react";
import { getFromServer, postToServer } from "../../../globals/requests";
import {toast} from 'react-toastify';



const Others = () => {
    const [isCategoryModel, setisCategoryModel] = useState(false);
    const [islocationListModel, setIslocationListModel] = useState(false);
    const [isGrouptModel, setIsGroupModel] = useState(false);

    const [expanded, setExpanded] = useState<number | null>(null);

    const [categoryForm, setcategoryForm] = useState("")
    const [locationForm, setLocationForm] = useState("")
    const [groupForm, setGroupForm] = useState("")

    const [locationList, setLocationList] = useState<any[]>([]);
    const [categoryList, setCategoryList] = useState<any[]>([]);

    const [pGroup, setPGroup] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    

    const getInitialList = async () => {
        const res1 = await getFromServer("/store/locations")
        const res2 = await getFromServer("/store/categories")
        const res3 = await getFromServer("/store/product-group")
        if (res1.status && res2.status && res3){
            setLocationList(res1.data.results);
            setCategoryList(res2.data.results);
            setPGroup(res3.data.results);
        } else{ toast.error("Something Went Wrong while fetching data")  }
    }

    const submitCategory = async() => {
        if ( !categoryForm.trim() ){ toast.error("Please Fill Form");  return 0;}
        const response = await postToServer("/store/categories/",{name:categoryForm})
        if (response.status == 201 || response.status == 200){ toast.success("Category Created")}
        setcategoryForm("")
        getInitialList()
        setisCategoryModel(false)
    }

    const submitLocation = async() => {
        if ( !locationForm.trim() ){ toast.error("Please Fill Form for Location");  return 0;}
        const response = await postToServer("/store/locations/",{name:locationForm})
        if (response.status == 201 || response.status == 200){ toast.success("Location Created")}
        setLocationForm("")
        getInitialList()
        setIslocationListModel(false)
    }

    const submitGroup = async() => {
        if ( !groupForm.trim() ){ toast.error("Please Fill Form for Group");  return 0;}
        const response = await postToServer("/store/product-group/",{name:groupForm})
        if (response.status == 201 || response.status == 200){ toast.success("Group Created")}
        setGroupForm("")
        getInitialList()
        setIsGroupModel(false)
    }

    useEffect(()=> {getInitialList();},[])
  

return (
    <>
    <div className="w-full mt-10">
        <div className="w-full ">
            <div  onClick={() => setIsOpen(!isOpen)} className={`flex justify-between bg-gray-200 dark:bg-gray-800 text-left p-4 text-lg font-medium border-none outline-none transition-all duration-300 ${isOpen ? "bg-gray-300 dark:bg-gray-700" : ""}`}>
                <p>Location</p>
                <button onClick={()=>{setIslocationListModel(true)}} className="ml-0 lg:ml-2 lg:mt-0 rounded-lg px-4 py-2 text-sm transition bg-primary text-white hover:bg-blue-700 ">+</button>
            </div>
        </div>
        <div className={`overflow-hidden transition-all duration-300 ${ isOpen ? "max-h-screen p-4 bg-gray-100 dark:bg-opacity-0" : "max-h-0 p-0" }`}>
            <div className="mt-2 overflow-hidden transition-all duration-300 bg-white dark:bg-boxdark rounded-md shadow-md">
                <table className="w-full border-collapse border border-gray-300 dark:border-strokedark">
                <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white">
                    <tr>
                    <th className="p-2 border border-gray-300 dark:border-strokedark">ID</th>
                    <th className="p-2 border border-gray-300 dark:border-strokedark">Name</th>
                    <th className="p-2 border border-gray-300 dark:border-strokedark">Action</th>
                    </tr>
                </thead>
                <tbody>
                {locationList?.map((location:any)=>(
                <tr key={location.id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="p-2 border border-gray-300 dark:border-strokedark text-center">{location.id}</td>
                    <td className="p-2 border border-gray-300 dark:border-strokedark">{location.name}</td>
                    <td className="p-2 border border-gray-300 dark:border-strokedark">
                        <div className="flex justify-center">
                            <div className="mr-10 cursor-pointer" > 🖊️ </div>
                            <div className="mr-10 cursor-pointer" > ❌ </div>
                        </div>
                    </td>
                </tr>
                ))}
                </tbody>
                </table>
            </div> 
        </div>
    </div>

    <div className="w-full mt-10">
        <div className="w-full ">
            <div  onClick={() => setIsOpen(!isOpen)} className={`flex justify-between bg-gray-200 dark:bg-gray-800 text-left p-4 text-lg font-medium border-none outline-none transition-all duration-300 ${isOpen ? "bg-gray-300 dark:bg-gray-700" : ""}`}>
                <p>Category</p>
                <button onClick={()=>{setisCategoryModel(true)}} className="ml-0 lg:ml-2 lg:mt-0 rounded-lg px-4 py-2 text-sm transition bg-primary text-white hover:bg-blue-700 ">+</button>
            </div>
        </div>
        <div className={`overflow-hidden transition-all duration-300 ${ isOpen ? "max-h-screen p-4 bg-gray-100 dark:bg-opacity-0" : "max-h-0 p-0" }`}>
            <div className="mt-2 overflow-hidden transition-all duration-300 bg-white dark:bg-boxdark rounded-md shadow-md">
                <table className="w-full border-collapse border border-gray-300 dark:border-strokedark">
                <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white">
                    <tr>
                    <th className="p-2 border border-gray-300 dark:border-strokedark">ID</th>
                    <th className="p-2 border border-gray-300 dark:border-strokedark">Name</th>
                    <th className="p-2 border border-gray-300 dark:border-strokedark">Action</th>
                    </tr>
                </thead>
                <tbody>
                {categoryList?.map((category:any)=>(
                <tr key={category.id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="p-2 border border-gray-300 dark:border-strokedark text-center">{category.id}</td>
                    <td className="p-2 border border-gray-300 dark:border-strokedark">{category.name}</td>
                    <td className="p-2 border border-gray-300 dark:border-strokedark">
                        <div className="flex justify-center">
                            <div className="mr-10 cursor-pointer" > 🖊️ </div>
                            <div className="mr-10 cursor-pointer" > ❌ </div>
                        </div>
                    </td>
                </tr>
                ))}
                </tbody>
                </table>
            </div> 
        </div>
    </div>

    <div className="w-full mt-10">
        <div className="w-full ">
            <div  onClick={() => setIsOpen(!isOpen)} className={`flex justify-between bg-gray-200 dark:bg-gray-800 text-left p-4 text-lg font-medium border-none outline-none transition-all duration-300 ${isOpen ? "bg-gray-300 dark:bg-gray-700" : ""}`}>
                <p>Group</p>
                <button onClick={()=>{setIsGroupModel(true)}} className="ml-0 lg:ml-2 lg:mt-0 rounded-lg px-4 py-2 text-sm transition bg-primary text-white hover:bg-blue-700 ">+</button>
            </div>
        </div>
        <div className={`overflow-hidden transition-all duration-300 ${ isOpen ? "max-h-screen p-4 bg-gray-100 dark:bg-opacity-0" : "max-h-0 p-0" }`}>
            <div className="mt-2 overflow-hidden transition-all duration-300 bg-white dark:bg-boxdark rounded-md shadow-md">
                <table className="w-full border-collapse border border-gray-300 dark:border-strokedark">
                <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white">
                    <tr>
                    <th className="p-2 border border-gray-300 dark:border-strokedark">ID</th>
                    <th className="p-2 border border-gray-300 dark:border-strokedark">Name</th>
                    <th className="p-2 border border-gray-300 dark:border-strokedark">Action</th>
                    </tr>
                </thead>
                <tbody>
                {pGroup?.map((groyp:any)=>(
                <tr key={groyp.id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <td className="p-2 border border-gray-300 dark:border-strokedark text-center">{groyp.id}</td>
                    <td className="p-2 border border-gray-300 dark:border-strokedark">{groyp.name}</td>
                    <td className="p-2 border border-gray-300 dark:border-strokedark">
                        <div className="flex justify-center">
                            <div className="mr-10 cursor-pointer" > 🖊️ </div>
                            <div className="mr-10 cursor-pointer" > ❌ </div>
                        </div>
                    </td>
                </tr>
                ))}
                </tbody>
                </table>
            </div> 
        </div>
    </div>

    {(isCategoryModel )&& (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" style={{backdropFilter:"blur(2px)"}}>
        <div className="bg-black rounded-lg shadow-lg w-11/12 max-w-md mx-auto p-5">
            <h3 className="text-lg font-semibold text-white-800 mb-4 text-center">Create Category</h3>
            <div className="mb-5 text-center text-red-500 text-sm">
                <div className="flex w-full  items-center lg:flex-row flex-col z-2">
                   <input  type="text"
                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                     setcategoryForm(e.target.value);
                   }}
                   value={categoryForm}
                   name="category"
                   placeholder="Enter Name"
                   className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"/>
                </div>
            </div>
            
            <div className="flex justify-between">
                <button  onClick={()=>{setisCategoryModel(false)}} className="w-[48%] px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400">
                    Cancel
                </button>
                <button onClick={submitCategory} className="w-[48%] px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Create
                </button>
            </div>
        </div>
    </div>
    )}

    {(islocationListModel )&& (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" style={{backdropFilter:"blur(2px)"}}>
        <div className="bg-black rounded-lg shadow-lg w-11/12 max-w-md mx-auto p-5">
            <h3 className="text-lg font-semibold text-white-800 mb-4 text-center">Add Location</h3>
            <div className="mb-5 text-center text-red-500 text-sm">
                <div className="flex w-full  items-center lg:flex-row flex-col z-2">
                   <input  type="text"
                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setLocationForm(e.target.value);
                   }}
                   value={locationForm}
                   name="category"
                   placeholder="Enter Location"
                   className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"/>
                </div>
            </div>
            
            <div className="flex justify-between">
                <button  onClick={()=>{setIslocationListModel(false)}} className="w-[48%] px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400">
                    Cancel
                </button>
                <button onClick={submitLocation} className="w-[48%] px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Create
                </button>
            </div>
        </div>
    </div>
    )}

    {(isGrouptModel )&& (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" style={{backdropFilter:"blur(2px)"}}>
        <div className="bg-black rounded-lg shadow-lg w-11/12 max-w-md mx-auto p-5">
            <h3 className="text-lg font-semibold text-white-800 mb-4 text-center">Add Product Group</h3>
            <div className="mb-5 text-center text-red-500 text-sm">
                <div className="flex w-full  items-center lg:flex-row flex-col z-2">
                   <input  type="text"
                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setGroupForm(e.target.value);
                   }}
                   value={groupForm}
                   name="category"
                   placeholder="Enter Group Name"
                   className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"/>
                </div>
            </div>
            
            <div className="flex justify-between">
                <button  onClick={()=>{setIsGroupModel(false)}} className="w-[48%] px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400">
                    Cancel
                </button>
                <button onClick={submitGroup} className="w-[48%] px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Create
                </button>
            </div>
        </div>
    </div>
    )}
  </>

);
};

export default Others;
