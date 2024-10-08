import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import stylesheet from '../components/stylesheet.css'


//Backend code to run: APDS7311\Programmes\Backend\Auth\user.js
//Backed code check authentication: APDS7311\Programmes\Backend\index.js

const UseLogin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()

        axios.post('https://localhost:433/login', {
            email, password
        })
            .then((response) => {
                const token = response.data.token
                const { userType, userId } = response.data;
                // Store the token in localStorage or sessionStorage
                localStorage.setItem('token', token);
                localStorage.setItem('userType', userType);
                localStorage.setItem('userId', userId);
                alert(response.data.message)

                //Navigate to respective page depending on which user logged in
                // Redirect based on user type
                if (userType === 'Customer') {
                    navigate(`/Customer/${userId}/customerViewPayments`);  // Redirect Customer to their payment page
                } else if (userType === 'Employee') {
                    navigate(`/Employee/employeeViewPayments`);  // Redirect Employee to their payment page
                }

            })
            .catch(error => {
                console.error(`Login Failed due to internal error ${error}`)
                alert(`Login Failed due to internal error ${error}`)
            })
    }

    return (
        <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <div>
                <label>Email</label>
                <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
                <label>Password</label>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type='submit' style={{ padding: '10px 20px', margin: '10px' }}>Login</button>

            <button type="button" onClick={() => navigate('/register')} style={{ padding: '10px 20px', margin: '10px' }}>Register</button>
        </form>
    )

}
export default UseLogin