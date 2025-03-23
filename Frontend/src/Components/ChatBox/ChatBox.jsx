import React, { useContext, useEffect, useState } from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'
import { AppContext } from '../../Context/AppContext'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../Config/firebase'
import { toast } from 'react-toastify'

function ChatBox() {

    const { userData, messagesId, chatUser, messages, setmessages } = useContext(AppContext)

    const [input, setinput] = useState("")

    useEffect(() => {
        if (messagesId) {
            const unSub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
                setmessages(res.data().messages.reverse())
            })
            return () => {
                unSub()
            }
        }
    }, [messagesId])

    const sendMessage = async () => {
        try {
            if (messagesId && input) {
                await updateDoc(doc(db, 'messages', messagesId), {
                    messages: arrayUnion({
                        sId: userData.id,
                        text: input,
                        createdAt: new Date()
                    })
                })

                const userIDs = [chatUser.rId, userData.id]

                userIDs.forEach(async (id) => {
                    const userChatsRef = doc(db, 'chats', id)
                    const userChatsSnapshot = await getDoc(userChatsRef)

                    if (userChatsSnapshot.exists()) {
                        const userChatData = userChatsSnapshot.data()
                        const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messagesId)
                        userChatData.chatsData[chatIndex].lastmessage = input.slice(0, 30)
                        userChatData.chatsData[chatIndex].updated = Date.now()

                        if (userChatData.chatsData[chatIndex].rId === userData.id) {
                            userChatData.chatsData[chatIndex].messageSeen = false
                        }

                        await updateDoc(userChatsRef, {
                            chatsData: userChatData.chatsData
                        })
                    }
                })
            }
        }
        catch (error) {
            toast.error(error.message)
        }
        setinput("")
    }

    const uploadImageAndGetURL = async (imageFile) => {
        
        const data = new FormData()
        data.append('file', imageFile)
        data.append('upload_preset', 'chattex_profile_img_upload')
        data.append('cloud_name', 'dhn668r0r')

        const res = await fetch('https://api.cloudinary.com/v1_1/dhn668r0r/image/upload', {
            method: 'POST',
            body: data
        })

        const uploadedImageUrl = await res.json()
        
        return uploadedImageUrl.url
    }

    const sendImage = async (e) => {
        try {
            const fileUrl = await uploadImageAndGetURL(e.target.files[0])
            console.log(fileUrl)

            if (fileUrl && messagesId) {
                await updateDoc(doc(db, 'messages', messagesId), {
                    messages: arrayUnion({
                        sId: userData.id,
                        image: fileUrl,
                        createdAt: new Date()
                    })
                })

                const userIDs = [chatUser.rId, userData.id]

                userIDs.forEach(async (id) => {
                    const userChatsRef = doc(db, 'chats', id)
                    const userChatsSnapshot = await getDoc(userChatsRef)

                    if (userChatsSnapshot.exists()) {
                        const userChatData = userChatsSnapshot.data()
                        const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messagesId)
                        userChatData.chatsData[chatIndex].lastmessage ="Image"
                        userChatData.chatsData[chatIndex].updated = Date.now()

                        if (userChatData.chatsData[chatIndex].rId === userData.id) {
                            userChatData.chatsData[chatIndex].messageSeen = false
                        }

                        await updateDoc(userChatsRef, {
                            chatsData: userChatData.chatsData
                        })
                    }
                })
            }

        }
        catch (error) {
            console.log("error occured",error)
            toast.error(error.message)
        }
    }

    const convertTimeStamp = (timestamp) => {
        let date = timestamp.toDate()
        const hour = date.getHours()
        const minute = date.getMinutes()

        if (hour > 12) {
            return hour - 12 + ':' + minute + 'PM'
        }
        else {
            return hour + ':' + minute + 'AM'
        }
    }

    return chatUser ? (
        <div className='chatbox'>
            <div className='chat-user'>
                <img src={chatUser.userData.avatar} alt='' />
                <p>{chatUser.userData.name} {Date.now()-chatUser.userData.lastSeen<=70000 ? <img src={assets.green_dot} className='dot' alt='' /> : null } {}</p>
                <img src={assets.help_icon} className='help' alt='' />
            </div>

            <div className='chat-messages'>
                {
                    messages.map((msg, index) =>
                    (
                        <div key={index} className={msg.sId === userData.id ? "r-msg" : "s-msg"}>
                            {msg["image"]? <img className='msg-img' src={msg.image} alt=''/> : <p className='msg'>{msg.text}</p> }
                            
                            <div>
                                <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt='' />
                                <p>{convertTimeStamp(msg.createdAt)}</p>
                            </div>
                        </div>)
                    )
                }

            </div>

            <div className="chat-input">
                <input onChange={(e) => (setinput(e.target.value))} value={input} type="text" placeholder='Type a message...' />
                <input onChange={sendImage} type='file' id='image' accept='image/png, image/jpeg' hidden />
                <label htmlFor='image'>
                    <img src={assets.gallery_icon} alt='' />
                </label>
                <img onClick={sendMessage} src={assets.send_button} alt='' />
            </div>
        </div>
    ) :
        <div className='chat-welcome'>
            <img src={assets.logo_icon} alt='' />
            <p>Chat anytime anywhere</p>
        </div>
}

export default ChatBox
