import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { getFromServer , postToServer} from "../../globals/requests";
import { useDispatch } from "react-redux";
import { logout } from "../../app/slices/authSlice";

import Select from 'react-select'

const AssignUser: React.FC <{ setPage: Function, mainUsers:any}> = ({setPage, mainUsers})=>{
    const [optiosUsers,setOptiosUsers] = useState([])
    const [landmarkList,setLandmarkList] = useState([])
    const [userLinkedlandmarkList,setUserLinkedLandmarkList] = useState([])
    const [errors, setErrors] = useState<any>({});
    const dispatch = useDispatch(); 

    const [formData, setFormData] = useState({
        user_id: "", // Task name
        landmarks: [], // Array of assigned user IDs
    });
    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: '#1E293B', // Dark background
            borderColor: state.isFocused ? '#0EA5E9' : '#334155', // Highlighted border on focus
            color: '#FFFFFF', // Text color
            boxShadow: state.isFocused ? '0 0 0 2px rgba(14, 165, 233, 0.5)' : undefined,
            '&:hover': {
                borderColor: '#0EA5E9', // Hover border color
            },
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: '#FFFFFF', // Text color for selected option
        }),
        menu: (provided: any) => ({
            ...provided,
            backgroundColor: '#1E293B', // Menu background color
            border: '1px solid #334155',
            zIndex: 10, // Ensure it appears above other elements
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#0EA5E9' : '#1E293B', // Highlighted option
            color: '#FFFFFF',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: '#0EA5E9',
            },
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: '#94A3B8', // Placeholder color
        }),
        input: (provided: any) => ({
            ...provided,
            color: '#FFFFFF', // Ensure text color in the input field is white
        }),
    };
    const validate = () => {
        const validationErrors: any = {};
        if (!formData.user_id) validationErrors.user_id = "User is required.";
        if (!formData.landmarks.length)
        validationErrors.landmarks = "At least one Landmark must be assigned.";
        return validationErrors;
    };

    const setUsers = async()=> {
        const temp:any = [];
        // console.log(mainUsers)
        mainUsers.forEach((element:any) => {
            temp.push({value:element.id,label:element.username})
        });
        setOptiosUsers(temp)
    }

    const handelSelectedLandmark = (selected:any) =>{
        const temp:any =[]
        selected.forEach((element:any) => {
          temp.push(element.value)
        });
        setFormData((prev) => {
            return { ...prev, landmarks: temp };
        });
    }
    
    const getLandmark = async()=> {
        const resLandmark = await getFromServer("/structure/landmarks");
        if (resLandmark.status){
            const temp:any = [];
            resLandmark.data.results.forEach((element:any) => {
                temp.push({value:element.id,label:element.name})
            });
            setLandmarkList(temp)
        }else if(resLandmark.status===401){
            dispatch(logout())
        }
    }
    const getLinkedUser = async()=> {
        const resLinkedUserLandmark = await getFromServer("/task_flow/get-users-with-landmarks/");
        if (resLinkedUserLandmark.status){
            setUserLinkedLandmarkList(resLinkedUserLandmark.data)
            // console.log(resLinkedUserLandmark.data)
        }else if(resLinkedUserLandmark.status===401){
            dispatch(logout())
        }
    }

    const handleChange = (selected:any) => {
        // console.log(selected)
        setFormData((prev) => {
            return { ...prev, user_id: selected.value };
        });
    };

  const handleLinkUser = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      
      const resTaskCreate = await postToServer("/task_flow/users-with-landmarks/",formData)
      if (resTaskCreate.status==200 || resTaskCreate.status==201){
        // setPage("main")
        getLinkedUser();
        console.log(resTaskCreate.data)
      }else if(resTaskCreate.status===401){
        dispatch(logout())
      }
      else{
        console.log("Error Occured")
      }
    //   console.log("Form Data Submitted:", formData);
    //   alert(JSON.stringify(formData, null, 2)); // For demonstration purposes
    }
  };


    useEffect(()=>{
        setUsers();
        getLandmark();
        getLinkedUser();
    },[])


    return(
        <>
        <div onClick={()=>{setPage("main")}} > <FontAwesomeIcon icon="fa-solid fa-angle-left" /> </div> 

        <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                        Link User
                    </h3>
                </div>
                <form onSubmit={handleLinkUser} >
                    <div className="p-6.5">
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/2">
                                    <label className="mb-2.5 block text-black dark:text-white">
                                    User <span className="text-meta-1">*</span>
                                    </label>

                                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                                        <Select  options={optiosUsers}  styles={customStyles} onChange={handleChange} />
                                        {errors.user_id && <p className="text-meta-1">{errors.user_id}</p>}
                                    </div>
                            </div>
                            <div className="w-full xl:w-1/1">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Landmarks <span className="text-meta-1">*</span>
                                </label>
                                <Select options={landmarkList}  styles={customStyles}  isMulti onChange={handelSelectedLandmark} />
                                {errors.landmarks && <p className="text-meta-1">{errors.landmarks}</p>}
                            </div>
                        </div>
                        <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                        Create Task 
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div className="p-5 bg-gray-800 rounded-lg shadow-md text-white">
        <h2 className="text-xl font-bold mb-5">Users and Associated Landmarks</h2>
        {userLinkedlandmarkList.map((user: any) => (
            <div key={user.id} className="mb-6 border-b border-gray-700 pb-4">
            {/* User Information */}
            <div className="flex items-center mb-3">
                <div className="text-lg font-semibold mr-2">{user.first_name} {user.last_name}</div>
                <span className="text-sm text-gray-400">{user.email}</span>
            </div>
            
            {/* Landmark Information */}
            <div className="ml-5">
                {user.landmarks.length > 0 ? (
                <ul className="list-disc list-inside">
                    {user.landmarks.map((landmark: any) => (
                    <li key={landmark.id} className="text-gray-300">{landmark.name}</li>
                    ))}
                </ul>
                ) : (
                <div className="text-gray-500">No landmarks associated</div>
                )}
            </div>
            </div>
        ))}
        </div>



        </>
    )
}
export default AssignUser