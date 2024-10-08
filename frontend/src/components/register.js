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
            console.error(`Error creating account ${error}`)
            alert(`Internal error when creating account ${error}`)
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