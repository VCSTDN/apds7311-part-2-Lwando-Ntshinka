import React, { useState } from 'react'
import axios from 'axios'
import {useNavigate } from 'react-router-dom'
import stylesheet from '../components/stylesheet.css'


//Backend code to run: APDS7311\Programmes\Backend\Auth\user.js

//Sign up function
const Signup = () => {
    const [name, setName] = useState('') //Assign empty string for name
    const [surname, setSurname] = useState('') //Assign empty string for name
    const [email, setEmail] = useState('') //Assign empty string for name
    const [account, setAccount] = useState('') //Assign empty string for name
    const [password, setPassword] = useState('') //Assign empty string for name
    const navigate = useNavigate()

    const handleSignup = (e) =>{
        e.preventDefault()
        axios.post('https://localhost:433/signup', {
            name, surname, email, account, password
        })
        .then(response =>{
            alert(response.data)
            navigate('/login')
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

    return(
        <form onSubmit={handleSignup}>
            <h1>Register User</h1>
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
export default Signup