import { createContext,useEffect,useState } from 'react';
import { auth, db } from '../Config/firebase';
import { doc } from 'firebase/firestore';
import { getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { onSnapshot } from 'firebase/firestore';
import { updateDoc } from 'firebase/firestore';



export const AppContext = createContext(); 

const AppContextProvider=(props)=>{

    const navigate=useNavigate()

    const[userData,setuserData]=useState(null);
    const [chatData,setChatData]=useState(null);

    const loadUserData=async(uid)=>{
        try {
            const userRef=doc(db,'users',uid);
            const userSnap=await getDoc(userRef);  
            const userData=userSnap.data(); 
            setuserData(userData); 

            if(userData.avatar && userData.name){
                navigate("/chat")
            }
            else{
                navigate("/profile")
            }
            
            await updateDoc(userRef,{
                lastSeen: Date.now()
            })

            setInterval(async ()=>{
                if(auth.chatUser){
                    await updateDoc(userRef,{
                        lastSeen: Date.now()
                    })
                }
            },60000)
        } 
        catch (error) {
            
        }
    }

    useEffect(()=>{
        if(userData){
            const chatRef=doc(db,'chats',userData.id);
            const unSub=onSnapshot(chatRef,async (res)=>{
                const chatItems=res.data().chatsData;
                const tempData=[];
                console.log(res.data())

                for(const item of chatItems){
                    const userRef=doc(db,'users',item.rId)
                    const userSnap=await getDoc(userRef);
                    const userData=userSnap.data();
                    tempData.push({
                        ...item,
                        userData
                    })
                } 
                setChatData(tempData.sort((a,b)=>b.updated-a.updated));
            })
            return()=>{
                unSub();
            }

        }
    },[userData])


    const value={
        userData,setuserData,
        chatData,setChatData,
        loadUserData
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;