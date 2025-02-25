import ShowUsers from "./ShowUsers";
import RegisterUser from "./RegisterUser";
import UpdateUser from "./UpdateUser";
import AssignUser from "./AssignUser";

// import { getFromServer } from '../../globals/requests';
import { useEffect, useState } from 'react';

const Users :React.FC = () => {
    
    // const [page, setPage] = useState(true)
    const [page, setPage] = useState<"main" | "register" | "update" | "assign">("main");
    const [mainUsers,setMainUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState<any>({});

    useEffect(()=>{
    },[mainUsers])

  return (
    <>
      {page === "main" && <ShowUsers setPage={setPage} setMainUsers={setMainUsers} setSelectedUser={setSelectedUser}  />}
      {page === "register" && <RegisterUser setPage={setPage} />}
      {page === "update" && <UpdateUser setPage={setPage} selectedUser={selectedUser} />}
      {page === "assign" && <AssignUser setPage={setPage}  mainUsers={mainUsers} />}
    </>
  )
};

export default Users;
