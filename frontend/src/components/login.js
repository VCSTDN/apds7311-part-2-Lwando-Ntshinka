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

        axios.post('https://localhost:433/login', { email, password }, { withCredentials: true })
            .then((response) => {
                const token = response.data.token
                const { userType, userId, _Id } = response.data;

                // Store the token in localStorage or sessionStorage
                localStorage.setItem('token', token);
                localStorage.setItem('userType', userType);
                localStorage.setItem('userId', userId);
                localStorage.setItem('_Id', _Id);
                alert(response.data.message)

                //Navigate to respective page depending on which user logged in
                if (userType === 'Customer') {
                    navigate(`/Customer/${userId}/customerViewPayments`);  // Redirect Customer to their payment page
                } else if (userType === 'Employee') {
                    navigate(`/Employee/employeeViewPayments`);  // Redirect Employee to their payment page
                }

            })
            .catch(error => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    console.error(`Error Response: ${error.response.data}`);
                    alert(`Login Failed: ${error.response.data.message || error.message}`);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error('Error Request:', error.request);
                    alert('Login Failed: No response received from the server.');
                } else {
                    // Something happened in setting up the request
                    console.error('Error:', error.message);
                    alert(`Login Failed: ${error.message}`);
            }
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