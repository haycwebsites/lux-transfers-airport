import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HaycProvider } from './hayc/config-context';
import ScrollToTop from './components/ScrollToTop';
import InternalLinkHandler from './components/InternalLinkHandler';
import IndexPage from './pages/IndexPage';
import BookingPage from './pages/BookingPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import { blogConfig } from './config';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/book-your-transfer-easily-in-kalamata" element={<BookingPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      {blogConfig.posts.map((post) => (
        <Route
          key={post.slug}
          path={`/${encodeURIComponent(post.slug)}`}
          element={<Navigate to={`/blog/${encodeURIComponent(post.slug)}`} replace />}
        />
      ))}
      <Route path="/category/blog-el" element={<Navigate to="/blog" replace />} />
      <Route path="/category/blog-el/" element={<Navigate to="/blog" replace />} />
      <Route path="/privacy-policy/" element={<Navigate to="/privacy-policy" replace />} />
      <Route path="/book-your-transfer-easily-in-kalamata/" element={<Navigate to="/book-your-transfer-easily-in-kalamata" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <HaycProvider>
      <BrowserRouter>
        <ScrollToTop />
        <InternalLinkHandler />
        <AppRoutes />
      </BrowserRouter>
    </HaycProvider>
  );
}

export default App;
