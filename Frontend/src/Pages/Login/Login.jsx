import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
import { signup, login, resetPass } from '../../Config/firebase'


function Login() {

    const [currentstate, setcurrentstate] = useState('Sign Up')

    const [username, setusername] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')

    const onSubmitHandler = (e) => {
        e.preventDefault()
        if (currentstate === "Sign Up") {
            signup(username, email, password)
        }
        else {
            login(email, password)
        }

    }


    return (
        <div className='login'>
            <img src={assets.logo_big} alt='' className='logo' />
            <form onSubmit={onSubmitHandler} className='login-form'>
                <h2>{currentstate}</h2>
                {currentstate === "Sign Up" ? <input onChange={(e) => { setusername(e.target.value) }} value={username} type='text' placeholder='Username' className='form-input' required /> : null}
                <input type='email' onChange={(e) => { setemail(e.target.value) }} value={email} placeholder='Type Email Address' className='form-input' required />
                <input type='password' onChange={(e) => { setpassword(e.target.value) }} value={password} placeholder='Enter Password' className='form-input' required />
                <button type='submit'>{currentstate === "Sign Up" ? "Create Account" : "Login"}</button>
                <div className="login-term">
                    <input type='checkbox' />
                    <p>I agree to the terms and conditions</p>
                </div>

                {currentstate === "Sign Up" ?
                    <div className="login-forget">
                        <p className='login-forget-text'>Already have an account? <span onClick={() => { setcurrentstate("Login") }}>Click Here</span></p>
                    </div> 
                    : 
                    <div className="login-forget">
                        <p className='login-forget-text'>Don't have an account? <span onClick={() => { setcurrentstate("Sign Up") }}>Click Here</span></p>
                    </div>
                }

                {                                       
                    currentstate==='Login' ? 
                    <div className="login-forget">
                    <p className='login-forget-text'>Forgot Password? <span onClick={() => resetPass(email)}>Reset Here</span></p>
                    </div>
                    :null
                }
            </form>
        </div>
    )
}

export default Login
