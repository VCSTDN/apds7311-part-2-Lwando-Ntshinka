import React, { useState } from 'react'
import axios from 'axios'
import {useNavigate } from 'react-router-dom'
import stylesheet from '../components/stylesheet.css'

//Sign up function
const UseSignup = () => {
    const [name, setName] = useState('') //Assign empty string for name
    const [surname, setSurname] = useState('') //Assign empty string for name
    const [email, setEmail] = useState('') //Assign empty string for name
    const [account, setAccount] = useState('') //Assign empty string for name
    const [password, setPassword] = useState('') //Assign empty string for name
    const navigate = useNavigate()

    const handleSignup = (e) =>{
        e.preventDefault()
        const response = axios.post('https://localhost:433/signup', 
            { name, surname, email, account, password }, 
            { withCredentials: true,
                headers: {
                  'Content-Type': 'application/json'  // Explicitly set Content-Type
                }
             })
        .then(response =>{
            alert(response.data.message)
            navigate('/login')
        })
        .catch(error => {
            if (error.response) {
                console.error('Error Response:', error.response.data);
                alert(`Signup Failed: ${error.response.data.message || JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                console.error('Error Request:', error.request);
                alert('Signup Failed: No response received from the server.');
            } else {
                console.error('Error:', error.message);
                alert(`Signup Failed: ${error.message}`);
            }
    })

    }

    return(
        <form onSubmit={handleSignup}>
            <h1>Register New User</h1>
            <div>
                <label>Name</label>
                <input type='text' value={name} onChange={(e) => setName(e.target.value)}/>
            </div>

            <div>
                <label>Surname</label>
                <input type='text' value={surname} onChange={(e) => setSurname(e.target.value)}/>
            </div>

            <div>
                <label>Email</label>
                <input type='text' value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>

            <div>
                <label>Account Number</label>
                <input type='number' value={account} onChange={(e) => setAccount(e.target.value)}/>
            </div>

            <div>
                <label>Password</label>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>

            <button type='submit'>Register</button>

            <button type="button" onClick={() => navigate('/login')} style={{ padding: '10px 20px', margin: '10px' }}> Login </button>
        </form>
    )

}
export default UseSignup