import { Link, useParams } from 'react-router-dom';
import { useHayc } from '../hayc/config-context';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, img, config, cp, locale } = useHayc();
  const post = config.blogConfig.posts.find((p) => p.slug === decodeURIComponent(slug ?? ''));

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="container py-5">
          <h1>{locale === 'el' ? 'Το άρθρο δεν βρέθηκε' : 'Post not found'}</h1>
          <Link to="/blog">{locale === 'el' ? 'Επιστροφή στα άρθρα' : 'Back to blog'}</Link>
        </main>
        <Footer />
      </>
    );
  }

  const index = config.blogConfig.posts.indexOf(post);

  return (
    <>
      <Navbar />
      <main id="theme-main">
        <div className="container py-5">
          <div className="row">
            <div className="col-md-8 mb-4 mx-auto">
              {post.image && (
                <img src={img(post.image)} className="w-100 mb-4 rounded" alt={t(post.title)} {...cp(`blogConfig.posts.${index}.image`)} />
              )}
              <h1 className="display-5 fw-bold mb-4" {...cp(`blogConfig.posts.${index}.title`)}>{t(post.title)}</h1>
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: t(post.content) }}
                {...cp(`blogConfig.posts.${index}.content`)}
              />
              <Link to="/blog" className="btn btn-primary mt-4">
                {locale === 'el' ? '← Επιστροφή στα άρθρα' : '← Back to blog'}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
