import './App.css'
import Login from './Pages/Login/Login'
import { Route, Routes, useNavigate} from 'react-router-dom'
import Chat from './Pages/Chat/Chat'
import ProfileUpdate from './Pages/ProfileUpdate/ProfileUpdate'
import { ToastContainer, toast } from 'react-toastify';
import { useEffect,useContext } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './Config/firebase'
import { AppContext } from './Context/AppContext'



function App() {

  const navigate=useNavigate()
  const {loadUserData}=useContext(AppContext)

  useEffect(() => {
    onAuthStateChanged(auth,async(user)=>{
      if(user){
        navigate('/profile')
        await loadUserData(user.uid)
      }
      else{
        navigate('/')
      }
    })
  },[])

  return (
    <>
      <ToastContainer />
      
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/chat" element={<Chat/>} />
          <Route path="/profile" element={<ProfileUpdate/>} />
        </Routes>
      
    </>
  )
}

export default App
