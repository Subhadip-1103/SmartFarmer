import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import MarketplaceHome from './pages/MarketplaceHome';
import MarketplaceCategories from './pages/MarketplaceCategories';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import ProtectedRoute from './components/ProtectedRoute';
import FarmerLayout from './pages/farmer/FarmerLayout';
import FarmerHome from './pages/farmer/FarmerHome';
import AddProduct from './pages/farmer/AddProduct';
import MyProducts from './pages/farmer/MyProducts';
import MyOrders from './pages/farmer/MyOrders';
import EditProduct from './pages/farmer/EditProduct';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyUserOrder from './pages/MyUserOrder';
import Weather from './pages/Weather';
import CropRecommendation from './pages/CropRecommendation';
import Home from './pages/Home';
import Layout from './components/Layout';
import AIService from './pages/AIService';
import DiseasePrediction from './pages/DiseasePrediction';
import SearchResults from './pages/SearchResults';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout renders the shared Navbar once, then <Outlet/> for every page below */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/courses" element={<Categories />} />
          <Route path="/courses/category/:categoryId" element={<Courses />} />
          <Route path="/courses/detail/:id" element={<CourseDetail />} />

          <Route path="/marketplace" element={<MarketplaceHome />} />
          <Route path="/marketplace/categories/:section" element={<MarketplaceCategories />} />
          <Route path="/marketplace/products/:categoryId" element={<ProductList />} />
          <Route path="/marketplace/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/my-orders" element={<MyUserOrder />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/crop-recommendation" element={<CropRecommendation />} />
          <Route path="/ai-service" element={<AIService />} />
          <Route path="/disease-prediction" element={<DiseasePrediction />} />
          <Route path="/search" element={<SearchResults />} />
        </Route>

        <Route
          path="/farmer-dashboard"
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<FarmerHome />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="my-products" element={<MyProducts />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="my-orders" element={<MyOrders />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
