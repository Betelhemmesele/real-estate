//import React from 'react'
import { Link,useNavigate} from 'react-router-dom';
import { useState } from 'react';
import OAuth from '../components/oAuth';
export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange=(e)=>{
        setFormData({
          ...formData,
          [e.target.id]: e.target.value,
          });
  };
  console.log("form data",formData);
 const handleSubmit = async(e)=>{
  e.preventDefault();
  try{
    setLoading(true);
    const res=await fetch('/api/auth/signup',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      } ,
      body: JSON.stringify(formData),
    });
    const data=await res.json();
    if (data.success ===false){
      setError(data.message);
      setLoading(false);
      return;
    } 
    setLoading(false);
    setError(null);
    console.log(data);
    navigate('/signin');
  }catch(error){
    setError(error.message);
      setLoading(false);
  }
   
 };
  return (
    <div>
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" className="border p-3 rounded-lg" placeholder="username" id='username' onChange={handleChange}/>
        <input type="text" className="border p-3 rounded-lg" placeholder="email" id='email' onChange={handleChange}/>
        <input type="text" className="border p-3 rounded-lg" placeholder="password" id='password'onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
        {loading? 'loading...': 'Sign Up'}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/signin'}>
          <span className='text-blue-700'>Sign In</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    
      </div>
    
  )
}
