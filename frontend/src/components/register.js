import React, { useState } from 'react'
import axios from 'axios'
import {useNavigate } from 'react-router-dom'

//Backend code to run: APDS7311\Programmes\Backend\Auth\user.js

//Sign up function
const Signup = () => {
    const [name, setName] = useState('') //Assign empty string for name
    const [surname, setSurname] = useState('') //Assign empty string for name
    const [email, setEmail] = useState('') //Assign empty string for name
    const [password, setPassword] = useState('') //Assign empty string for name
    const navigate = useNavigate()

    const handleSignup = (e) =>{
        e.preventDefault()
        axios.post('https://127.0.0.1.433/signup', {
            name, surname, email, password
        })
        .then(response =>{
            alert(response.data)
            navigate('/login')
        })
        .catch(error => {
            console.error('Error creating account', error)
            alert('Error creating account')
        })

    }

    return(
        <form onSubmit={handleSignup}>
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
                <label>Password</label>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <button type='submit'>Signup</button>
        </form>
    )

}
export default Signup