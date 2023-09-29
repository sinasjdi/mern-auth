
import './App.css'
import { Routes,Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import axios from 'axios'
import {Toaster} from 'react-hot-toast'
import { UserContextProvider } from './context/userContext'
import Dashboard from './pages/Dashboard'
import Forgotpass from './pages/Forgotpass'
import ResetPassword from './pages/ResetPassword'
import VerifyUser from './pages/VerifyUser'
import SignOut from './pages/Signout'


axios.defaults.baseURL="http://localhost:8000";
axios.defaults.withCredentials=true;

function App() {

  return (
  <UserContextProvider>
     <Navbar />
     <Toaster position='bottom-right' toastOptions={{duration:2000}}/>
     <Routes>
      <Route path='/'element={<Home/>}/>
      <Route path='/register'element={<Register/>}/>
      <Route path='/login'element={<Login/>}/>
      <Route path='/dashboard'element={<Dashboard/>}/>
      <Route path='/forgot-password'element={<Forgotpass/>}/>
      <Route path='/reset-password/:token' element={<ResetPassword/>}/>
      <Route path='/verify/:token' element={<VerifyUser/>}/>
      <Route path="/signout" element={<SignOut/>} />
     </Routes>
     </UserContextProvider>
  )
}

export default App
