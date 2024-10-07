import React, { useState } from 'react'
import axios from 'axios'
import {useNavigate } from 'react-router-dom'


//Backend code to run: APDS7311\Programmes\Backend\Auth\user.js
//Backed code check authentication: APDS7311\Programmes\Backend\index.js

const Login =() => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = (e) =>{
        e.preventDefault()
        axios.post('https://127.0.0.1.3000/login', {
            email, password
        })
        .then((response) => {
            const token = response.data.token
            localStorage.setItem('token', token)
            alert(response.data.message)
            navigate('/')
        })
        .catch(error => {
            console.error('Login Failed', error)
            alert('Login attempt Failed, please check your email and password')
        })
    }

    return(
        <form onSubmit={handleLogin}>
            <div>
                <label>Email</label>
                <input type='text' value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>

            <div>
                <label>Password</label>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <button type='submit'>Login</button>
        </form>
    )

}
export default Login