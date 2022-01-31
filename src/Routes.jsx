import { BrowserRouter, Routes, Route } from "react-router-dom";

import Greeter from './components/screens/Greeter';
import SBToken from './components/screens/SBToken';


function RoutesPage() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Greeter />}></Route>
        <Route path="/sbtoken" element={<SBToken />}></Route>
      </Routes>
  </BrowserRouter>
  );
}

export default RoutesPage;
