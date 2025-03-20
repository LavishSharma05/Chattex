import React, { useContext, useState } from 'react'
import './LeftSideBar.css'
import assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { arrayUnion, collection, doc, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../../Config/firebase'
import { getDocs } from 'firebase/firestore'
import { AppContext } from '../../Context/AppContext'
import { toast } from 'react-toastify'



function LeftSideBar() {

    const navigate = useNavigate()
    const { userData, chatData } = useContext(AppContext)
    const [user, setuser] = useState(null)//user you get on searching
    const [showSearch, setShowSearch] = useState(false)

    const handleeditProfile = () => {
        navigate('/profile')
    }

    const inputHandler = async (e) => {
        try {
            const input = e.target.value

            if (input) {
                setShowSearch(true)
                const useRef = collection(db, 'users')

                const q = query(useRef, where("username", "==", input.toLowerCase()))
                const querySnap = await getDocs(q)

                if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
                    let userExist = false
                    console.log(chatData)
                    chatData.map((user) => {
                        if (user.rId === querySnap.docs[0].data().id) {
                            userExist = true
                        }
                    })
                    if (!userExist) {
                        setuser(querySnap.docs[0].data())
                    }

                }

                else {
                    setuser(null)
                }
            }

            else {
                setShowSearch(false)
            }

        }
        catch (error) {

        }
    }

    const addChat = async () => {
        const messageRef = collection(db, 'messages')
        const chatsRef = collection(db, 'chats')

        try {
            const newMessageRef = doc(messageRef)
            await setDoc(newMessageRef, {
                createAt: serverTimestamp(),
                messages: []
            })

            await updateDoc(doc(chatsRef, user.id), {
                chatsData: arrayUnion({
                    messageId: newMessageRef.id,
                    lastmessage: "",
                    rId: userData.id,
                    updated: Date.now(),
                    messageSeen: true

                })
            })

            await updateDoc(doc(chatsRef, userData.id), {
                chatsData: arrayUnion({
                    messageId: newMessageRef.id,
                    lastmessage: "",
                    rId: user.id,
                    updated: Date.now(),
                    messageSeen: true
                })
            })
        }

        catch (error) {
            toast.error(error.message)
            console.error(error)
        }
    }

    const setChat=async(items)=>{
        console.log(items)
    }

    return (
        <div className='ls'>
            <div className='ls-top'>
                <div className="ls-nav">
                    <img src={assets.logo} alt='' />
                    <div className="menu">
                        <img src={assets.menu_icon} alt='' />
                        <div className="sub-menu">
                            <p onClick={handleeditProfile}>Edit Profile</p>
                            <hr />
                            <p>Logout</p>
                        </div>
                    </div>
                </div>
                <div className="ls-search">
                    <img src={assets.search_icon} alt='' />
                    <input onChange={inputHandler} type="text" placeholder='Search' />
                </div>
            </div>
            <div className="ls-list">
            {
    showSearch && user ? 
        <div onClick={addChat} className='friends add-user'>
            <img src={user.avatar} alt='' />
            <p>{user.name}</p>
        </div>
    : 
    chatData && chatData.length > 0 ? (
        chatData.map((item, index) => (
            <div onClick={()=>setChat(item)} key={index} className="friends">
                <img src={item.userData?.avatar || assets.avatar_icon} alt='' />
                <div>
                    <p>{item.userData?.name || "Unknown"}</p>
                    <span>{item.lastMessage || "No messages yet"}</span>
                </div>
            </div>
        ))
    ) : (
        <p>Loading chats...</p>
    )
}


            </div>
        </div>
    )
}

export default LeftSideBar
