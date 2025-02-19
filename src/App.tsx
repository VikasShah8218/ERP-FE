import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

// import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import Users  from './pages/Users'
import Tasks from './pages/Tasks'
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons"; // Solid icons
import { fab } from "@fortawesome/free-brands-svg-icons"; // Brand icons
import RequestLoader from './components/widgets/RequestLoader';
import UsersProfile from './pages/UserProfile';
import "react-toastify/dist/ReactToastify.css";
import { initializeWebSocket } from "./wsConnection";
import { Flip ,ToastContainer } from "react-toastify";

import Store from './pages/Store';
import Products from './pages/Store/Products';
import ProductDetail from './pages/Store/Products/ProductDetail';
import ProductCreate from './pages/Store/Products/ProductCreate';
import Others from './pages/Store/Products/Others';

import RequestList from './pages/Store/Requests';
import RequestDetail from './pages/Store/Requests/RequestDetail';
import CreateRequest from './pages/Store/Requests/CreateRequest';



library.add(fas, fab);

function App() {
  const authenticated = useSelector((state:any) => state.auth.authenticated);
  const isLoading = useSelector((state:any) => state.auth.requestLoading);
  const wsMessage = useSelector((state: any) => state.auth.wsMessage?.message); 

  const navigate = useNavigate();

  const { pathname } = useLocation();

  useEffect(() => {
    if (authenticated){navigate('/');}
    else{navigate('/auth/signin');}
  }, [authenticated]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const ws:any = initializeWebSocket();
    return () => {ws.close();};
  }, []);

  const isAuthPage = pathname.startsWith('/auth');

  return (
  <>
      {isLoading && <RequestLoader/>}
      { isAuthPage ? (
          <>
            <Routes>
              <Route path="/auth/signin" element={<><PageTitle title="Signin" /> <SignIn/> </>}/>
              <Route path="/auth/signup" element={<><PageTitle title="Signup" /> <SignUp/> </>}/>
            </Routes>
            <ToastContainer position="bottom-right" autoClose={5000} limit={5} hideProgressBar={false}  newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark"  transition={Flip} />
          </>
        ) : (
          <DefaultLayout>
            <Routes>
              <Route index element={<> <PageTitle title="Dashboard" /> <ECommerce />  </>} />
              
              <Route path="/users" element={<><PageTitle title="Show Users" /><Users /></>}/>
              <Route path="/profile" element={<><PageTitle title="Profile" /><UsersProfile/></>}/>
              
              <Route path="/settings"element={<><PageTitle title="Settings" /><Settings /></>}/>
              <Route path="/tasks" element={<> <PageTitle title="Tasks" /> <Tasks /> </>}/>

              <Route path="/store" element={<> <PageTitle title="Tasks" /> <Store /> </> }/>
              <Route path="/store/products" element={<><PageTitle title="Products" /><Products /></>}/>
              <Route path="/store/products/:id" element={ <><PageTitle title="Products Detail" /> <ProductDetail /></> } />
              <Route path="/store/products/create" element={ <><PageTitle title="Products Create" /><ProductCreate /></>} />
              <Route path="/store/products/others" element={<><PageTitle title="Products Create" /><Others /></> }/>
              
              <Route path="/store/requests"element={<><PageTitle title="Requests List" /> <RequestList/> </>}/>
              <Route path="/store/requests/:id"element={<><PageTitle title="View Request"/> <RequestDetail/> </>}/>
              <Route path="/store/requests/create"element={<><PageTitle title="Create Request"/> <CreateRequest/> </>}/>
              
            </Routes>
            <ToastContainer position="bottom-right" autoClose={5000} limit={5} hideProgressBar={false}  newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark"  transition={Flip} />
          </DefaultLayout>
        )
      }
    </>
  )
 
}

export default App;
