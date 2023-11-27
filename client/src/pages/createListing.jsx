export default function CreateListing() {
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
            <input className="p-3 border boredr-grey-300 rounded w-full" type="file" id="images" accept="image/*" multiple/>
            <button className="p-3 mt-3 text-green-700 border border-green-400
             rounded uppercase hover:shadow-lg disabled:opacity-300">Upload</button>
           </div>
           <button className="p-3 bg-slate-700 text-white rounded-lg
           uppercase hover:opacity-95 disabled:opacity-80">Create Listing</button>
           </div>
          
       </form>
    </main>
     )
}
