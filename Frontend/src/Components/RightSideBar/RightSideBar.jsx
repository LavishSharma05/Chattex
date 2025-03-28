import React, { useContext, useEffect, useState } from 'react'
import './RightSideBar.css'
import assets from '../../assets/assets'
import { logout } from '../../Config/firebase'
import { AppContext } from '../../Context/AppContext'

function RightSideBar() {

    const {chatUser,messages}=useContext(AppContext)
    const [msgImages,setmsgImages]=useState([])

    useEffect(()=>{
        let tempVar=[]

        messages.map((msg)=>{
            if(msg.image){
                tempVar.push(msg.image)
            }
        })
        setmsgImages(prev => [...prev, ...tempVar]);
    },[messages])

    return chatUser? (
        <div className='rs'>
            <div className="rs-profile">
                <img src={chatUser.userData.avatar} alt=''/>
                <h3>{Date.now()-chatUser.userData.lastSeen<=70000 ? <img className='dot' src={assets.green_dot} alt=''/>: null} {chatUser.userData.name}</h3>
                <p>{chatUser.userData.bio}</p>
            </div>
            <hr/>
            <div className="rs-media">
                <p>Media</p>
                <div>
                    {   
                        msgImages.map((url,index)=>(
                            <img key={index} src={url} alt=''/>
                        ))
                    }
                </div>
            </div>
            <button onClick={()=>logout()} className='rs-logout'>
                Log Out
            </button>
        </div>
    )
    :
    <div className='rs-button'>
        <button onClick={()=>logout()}>Log Out</button>
    </div>
}

export default RightSideBar
