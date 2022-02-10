import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SBToken from './components/screens/SBToken';
import NotFound from './components/screens/NotFound';

function RoutesPage() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route exact path="/" element={<SBToken />} />
      </Routes>
  </BrowserRouter>
  );
}

export default RoutesPage;
