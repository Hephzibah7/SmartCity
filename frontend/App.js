
import './App.css';
import SignUp from './signup.js';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Login from './login.js';
import Home from './Home/Home.js';
import Search from './search.js';
function App() {
  
  return (
    <div className="App">
       <Router>
          <Routes>
          <Route path="/home" element={<Home />} />
            <Route exact path="/SignUp" element={<SignUp />} />
            <Route exact path="/Login" element={<Login />} />
            <Route exact path="/search" element={<Search />} />
            
          </Routes>
        </Router>
     
    </div>
  );
}

export default App;
