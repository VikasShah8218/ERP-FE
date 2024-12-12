import React, { useState } from "react";
import { useEffect } from "react";
// import { postToServer } from "../../globals/requests";
import MultiSelect from "./MultiSelect";
import { getFromServer, postToServer } from "../../globals/requests";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select'

// setSelectedUsers([1,5]) i have to put real time data [1,5] is static hard core data 


const CreateTask: React.FC<{ setPage: Function; refreshTaskList:Function}> = ({setPage , refreshTaskList}) => {
  const [optiosUsers,setOptiosUsers] = useState([])
  const [selectedUsers,setSelectedUsers] = useState([])
  const [landmarkList,setLandmarkList] = useState([])

  const handelSelectedUsers = (selected:any) =>{
      console.log(selected)
      const temp:any =[]
      selected.forEach((element:any) => {
        temp.push(element.value)
      });
      // console.log(temp)
      setSelectedUsers(temp)
  }
  const handelSelectedLandmark = (selected:any) =>{
      console.log(selected)
      setFormData((prev) => {
          return { ...prev, landmark: selected.value };
      });
      // console.log(temp)
  }

  const getUsers = async()=> {
      const resUsers = await getFromServer("/accounts/get-all-user");
      if (resUsers.status){
          // console.log(resUsers.data.results)
          const temp:any = [];
          resUsers.data.results.forEach((element:any) => {
            temp.push({value:element.id,label:element.username})
          });
          setOptiosUsers(temp)
          console.log(temp)
          // props.setMainUsers(users)
      }
    }
  const getLandmark = async()=> {
      const resLandmark = await getFromServer("/structure/landmarks");
      if (resLandmark.status){
          // console.log(resLandmark.data.results)
          // const temp:any = [];
          // resLandmark.data.results.forEach((element:any) => {
          //   temp.push({value:element.id,text:element.username})
          // });
          const temp:any = [];
          resLandmark.data.results.forEach((element:any) => {
            temp.push({value:element.id,label:element.name})
          });
          setLandmarkList(temp)
          // props.setMainUsers(users)
      }
    }
  useEffect(()=>{
    getUsers()
    getLandmark()
  },[])

  const [formData, setFormData] = useState({
    name: "", // Task name
    landmark: "", // Landmark ID (number or string, depending on input type)
    // estimate_ex_date: "", // Expected completion date
    estimate_ex_date: null as Date | null,
    note: "", // Task note
    assigned_users: [], // Array of assigned user IDs
  });

  // useEffect(() => {
  //   flatpickr('.form-datepicker', {
  //     mode: 'single',
  //     static: true,
  //     monthSelectorType: 'static',
  //     dateFormat: 'M j, Y',
  //     prevArrow:
  //       '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
  //     nextArrow:
  //       '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
  //   });
  //   }, []);

  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const validationErrors: any = {};
    if (!formData.name.trim()) validationErrors.name = "Task name is required.";
    if (!formData.landmark) validationErrors.landmark = "Landmark is required.";
    // if (!formData.estimate_ex_date.trim())
    //   validationErrors.estimate_ex_date = "Estimated completion date is required.";
    if (!formData.note.trim()) validationErrors.note = "Note is required.";
    if (!selectedUsers.length)
      validationErrors.assigned_users = "At least one user must be assigned.";
    return validationErrors;
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, multiple } = e.target;
    setFormData((prev) => {
      if (type === "select-multiple" || multiple) {
        // Handle multi-select dropdowns
        const selectedValues = Array.from((e.target as HTMLSelectElement).selectedOptions, (option) => Number(option.value));
        return { ...prev, [name]: selectedValues };
      } else if (type === "number") {
        // Handle number fields
        return { ...prev, [name]: Number(value) };
      } else {
        // Handle all other input types
        return { ...prev, [name]: value };
      }
    });
  };

  // const fetchUsers
  

  const handleTaskCreateSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      
      formData.assigned_users = selectedUsers
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
      // alert(JSON.stringify(formData, null, 2)); // For demonstration purposes
    }
  };

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
                  {/* <select
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary `
                    //   ${isOptionSelected ? 'text-black dark:text-white' : '' }`
                    }
                  >
                    <option value="" disabled className="text-body dark:text-bodydark">
                      Select one type
                    </option>
                   
                    {landmarkList.map((landmark:any, key) => (
                      <option key={key} value={landmark.id} className="text-body dark:text-bodydark">
                       {landmark.name}
                      </option>
                    ))}
                    
                  </select> */}
                  <Select options={landmarkList} onChange={handelSelectedLandmark}/>

                  {errors.landmark && <p className="text-meta-1">{errors.landmark}</p>}


                  <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill=""
                        ></path>
                      </g>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Estimate Work Complete 
                </label>
                {/* <div className="relative">
                  <input
                    name="estimate_ex_date"
                    value={formData.estimate_ex_date}
                    onChange={handleChange}
                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="mm/dd/yyyy"
                    data-class="flatpickr-right"
                  />
                </div> */}
                <DatePicker
                    selected={formData.estimate_ex_date} // Pass the selected date
                    onChange={(date: Date) => setFormData({ ...formData, estimate_ex_date: date })} // Update state on date change
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa" // Customize the date & time format
                    placeholderText="Select date and time"
                    className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                {errors.estimate_ex_date && <p className="text-meta-1">{errors.estimate_ex_date}</p>}
              </div>
            </div>

            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/1">
              <Select options={optiosUsers} isMulti onChange={handelSelectedUsers}/>
                {/* <MultiSelect  options={optiosUsers} setOptions={setOptiosUsers} selected={selectedUsers} setSelected={setSelectedUsers} id="multiSelect"/> */}
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
