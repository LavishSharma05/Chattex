import React from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'

function ChatBox() {
    return (
        <div className='chatbox'>
            <div className='chat-user'>
                <img src={assets.profile_img} alt='' />
                <p>Richard Sanford <img src={assets.green_dot} className='dot' alt=''/></p>
                <img src={assets.help_icon} className='help' alt='' />
            </div>

            <div className='chat-messages'>
                <div className='s-msg'>
                    <p className='msg'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum nesciunt, ipsa hic excepturi quas fuga amet voluptatem sapiente error accusantium quae cumque saepe rem molestias doloremque, sint quo earum officia!</p>
                    <div>
                        <img src={assets.profile_img} alt='' />
                        <p>2:30 PM</p>
                    </div>
                </div>

                <div className='r-msg'>
                    <p className='msg'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum nesciunt, ipsa hic excepturi quas fuga amet voluptatem sapiente error accusantium quae cumque saepe rem molestias doloremque, sint quo earum officia!</p>
                    <div>
                        <img src={assets.profile_img} alt='' />
                        <p>2:30 PM</p>
                    </div>
                </div>



            </div>

            <div className="chat-input">
                <input type="text" placeholder='Type a message...'/>
                <input type='file' id='image' accept='image/png, image/jpeg' hidden/>
                <label htmlFor='image'>
                    <img src={assets.gallery_icon} alt='' />
                </label>
                <img src={assets.send_button} alt='' />
            </div>
        </div>
    )
}

export default ChatBox
