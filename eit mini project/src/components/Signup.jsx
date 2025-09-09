import {React} from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../css/Signup.css';

function Signup({onSignup}){
    const [username,setUsername]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const navigate=useNavigate();

    const handleSignup=()=>{
        if(!username||!email||!password){
            alert('Please fill all fields');
            return;
        }
        onSignup();
        navigate('/'); // go to homepage
    };

    return(
        <div className='signup-background'>
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:'10%'}}>
            
            <div className='maindiv'>
                <div>
                    <h1 align='center'>Sign up</h1>
                </div>
                {/*LINE*/}
                <div className='line'></div>
                <div className='textcomps'>
                    <h3 className='texts'>Username:</h3>
                    <input type='text' placeholder='Username' className='inputboxes' value={username} onChange={(e)=>setUsername(e.target.value)}></input>
                    <h3 className='texts'>Email:</h3>
                    <input type='text' placeholder='Email' className='inputboxes' value={email} onChange={(e)=>setEmail(e.target.value)}></input>
                    <h3 className='texts'>Password:</h3>
                    <input type='password' placeholder='Password' className='inputboxes' value={password} onChange={(e)=>setPassword(e.target.value)}></input>
                    <button className='buttoncss' onClick={handleSignup}>Sign up</button>
                </div>
            </div>
        </div>
        </div>
    )
};

export default Signup;
