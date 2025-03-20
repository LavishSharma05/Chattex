import React from 'react'
import './RightSideBar.css'
import assets from '../../assets/assets'
import { logout } from '../../Config/firebase'

function RightSideBar() {
    return (
        <div className='rs'>
            <div className="rs-profile">
                <img src={assets.profile_img} alt=''/>
                <h3>Richard Sanford <img className='dot' src={assets.green_dot} alt=''/></h3>
                <p>Hey i am here using the chat app</p>
            </div>
            <hr/>
            <div className="rs-media">
                <p>Media</p>
                <div>
                    <img src={assets.pic1} alt='' />
                    <img src={assets.pic2} alt='' />
                    <img src={assets.pic3} alt='' />
                    <img src={assets.pic4} alt='' />
                </div>
            </div>
            <button onClick={()=>logout()} className='rs-logout'>
                Log Out
            </button>
        </div>
    )
}

export default RightSideBar
