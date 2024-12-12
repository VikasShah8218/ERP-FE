import ShowTasks from "./ShowTasks";
import { getFromServer } from '../../globals/requests';
// import RegisterUser from "./RegisterUser";
// import UpdateUser from "./UpdateUser";
import { useEffect, useState } from 'react';
import CreateTask from "./CreateTask";
import TaskDetail from "./TaskDetail";

const Users :React.FC = () => {
    
    // const [page, setPage] = useState(true)
    const [page, setPage] = useState<"main" | "createTask" | "taskDetail">("main");
    const [allTasksList,setAllTasksList] = useState([])
    const [selectedTask,setSelectedTask] = useState({})
 
    const getAllTaskList = async()=> {
        const resTasks = await getFromServer("/task_flow/tasks");
        if (resTasks.status){
            // console.log(resTasks.data.results)
            setAllTasksList(resTasks.data.results)

        }
    }

    // const sleep = (milliseconds: number): Promise<void> => {
    //     return new Promise((resolve) => setTimeout(resolve, milliseconds));
    // };

    useEffect(() => {
        getAllTaskList();
    }, []);

  return (
    <>
      {page === "main" && <ShowTasks setPage={setPage} allTasksList={allTasksList} setSelectedTask={setSelectedTask} />}
      {page === "createTask" && <CreateTask setPage={setPage} refreshTaskList={getAllTaskList} />}
      {page === "taskDetail" && <TaskDetail setPage={setPage} refreshTaskList={getAllTaskList} selectedTask={selectedTask}/>}
    </>
  )
};

export default Users;
