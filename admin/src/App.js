import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Admin from './pages/Home.js';
import Auth from './pages/Auth.js';
import ResetPass from './pages/ResetPass.js';
import ResetPassToken from './pages/ResetPassToken.js';
import Users from './pages/User.js';
import Properties from './pages/Property.js';
import Rooms from './pages/Room.js';
import Transactions from './pages/Transaction.js';
import AddProperty from './pages/AddProperty.js';
import AddRoom from './pages/AddRoom.js';
import EditProperty from './pages/EditProperty.js';
import EditRoom from './pages/EditRoom.js';

import Navbar from './components/common/Navbar/Navbar.jsx';
import Frame from './components/UI/Frame/Frame.jsx';
import List from './components/UI/List/List.jsx';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Frame>
        <List>
          <Frame>
            <div style={{ width: '100%', display: 'flex', gap: '1rem' }}>
              <Routes>
                <Route path='/' element={<Admin />} />
                <Route path='/auth' element={<Auth />} />
                <Route path='/reset-password' element={<ResetPass />} />
                <Route path='/reset/:token' element={<ResetPassToken />} />
                <Route path='/users' element={<Users />} />
                <Route path='/properties' element={<Properties />} />
                <Route path='/rooms' element={<Rooms />} />
                <Route path='/transactions' element={<Transactions />} />
                <Route path='/new-property' element={<AddProperty />} />
                <Route path='/new-room' element={<AddRoom />} />
                <Route path='/edit-property/:id' element={<EditProperty />} />
                <Route path='/edit-room/:id' element={<EditRoom />} />
              </Routes>
            </div>
          </Frame>
        </List>
      </Frame>
    </BrowserRouter>
  );
}

export default App;
