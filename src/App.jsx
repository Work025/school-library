import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Home from './pages/Home/Home.jsx'
import PDFViewer from './pages/PDFViewer/PDFViewer.jsx'
import Admin from './pages/Admin/Admin.jsx'
import Login from './pages/Login/Login.jsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pdf" element={<PDFViewer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;