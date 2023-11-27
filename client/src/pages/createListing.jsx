import { useState } from "react";
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase';
export default function CreateListing() {
  const [files,setFiles]=useState([]);
  const [formData,setFormData]= useState({
    imageUrls:[],
  })
  const [imageUploadError,setImageUploadError] =useState(null);
  const [uploading,setUploading]=useState(false);
  console.log(imageUploadError);
  console.log("from data",formData)
  console.log(files);
  const handleImageSubmit=()=>{
    setUploading(true);
    setImageUploadError(false);
      if(files.length >0 && files.length + formData.imageUrls.length <7){
        const promises=[];
        for(let i=0; i<files.length; i++){
          promises.push(storeImage(files[i]));
        }
        console.log("files length",files.length)
        Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        }).catch((err)=>{
            setImageUploadError("image upload failed (2mb max allowed)");
            setUploading(false);
            console.log(err);
          });
        }else{
          setImageUploadError("you can only upload 6 images per list");
          setUploading(false);
        }
      
  }
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleDeleteImage = (index) => {
       setFormData({
        ...formData,
        imageUrls: formData.imageUrls.filter((_,i)=>i!==index),
       })
  }
  return (
    <main className="p-3 mx-auto max-w-4xl">
       <h1 className="text-3xl font-semibold text-center my-7">createListing</h1>
       <form className="flex flex-col sm:flex-row gap-4">
           <div className="flex flex-col gap-3 flex-1">
            <input  type='text' placeholder="Name" className="border p-3 rounded-lg"
            id="name" maxLength="65" minLength="10" required/>
             <input  type='text' placeholder="Description" className="border p-3 rounded-lg"
            id="description" required/>
             <input  type='text' placeholder="Address" className="border p-3 rounded-lg"
            id="address"required/>
            <div className="flex flex-row gap-6 flex-wrap">
              <div className="flex gap-2">
                <input type="checkbox" id='sale' className="w-5"/>
                <span>Sell</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id='sale' className="w-5"/>
                <span>Rent</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id='sale' className="w-5"/>
                <span>Parking Spot</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id='sale' className="w-5"/>
                <span>Furnished</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id='sale' className="w-5"/>
                <span>Other</span>
              </div>
            </div>
            <div className="flex flex-row flex-wrap gap-6"> 
              <div className="flex items-center gap-2">
                <input type="number" id='bedrooms' min='1' max='10' required className="p-3  border border-grey-300 rounded-lg w-20"/>
                <p>Beds</p>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" id='baths' min='1' max='10' required className="p-3 border border-grey-300 rounded-lg  w-20"/>
                <p>Baths</p>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" id='regularPrice' min='1' max='10' required className="p-3 border border-grey-300 rounded-lg  w-20"/>
               <div className="flex flex-col item-center"> 
               <p>Regular Price</p>
               <span className="text-x5">($ / month)</span>
               </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" id='discountedPrice' min='1' max='10' required className="p-3 border border-grey-300 rounded-lg  w-20"/>
                <div className="flex flex-col item-center">
                <p>Discounted Price</p>
                <span className="text-x5">($ / month)</span>
                </div>
              </div>
            </div>
           </div>
           <div className="flex flex-col flex-1 gap-4">
              <p className="font-semibold">Images:</p>
              <span className="font-normal text-gray-500 ml-2">The first image will be a cover (max 6)</span>
           
           <div className="flex gap-4">
            <input onChange={(e)=>setFiles(e.target.files)} className="p-3 border boredr-grey-300 rounded w-full" type="file" id="images" accept="image/*" multiple/>
            <button type='button' onClick={handleImageSubmit} className="p-3 text-green-700 border border-green-400
             rounded uppercase hover:shadow-lg disabled:opacity-300">{uploading? 'uploading...':'Upload'}</button>
           </div>
           <p className="text-red-700 text-sm">{imageUploadError}</p>
            {
           formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
               <div  className="flex justify-between p-3 border items-center" key={index}>
                    <img src={url} alt="listing image" className="rounded-lg w-20 h-20 object-contain" />
                    <button type="button" onClick={()=>handleDeleteImage(index)} className="p-3 text-red-700 border rounded-lg uppercase hover:opacity-95"> Delete</button>
               </div>
             ))
            }
           <button className="p-3 bg-slate-700 text-white rounded-lg
           uppercase hover:opacity-95 disabled:opacity-80">Create Listing</button>
           </div>
          
       </form>
    </main>
     )
}
