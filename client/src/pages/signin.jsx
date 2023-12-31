import { Link,useNavigate} from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/oAuth';
import { signInStart,signInFailure,signInSuccess } from '../../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const{loading,error}=useSelector((state)=>state.user);
  const navigate = useNavigate();
  const dispatch =useDispatch();
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
    dispatch(signInStart());
    const res=await fetch('/api/auth/signin',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      } ,
      body: JSON.stringify(formData),
    });
    const data=await res.json();
    if (data.success ===false){
       dispatch(signInFailure(data.message));
      return;
    } 
    dispatch(signInSuccess(data));
    console.log(data);
    navigate('/');
  }catch(error){
   dispatch(signInFailure(error.message));
  }
   
 };
  return (
    <div>
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" className="border p-3 rounded-lg" placeholder="email" id='email' onChange={handleChange}/>
        <input type="text" className="border p-3 rounded-lg" placeholder="password" id='password'onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
        {loading? 'loading...': 'Sign In'}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont have an account?</p>
        <Link to={'/signup'}>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    
      </div>
    
  )
}
