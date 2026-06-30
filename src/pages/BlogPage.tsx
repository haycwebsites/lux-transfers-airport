import { Link } from 'react-router-dom';
import { useHayc } from '../hayc/config-context';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

export default function BlogPage() {
  const { t, img, config, cp } = useHayc();
  const blog = config.blogConfig;

  return (
    <>
      <Navbar />
      <main id="theme-main">
        <div className="py-5 py-xl-6 bg-light-subtle">
          <div className="container text-center">
            <h1 className="display-4" {...cp('blogConfig.title')}>{t(blog.title)}</h1>
            <p className="lead" {...cp('blogConfig.description')}>{t(blog.description)}</p>
          </div>
        </div>
        <div className="container py-5">
          <div className="row g-4">
            {blog.posts.map((post, i) => (
              <div key={post.slug} className="col-md-6 col-lg-4">
                <div className="card h-100 position-relative">
                  <img
                    src={img(post.image)}
                    className="card-img-top"
                    alt={t(post.title)}
                    style={{ height: 256, objectFit: 'cover' }}
                    {...cp(`blogConfig.posts.${i}.image`)}
                  />
                  <div className="card-body">
                    <span className="badge bg-primary rounded-pill mb-2" {...cp('blogConfig.title')}>{t(blog.title)}</span>
                    <h2 className="h5 card-title">
                      <Link to={`/blog/${encodeURIComponent(post.slug)}`} className="stretched-link text-decoration-none text-dark" {...cp(`blogConfig.posts.${i}.title`)}>
                        {t(post.title)}
                      </Link>
                    </h2>
                    <p className="card-text small text-muted" {...cp(`blogConfig.posts.${i}.excerpt`)}>
                      {t(post.excerpt).replace(/Read More…/g, '').replace(/&#8230;/g, '')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
