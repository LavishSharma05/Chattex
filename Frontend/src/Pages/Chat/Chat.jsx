import React, { useContext, useEffect, useState } from 'react'
import './Chat.css'
import LeftSideBar from '../../Components/LeftSideBar/LeftSideBar'
import ChatBox from '../../Components/ChatBox/ChatBox'
import RightSideBar from '../../Components/RightSideBar/RightSideBar'
import { AppContext } from '../../Context/AppContext'

function Chat() {

    const { chatData, userData } = useContext(AppContext)
    const [loading, setloading] = useState(true)

    useEffect(()=>{
        if(chatData && userData){
            setloading(false)
        }
    },[chatData,userData])

    return (
        <div className='chat'>

            {
                loading? <p className='loading'>Loading....</p>  :  

                    <div className="chat-container">
                        <LeftSideBar />
                        <ChatBox />
                        <RightSideBar />
                    </div>
            }


        </div>
    )
}

export default Chat
