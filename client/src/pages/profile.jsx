import {useEffect, useRef,useState} from 'react'
import { useSelector ,useDispatch} from "react-redux";
import {app} from '../firebase';
import{updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess
} from '../../redux/user/userSlice';
import {getStorage,ref, getDownloadURL,uploadBytesResumable} from 'firebase/storage';
export default function Profile() {
 const {currentUser,loading}=useSelector((state)=>state.user);
 const fileRef=useRef(null);
 const [file,setFile]=useState(undefined);
 const [filePerc,setFilePerc]=useState(0); 
 const [updateSuccess,setUpdateSuccess]=useState(false);
 const [fileUploadError, setFileUploadError] = useState(false);
 const [formData, setFormData] = useState({});
 const [showConfirmation, setShowConfirmation] = useState(false);
 const dispatch=useDispatch();
//  console.log(filePerc)
//  console.log("file",file);
//  console.log(fileUploadError);
//  console.log("current",currentUser);
//  console.log("username",currentUser.username);
 useEffect(()=>{
  if (file){
    handleFileUpload(file);
  }
 },[file]);
 
 const handleFileUpload=(file)=>{
  const storage=getStorage(app);
  const fileName=new Date().getTime()+file.name;
  const storageRef=ref(storage, fileName);
  const uploadTask=uploadBytesResumable(storageRef,file);
  uploadTask.on('state_changed',
  (snapshot)=>{
    const progress=(snapshot.bytesTransferred/
    snapshot.totalBytes) * 100;
    setFilePerc(Math.round(progress));
    console.log("upload is"+progress+'% done');
  },
  (error) => {
    setFileUploadError(true);
    console.log("errors",error)
  },
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
      setFormData({ ...formData, avatar: downloadURL })
    );
  }
  )
 }
 const handleChange=(e)=>{
  setFormData({ ...formData,[e.target.id]: e.target.value});
 }
 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    dispatch(updateUserStart());
    const res = await fetch(`/api/user/update/${currentUser._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    console.log("id",currentUser._id);
    const data = await res.json();
    if (data.success === false) {
      dispatch(updateUserFailure(data.message));
      return;
    }

    dispatch(updateUserSuccess(data));
    setUpdateSuccess(true);
  } catch (error) {
    dispatch(updateUserFailure(error.message));
  }
};
const handleDelete = async (e) => {
  e.preventDefault();
  setShowConfirmation(false); 
  try {
    dispatch(deleteUserStart());
    const res = await fetch(`/api/user/delete/${currentUser._id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success === false) {
      dispatch(deleteUserFailure(data.message));
      return;
    }

    dispatch(deleteUserSuccess(data));
  } catch (error) {
    dispatch(deleteUserFailure(error.message));
  }
}
const openConfirmation = () => {
  setShowConfirmation(true);
};

const closeConfirmation = () => {
  setShowConfirmation(false);
};

  
 console.log("form data",formData);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7"> Profile</h1>
      <form  onSubmit={handleSubmit} className="flex flex-col gap-4">
        < input type="file" className="" onChange={(e)=>setFile(e.target.files[0])} ref={fileRef} hidden accept='image/'/>
        <img src={formData.avatar || currentUser.avatar} onClick={()=>fileRef.current.click()} alt="profile"
         className="rounded-full h-24 w-24 
         object-cover cursor-pointer self-center mt-2"/>
         <p>
          {fileUploadError?
          (<span className="text-red-700">
            error uploading image
          </span>):
          filePerc > 0 && filePerc < 100 ? (
            <span>{'Uploading ${filePerc}%'}</span>):
             filePerc ===100 ? (
              <span className='text-green-700'>Image uploaded</span>
             ):
             (" ")
           
          }
         </p>
         <input type='text' placeholder="username" 
            defaultValue={currentUser.username}
            id='username' className="border p-3 rounded-lg"
            onChange={handleChange}
         />
         <input type='text' placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          id="email" className="border p-3 rounded-lg"
          />
         <input type='password' placeholder="password" id="password" className="border p-3 rounded-lg"
         onChange={handleChange}
         />
         <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95
          disabled:opacity-80" >{loading? 'Loading...':'Update'}</button>
      </form>
      <div className="flex justify-between">
        <span onClick={openConfirmation} className="text-red-700 cursor-pointer">Delete account</span> 
        {/* Confirmation dialog */}
        {showConfirmation && (
      <div className="fixed inset-0 flex items-center justify-center rounded-lg bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-lg text-gray-800">Are you sure you want to delete your account?</p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleDelete}
              className="px-4 py-2  bg-red-400 text-white rounded hover:bg-red-600"
            >
              Yes
            </button>
            <button
              onClick={closeConfirmation}
              className="ml-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              No
            </button>
          </div>
        </div>
      </div>
    )}
        <span className="text-red-700 cursor-pointer">Sign out </span>
      </div>
      {/* <p className='text-red-700 mt-5'> {error? error:" "}</p> */}
      <p> {updateSuccess? 'user updated successfully':" "}</p>
      </div>
  )
}
