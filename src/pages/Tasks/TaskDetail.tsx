import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState} from "react";
import { format } from "date-fns";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { patchToServer } from "../../globals/requests";

const TaskDetail:React.FC<{ setPage: Function; selectedTask: any , refreshTaskList:Function }> = ({setPage,selectedTask,refreshTaskList}) => {
    const [formData, setFormData] = useState({
        conversation: "",
      });
    const [errors, setErrors] = useState<any>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type} = e.target;
        setFormData((prev:any) => {
            return { ...prev, [name]: value };
        });
      }
    const validate = () => {
        const validationErrors: any = {};
        if (!formData.conversation.trim()) validationErrors.conversation = "Conversation is required , please write your requirements";
        return validationErrors;
    };
    
    const handelAccept = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
        }else{
        console.log(formData)
        const response =  await patchToServer(`/task_flow/tasks/${selectedTask.id}/accept-task/`,formData);
        if (response.status === 201 || response.status === 200){
            refreshTaskList();
            setPage("main");
            formData.conversation = "";

        }
    }
    }

    const handelMessage = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
        }else{
        console.log(formData)
        const response =  await patchToServer(`/task_flow/tasks/${selectedTask.id}/add-conversation/`,formData);
        if (response.status === 201 || response.status === 200){
            refreshTaskList();
            setPage("main");
            formData.conversation = "";

        }
    }
    }

    const handelTaskComplete = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
        }
        else{
            console.log(formData)
            const response =  await patchToServer(`/task_flow/tasks/${selectedTask.id}/complete-task/`,formData);
            if (response.status === 201 || response.status === 200){
                refreshTaskList();
                setPage("main");
                formData.conversation = "";
            }
    }
}

    const normalizedDate = format(new Date(selectedTask.estimate_ex_date), "MMMM d, yyyy h:mm a");
    return(
        <>
            <div onClick={()=>{setPage("main")}} > <FontAwesomeIcon icon="fa-solid fa-angle-left" /> </div> 

            <div className="flex p-5 bg-[#1E293B] shadow-md rounded-lg text-white">
                <h1 className="text-xl font-semibold mb-2">
                    Task Name: <span className="text-[#0EA5E9]">{selectedTask.name}</span>
                </h1>
                <h1 className="ml-4 text-xl font-semibold flex items-center">
                    {/* Status :  {"  "} */}
                    <span  className={`inline-flex rounded-full ml-2 bg-opacity-10 py-1 px-3 text-sm font-medium ${
                    selectedTask.is_complete
                        ? "bg-success text-success"
                        : selectedTask.is_started
                        ? "bg-warning text-warning"
                        : "bg-danger text-danger"
                    }`}
                    >
                    {selectedTask.is_complete
                    ? " Completed"
                    : selectedTask.is_started
                    ? " Active"
                    : " Pending"}
                    </span>
                </h1>
                <h1 className="ml-4 text-xl font-semibold mb-2">
                <span className="text-[#0EA5E9]">{selectedTask.landmark.name}</span>
                </h1>
                <h1 className="text-xl ml-4 font-semibold mb-2 text-[#AA203B]">
                    {normalizedDate}
                </h1>
            </div>

            <div className="rounded-sm mt-5 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                Note for this Task
                </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
                {selectedTask.note}
                <div>
                <label className="mb-3 block text-black dark:text-white">
                    Conversation
                </label>
                <textarea
                    rows={6}
                    disabled
                    value={selectedTask.conversation}
                    placeholder="Disabled textarea"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                ></textarea>
                </div>
            </div>
            
            </div>
        
            <div className="mt-2">
                <label className="mb-2 block text-black dark:text-white">
                  Add Conversation 
                </label>
                <textarea
                  rows={1}
                  name="conversation"
                  value={formData.conversation}
                  onChange={handleChange}
                  placeholder="Add Message here"
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                ></textarea>
                {errors.conversation && <p className="text-meta-1">{errors.conversation}</p>}
            </div>
        

            <div className="mt-5">
                <Stack spacing={2} direction="row">
                    <Button onClick={handelMessage} className="mr-4" variant="contained" disabled={!selectedTask.is_started}> Message</Button>
                    <Button className="mr-4"variant="contained" disabled={!selectedTask.is_started} > Add Sub Task </Button>
                    <Button onClick={handelTaskComplete}  className="mr-4" variant="contained" disabled={!selectedTask.is_started} >  Mark Complete </Button>
                    <Button onClick={handelAccept} className="mr-4" variant="contained" > Accept </Button>
                </Stack>
            </div>
        </>
    )
}
export default TaskDetail