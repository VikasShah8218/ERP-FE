import React, { useState } from "react";
import { useEffect } from "react";
// import { postToServer } from "../../globals/requests";
import { getFromServer, postToServer } from "../../globals/requests";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select'


const CreateTask: React.FC<{ setPage: Function; refreshTaskList:Function}> = ({setPage , refreshTaskList}) => {
  type Landmark = { value: string };
  const [optiosUsers,setOptiosUsers] = useState([])
  const [selectedUsers,setSelectedUsers] = useState([])
  const [landmarkList,setLandmarkList] = useState([])
  const [landmarkData,setLandmarkData] = useState([])
  const [districtList,setDistrictList] = useState([])
  const [selectedLandMark,setSelectedLandMark] = useState<any[]>([])
  const [landMarkWithUser,setLandmarkWithUser] = useState<Record<string, Landmark[]>>({});
  const [errors, setErrors] = useState<any>({});
  const [formData, setFormData] = useState({name:"", landmarks:"", estimate_ex_date: null as Date | null,note: "", assigned_users:[],});

  const getUsers = async()=> {
    const resUsers = await getFromServer("/task_flow/get-users-with-landmarks/");
    if (resUsers.status){
        const temp:any = [];
        const LandMarkData:any = {};
        resUsers.data.forEach((element:any) => {
          temp.push({value:element.id,label:element.username})
          element.landmarks.forEach((userLandmark:any) => {
            if(!LandMarkData[userLandmark.id]){
              LandMarkData[userLandmark.id] =[]
            }
            LandMarkData[userLandmark.id].push({value:element.id,label:element.username})
          });
        });
        setOptiosUsers(temp)
        // setThisOptionUsers(temp)
        setLandmarkWithUser(LandMarkData)
    }
  }
  const getLandmark = async()=> {
      const resLandmark = await getFromServer("/structure/landmarks");
      if (resLandmark.status){
          const temp:any = [];
          resLandmark.data.results.forEach((element:any) => {
            temp.push({value:element.id,label:element.name})
          });
          setLandmarkData(resLandmark.data.results)
          setLandmarkList(temp)
      }
  }
  const getDistricts = async()=> {
      const resLandmark = await getFromServer("/structure/districts");
      if (resLandmark.status){
          const temp:any = [];
          resLandmark.data.results.forEach((element:any) => {
            temp.push({value:element.id,label:element.name})
          });
          setDistrictList(temp)
          console.log(temp)
      }
  }

  const handelSelectedUsers = (selected:any) =>{
     setSelectedUsers(selected);
  }
  const handelSelectedLandmark = (selected:any) =>{
      // console.log(selected) // [{…}, {…}]
      const tempUsers:any =[];
      const mySet = new Set();

      const tempL:any =[]
      selected.forEach((element:any) => {
        tempL.push(element.value)
        const users_01:any[] = landMarkWithUser[element.value]
        if (users_01){
          users_01.forEach((user:any) => {
            if(!mySet.has(user.value)){
              mySet.add(user.value)
              tempUsers.push(user)
            }
          });
        }
      });

      setFormData((prev) => {return { ...prev, landmarks: tempL };});
      setSelectedUsers(tempUsers)
      setSelectedLandMark(selected)

  }
 
  const handelSelectedDistrict = (selected: { value: number; label: string }) => {
    const filteredLandmarks = landmarkData
      .filter((landmark:any) => landmark.district === selected.value) // Filter landmarks by district ID
      .map((landmark:any) => ({ value: landmark.id, label: landmark.name })); // Transform to required format
    console.log(filteredLandmarks);
    handelSelectedLandmark(filteredLandmarks)
    // return filteredLandmarks;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, multiple } = e.target;
    setFormData((prev) => {
      if (type === "select-multiple" || multiple) {
        const selectedValues = Array.from((e.target as HTMLSelectElement).selectedOptions, (option) => Number(option.value));
        return { ...prev, [name]: selectedValues };
      } else if (type === "number") {
        return { ...prev, [name]: Number(value) };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };
  
  const validate = () => {
    const validationErrors: any = {};
    if (!formData.name.trim()) validationErrors.name = "Task name is required.";
    if (!formData.landmarks) validationErrors.landmarks = "Landmark is required.";
    if (!formData.note.trim()) validationErrors.note = "Note is required.";
    if (!selectedUsers.length)
      validationErrors.assigned_users = "At least one user must be assigned.";
    return validationErrors;
  };

  const handleTaskCreateSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      
      formData.assigned_users =[]
      selectedUsers.forEach((element:any) => {
        formData.assigned_users.push(element.value)
      });
      const resTaskCreate = await postToServer("/task_flow/tasks/",formData)
      if (resTaskCreate.status==200 || resTaskCreate.status==201){
        refreshTaskList()
        setPage("main")
        console.log(resTaskCreate.data)
      }
      else{
        console.log("Error Occured")
      }
    
      // console.log("Form Data Submitted:", formData);
      // alert(JSON.stringify(formData, null, 2)); 
    }
  };

  useEffect(()=>{
    getUsers();
    getLandmark();
    getDistricts();
  },[])

  return(
    <>
    <div className="flex flex-col gap-9">
      {/* <!-- Contact Form --> */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Create New Task 
          </h3>
        </div>
        <form  onSubmit={handleTaskCreateSubmit}>
          <div className="p-6.5">

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Task Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter Task Name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                {errors.name && <p className="text-meta-1">{errors.name}</p>}
              </div>
 
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  Landmark <span className="text-meta-1">*</span>
                </label>

                <div className="relative z-20 bg-transparent dark:bg-form-input">
                 
                  <Select options={landmarkList} isMulti value={selectedLandMark} onChange={handelSelectedLandmark}/>

                  {errors.landmarks && <p className="text-meta-1">{errors.landmarks}</p>}
                </div>
              </div>
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/1">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Estimate Work Complete 
                  </label>
                  <DatePicker
                      selected={formData.estimate_ex_date} 
                      onChange={(date: Date) => setFormData({ ...formData, estimate_ex_date: date })}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      placeholderText="Select date and time"
                      className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  {errors.estimate_ex_date && <p className="text-meta-1">{errors.estimate_ex_date}</p>}
              </div>
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block text-black dark:text-white">
                  District <span className="text-meta-1">*</span>
                </label>
                <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <Select options={districtList} onChange={handelSelectedDistrict}/>
                  {errors.landmarks && <p className="text-meta-1">{errors.landmarks}</p>}
                </div>
              </div>
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/1">
              <Select options={optiosUsers} value={selectedUsers} isMulti onChange={handelSelectedUsers}/>
              {errors.assigned_users && <p className="text-meta-1">{errors.assigned_users}</p>}
              </div>
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/1">
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Initial Instructions
                </label>
                <textarea
                  rows={5}
                  placeholder="Instructions"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>
              {errors.note && <p className="text-meta-1">{errors.note}</p>}

              </div>
            </div>

            <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
              Create Task 
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
)
};

export default CreateTask;
