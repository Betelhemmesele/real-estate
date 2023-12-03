import {BrowserRouter, Route,Routes} from 'react-router-dom';
import Home from './pages/home';
import Profile from './pages/profile';
import SignIn from './pages/signin';
import SignUp from './pages/signup';
import About from './pages/about';
import CreateListing from './pages/createListing';
import UpdateListing from './pages/updateListing';
import Header from './components/Header';
import Listing from './pages/listing';
import PrivateRoute from './components/PrivateRoute';
export default function App() {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home />}/>
      
      <Route path="/signin" element={<SignIn />}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path='/listing/:listingId' element={<Listing />} />
      <Route element={<PrivateRoute/>}>
         <Route path="/profile" element={<Profile />}/>
         <Route path="/create-listing" element={<CreateListing/>}/>
         <Route path="/update-listing/:id" element={<UpdateListing/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}
