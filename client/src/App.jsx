import {BrowserRouter, Route,Routes} from 'react-router-dom';
import Home from './pages/home';
import Profile from './pages/profile';
import SignIn from './pages/signin';
import SignOut from './pages/signout';
import About from './pages/about';
import Header from './components/Header';
export default function App() {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/profile" element={<Profile />}/>
      <Route path="/signin" element={<SignIn />}/>
      <Route path="/signout" element={<SignOut/>}/>
      <Route path="/about" element={<About/>}/>
    </Routes>
    </BrowserRouter>
  )
}
