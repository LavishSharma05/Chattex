// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { toast } from "react-toastify";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword, signOut  } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIEcU1T2bkbr2Jrlkd_-PboJQseBqtmls",
  authDomain: "chattex-app.firebaseapp.com",
  projectId: "chattex-app",
  storageBucket: "chattex-app.firebasestorage.app",
  messagingSenderId: "1057617363322",
  appId: "1:1057617363322:web:833f2ec7d66b088f30d6c3",
  measurementId: "G-N7VWXD1PTT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth= getAuth(app)
const db = getFirestore(app)


const signup=async(username,email,password)=>{
    try{
        const res=await createUserWithEmailAndPassword(auth,email,password)
        const user=res.user
        await setDoc(doc(db,"users",user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:'',
            avatar:'',
            bio:'Hey there i am using the Chattex App',
            lastSeen:Date.now()
        })

        await setDoc(doc(db,"chats",user.uid),{
            chatsData:[]
        })
    }
    catch(error){
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(' '))
    }
}

const login=async (email,password)=>{
    try{
        const res=await signInWithEmailAndPassword(auth,email,password)
    }
    catch(error){
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(' '))
    }
}

const logout=async()=>{
    try{
        await signOut(auth)
    }
    catch(error){
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(' '))
    }
}

export {signup,login,logout,auth,db}