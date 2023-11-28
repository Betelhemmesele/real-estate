import { useState } from "react";
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase';
import { useSelector } from "react-redux";
import {useNavigate} from 'react-router-dom';
export default function CreateListing() {
  const [files,setFiles]=useState([]);
  const currentUser=useSelector(state => state.user);
  const navigate = useNavigate();
  const [formData,setFormData]= useState({
    imageUrls:[],
    name: '',
    description:'',
    address:'',
    type:"rent",
    bedrooms:1,
    bathrooms:1,
    regularPrice:0,
    discountedPrice:0,
    offer:false,
    parking:false,
    furnished:false,
  })
  const [imageUploadError,setImageUploadError] =useState(null);
  const [uploading,setUploading]=useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  console.log(error);
  console.log(imageUploadError);
  console.log("from data",formData);
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
  const handleChange =(e)=>{
     if(e.target.id === 'sale' || e.target.id === 'rent'){
      setFormData({
        ...formData,
        type: e.target.id
      })
     }
     if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked
      })
     }
     if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
      setFormData({
        ...formData,
        [e.target.id]: e.target.value

      })
     }
  };
  const handleSubmit = async(e) => {
        e.preventDefault();
        try {
          if(formData.imageUrls.length < 1){
            return setError('you must upload at least one image');
          }
          if(+formData.regularPrice < +formData.discountedPrice)
            return setError('you must insert discounted price lower than regular price');
          setLoading(true);
          setError(false);
          const res=await fetch ('/api/listing/create',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',

            },
            body: JSON.stringify({
              ...formData,
              userRef: currentUser.currentUser._id,
             }),
          })
          console.log("user id",currentUser.currentUser._id);
          const data =await res.json();
          setLoading(false);
          if(data.success === false){
            setError(data.message);
          }
          navigate('/listing/${data._id');
        } catch (error) {
          setError(error.message);
          setLoading(false);

        } 
  }

  return (
    <main className="p-3 mx-auto max-w-4xl">
       <h1 className="text-3xl font-semibold text-center my-7">createListing</h1>
       <form  onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
           <div className="flex flex-col gap-3 flex-1">
            <input  
            type='text' 
            placeholder="Name" 
            className="border p-3 rounded-lg"
            id="name"
            maxLength="65"
            minLength="10" 
            required 
            onChange={handleChange}
            value={formData.name}
            />
             <input 
            type='text' 
            placeholder="Description" 
            className="border p-3 rounded-lg"
            id="description" 
            required
            onChange={handleChange}
            value={formData.description}/>
             <input  
             type='text' 
             placeholder="Address" 
             className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}/>
            <div className="flex flex-row gap-6 flex-wrap">
              <div className="flex gap-2">
                <input type="checkbox" id='sale' className="w-5" 
                onChange={handleChange} checked={formData.type=== 'sale'}/>
                <span>Sell</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id='rent' className="w-5"
                 onChange={handleChange} checked={formData.type=== 'rent'}/>
                <span>Rent</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id='parking' className="w-5"
                 onChange={handleChange} checked={formData.parking}/>
                <span>Parking Spot</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id='furnished' className="w-5"
                 onChange={handleChange} checked={formData.furnished}/>
                <span>Furnished</span>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" id='offer' className="w-5" 
                 onChange={handleChange} checked={formData.offer}/>
                <span>Offer</span>
              </div>
            </div>
            <div className="flex flex-row flex-wrap gap-6"> 
              <div className="flex items-center gap-2">
                <input type="number" id='bedrooms' min='1' max='10' 
                required className="p-3  border border-grey-300 rounded-lg w-20"
                onChange={handleChange} value={formData.bedrooms}
                />
                <p>Beds</p>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" id='bathrooms' min='1'
                 max='10' required className="p-3 border border-grey-300 rounded-lg  w-20"
                 onChange={handleChange} value={formData.bathrooms}
                 />
                <p>Baths</p>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" id='regularPrice' min='50' max='10000000' required className="p-3 border border-grey-300 rounded-lg  w-20"
                onChange={handleChange} value={formData.regularPrice}
                />
               <div className="flex flex-col item-center"> 
               <p>Regular Price</p>
               <span className="text-x5">($ / month)</span>
               </div>
              </div>
              {formData.offer && (
              <div className="flex items-center gap-2">
                <input type="number" id='discountedPrice' min='0' max='10000000' required 
                className="p-3 border border-grey-300 rounded-lg  w-20"
                onChange={handleChange} value={formData.discountedPrice}
                />
                <div className="flex flex-col item-center">
                <p>Discounted Price</p>
                <span className="text-x5">($ / month)</span>
                </div>
              </div>
              )}
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
                    <button type="button" onClick={()=>handleDeleteImage(index)} className="p-3
                     text-red-700 border rounded-lg uppercase hover:opacity-95"> Delete</button>
               </div>
             ))
            }
           <button  disabled={loading || uploading} className="p-3 bg-slate-700 text-white rounded-lg
           uppercase hover:opacity-95 disabled:opacity-80">{loading? 'creating ...':'Create Listing'}</button>
            {error && <p className='text-red-700 text-sm'>{error}</p>}
           </div>
          
       </form>
    </main>
     )
}
