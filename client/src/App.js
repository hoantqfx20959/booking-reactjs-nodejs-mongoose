import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.js';
import Auth from './pages/Auth.js';
import ResetPass from './pages/ResetPass.js';
import ResetPassToken from './pages/ResetPassToken.js';
import Detail from './pages/Detail.js';
import PropertyBy from './pages/PropertyBy.js';
import Search from './pages/Search.js';
import Reserve from './pages/Reserve.js';
import Transaction from './pages/Transaction.js';

import footer from './data/footer.json';
import navbar from './data/navBar.json';

import Navbar from './components/common/Navbar/Navbar.jsx';
import Footer from './components/common/Footer/FooterList.jsx';
import Subscribe from './components/common/Subscribe/Subscribe.jsx';

function App() {
  return (
    <BrowserRouter>
      <Navbar navbarData={navbar} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/search' element={<Search />} />
        <Route path='/detail' element={<Detail />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/reset-password' element={<ResetPass />} />
        <Route path='/reset/:token' element={<ResetPassToken />} />
        <Route path='/property-by-city/:city' element={<PropertyBy />} />
        <Route path='/property-by-type/:type' element={<PropertyBy />} />
        <Route path='/reserve' element={<Reserve />} />
        <Route path='/transaction' element={<Transaction />} />
      </Routes>
      <Subscribe />
      <Footer footerData={footer} />
    </BrowserRouter>
  );
}

export default App;
