import { getFromServer } from "../../../globals/requests";
import { useEffect, useState } from "react";
import {toast} from 'react-toastify';
import EntryIMG from "../../../static/image/entry.png"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const DailyEntry = () => {
    const navigate = useNavigate();
    const [fetchedEntry, setFetchedEntry] = useState<any[]>([]);
    const [selectedDateStart, setSelectedDateStart] = useState<any>("");
    const [selectedDateEnd, setSelectedDateEnd] = useState<any>("");

    const [locationList, setLocationList]       = useState<any[]>([]);
    const [categoryList, setCategoryList]       = useState<any[]>([]);

    const getInitialList = async () => {
        const res0 = await getFromServer("/store/daily-entry")
        const res1 = await getFromServer( "/store/locations" )
        const res2 = await getFromServer("/store/categories" )
        if (res1.status && res2.status && res0.status){
            setFetchedEntry(res0.data.results);
            setLocationList(res1.data.results);
            setCategoryList(res2.data.results);
        } else{ toast.error("Something Went Wrong while fetching data")  }
    }

    const filterEntry = async() => {
        let query= "";
        if (selectedDateStart){ query += `&start_date=${selectedDateStart}`; }else { return toast.error("😒 PLease Select Start Date")}
        if (selectedDateEnd){ query += `&end_date=${selectedDateEnd}` }else { return toast.error("😒 PLease Select End Date")}
        query.substring(1);
        const response = await getFromServer(`/store/daily-entry?${query}`);
        if (response.status){setFetchedEntry(response.data.results);}
    }

    useEffect(()=> {getInitialList()},[])
    return( 
    <>
        <div className="w-full p-4 bg-white shadow-default dark:border-strokedark dark:bg-boxdark rounded-lg flex flex-col md:flex-row items-center gap-4">
            
            <input type="date" value={selectedDateStart} onChange={(e:any)=>{setSelectedDateStart(e.target.value)}} className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white"/>
            <input type="date" value={selectedDateEnd}   onChange={(e:any)=>{setSelectedDateEnd(e.target.value)}}   className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark dark:text-white"/>

            <button onClick={filterEntry} className="ml-0 lg:ml-2 lg:mt-0 rounded-lg px-4 py-2 text-sm transition bg-primary text-white hover:bg-blue-700 ">
                Search
            </button>

            <Link to={"/store/daily-entry/create"}>
                <button className="ml-0 lg:ml-2 lg:mt-0 rounded-lg px-4 py-2 text-sm transition bg-primary text-white hover:bg-blue-700 ">
                   +
                </button>
            </Link>

        </div>
        <div className="max-w-full overflow-x-auto mt-5">
            <table className="w-full table-auto">
            <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Image
                </th>
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Note
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Location
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Created By
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Created ON
                </th>
                </tr>
            </thead>
            <tbody>
                {fetchedEntry?.map((entry:any)=> (
                <tr  style={{cursor:"pointer"}} onClick={()=>{navigate(`/store/daily-entry/${entry.id}`)}} >
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <div className="h-15.5 w-15 rounded-md">
                            <img src={EntryIMG} alt="User"/>
                        </div>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white"> {entry?.note}</h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">{entry?.location}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">{entry?.employee}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">{entry?.created_on}</p>
                    </td>
                </tr>
                )) }
               
            </tbody>
            </table>
        </div>

    </>
    )
}
export default DailyEntry;