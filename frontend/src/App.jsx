import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import MyProfile from './pages/MyProfile';
import MyAppointments from './pages/MyAppointments';
import MyReportedItems from './pages/MyReportedItems';
import Appointments from './pages/Appointment';
import Report from './pages/Report';
import Admin from './pages/Admin';
import ApproveRequests from './pages/ApproveRequests';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Navbar />
      <Routes>
        <Route path='/'                    element={<Home />} />
        <Route path='/doctors'             element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login'               element={<Login />} />
        <Route path='/about'               element={<About />} />
        <Route path='/contact'             element={<Contact />} />
        <Route path='/my-profile'          element={<MyProfile />} />
        <Route path='/my-appointments'     element={<MyAppointments />} />
        <Route path='/my-reported-items'   element={<MyReportedItems />} />
        <Route path='/appointment/:docId'  element={<Appointments />} />
        <Route path='/report'              element={<Report />} />
        <Route path='/admin'               element={<Admin />} />
        <Route path='/approve-requests'    element={<ApproveRequests />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;