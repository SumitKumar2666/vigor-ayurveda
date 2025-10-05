import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './routes/Home';
import { Shop } from './routes/Shop';
import { ProductDetail } from './routes/ProductDetail';
import { Cart } from './routes/Cart';
import { Checkout } from './routes/Checkout';
import { Account } from './routes/Account';
import { Learn } from './routes/Learn';
import { Contact } from './routes/Contact';
import { Legal } from './routes/Legal';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account/*" element={<Account />} />
          <Route path="/learn/*" element={<Learn />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal/:page" element={<Legal />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;