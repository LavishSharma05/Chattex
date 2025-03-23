// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { toast } from "react-toastify";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword, signOut, sendPasswordResetEmail  } from "firebase/auth";
import { getFirestore, setDoc, doc, collection, where, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  //Set up according to your configuration
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

<<<<<<< HEAD
export {signup,login,logout,auth,db}
=======
const resetPass=async(email)=>{
    if(!email){
        toast.error("Enter Your Email")
        return null
    }

    try{
        const userRef=collection(db,'users')
        const q=query(userRef,where("email","==",email))
        const querySnap=await getDocs(q)

        if(!querySnap.empty()){
            await sendPasswordResetEmail(auth,email)
            toast.success("Reset Email Sent")
        }
        else{
            toast.error("Email does not exist")
        }
    }
    catch(error){
        console.error(error)
        toast.error(error.message)
    }
}

export {signup,login,logout,auth,db,resetPass}
>>>>>>> d6436c9 (Update)
