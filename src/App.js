import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './Pages/Home/Home';
import Dashboard from './Pages/Dashboard/Dashboard';
import Error from './Pages/Error/Error';
;// import './App.css';

function App() {
  return (
 <>
 <BrowserRouter>
 <Routes>
  <Route path='/' element={<Home />}/>
  <Route exact path='/user/:id' element={<Dashboard />}/>
  <Route path='*' element={<Error />}/>
 </Routes>
 </BrowserRouter>
 
 </>
  );
}

export default App;
