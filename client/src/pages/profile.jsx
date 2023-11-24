import {useEffect, useRef,useState} from 'react'
import { useSelector } from "react-redux/";
import {app} from '../firebase';
import {getStorage,ref, getDownloadURL,uploadBytesResumable} from 'firebase/storage';
export default function Profile() {
 const currentUser=useSelector((state)=>state.user);
 const fileRef=useRef(null);
 const [file,setFile]=useState(undefined);
 const [filePerc,setFilePerc]=useState(0); 
 const [fileUploadError, setFileUploadError] = useState(false);
 const [formData, setFormData] = useState({});
 
 console.log(filePerc)
 console.log("file",file);
 console.log(fileUploadError);
 console.log("current",currentUser);
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
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7"> Profile</h1>
      <form className="flex flex-col gap-4">
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
         <input type='text' placeholder="username" id='username' className="border p-3 rounded-lg"/>
         <input type='text' placeholder="email" id="email" className="border p-3 rounded-lg"/>
         <input type='text' placeholder="password" id="password" className="border p-3 rounded-lg"/>
         <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95
          disabled:opacity-80" >update</button>
      </form>
      <div className="flex justify-between">
        <span className="text-red-700 cursor-pointer">Delete account</span> 
        <span className="text-red-700 cursor-pointer">Sign out </span>
      </div>
      </div>
  )
}
