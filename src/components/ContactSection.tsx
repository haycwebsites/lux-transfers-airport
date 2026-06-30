import { useHayc } from '../hayc/config-context';
import { ContactForm } from './ContactForm';

export default function ContactSection() {
  const { t, config, cp } = useHayc();
  const contact = config.contactConfig;

  return (
    <section id="contact" className="contact-section pb-7 pt-7">
      <div className="container my-5">
        <div className="contact-wrapper">
          <div className="row g-0">
            <div className="col-md-6 contact-left d-flex flex-column justify-content-between">
              <div>
                <h1 {...cp('contactConfig.title')}>{t(contact.title)}</h1>
                <p {...cp('contactConfig.description')}>{t(contact.description)}</p>
              </div>
              <div>
                <div className="info-card d-flex align-items-start">
                  <div className="info-card-icon p-1 me-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" viewBox="0 0 64 64" aria-hidden>
                      <path d="m58.46,44.81l-7.58-7.58c-.25-.25-.51-.46-.79-.65-.04-.03-.09-.04-.13-.07-.8-.5-1.71-.77-2.68-.77s-1.92.28-2.72.8c-.03.02-.06.03-.08.04-.28.19-.55.4-.8.65l-5.06,5.06c-1.2,1.2-3.16,1.2-4.37,0l-12.54-12.54c-1.2-1.21-1.2-3.17,0-4.37l1.87-1.87s.02-.01.03-.02l3.16-3.17c.25-.25.46-.51.65-.79.03-.04.04-.09.07-.13.5-.8.78-1.72.78-2.68s-.28-1.88-.78-2.68c-.02-.04-.04-.08-.07-.12-.19-.28-.4-.55-.65-.79l-7.58-7.58c-.25-.25-.52-.47-.81-.66-.05-.03-.1-.05-.15-.08-.24-.15-.49-.29-.75-.4-.01,0-.02,0-.04-.01-.6-.24-1.25-.37-1.91-.37-.98,0-1.91.28-2.73.79-.04.02-.08.04-.12.07-.29.19-.56.41-.81.66-.54.54-1.06,1.1-1.55,1.69-.49.58-.96,1.19-1.41,1.81-3.19,4.52-4.88,9.86-4.88,15.44,0,7.16,2.79,13.89,7.84,18.94l8.71,8.71c5.2,5.2,12.05,7.87,18.95,7.87,5.37,0,10.76-1.62,15.43-4.91,1.24-.88,2.42-1.88,3.5-2.96.97-.98,1.51-2.28,1.51-3.65s-.54-2.67-1.51-3.66ZM11.59,8.86c.13-.16.25-.31.38-.47.42-.49.86-.97,1.32-1.43.62-.62,1.43-.93,2.24-.93s1.62.31,2.24.93l7.58,7.58c.15.15.28.31.39.48.02.02.02.05.04.07.62,1,.62,2.28,0,3.28-.01.02-.02.04-.03.06-.11.17-.24.33-.39.48l-2.46,2.46-11.83-11.83c.17-.23.35-.46.53-.68Zm10.41,41.86l-8.71-8.71c-4.68-4.67-7.26-10.89-7.26-17.52,0-4.76,1.34-9.33,3.86-13.28l11.59,11.59-1.19,1.19c-1.98,1.98-1.98,5.2,0,7.19l12.54,12.54c1.99,1.98,5.22,1.97,7.19,0l1.19-1.19,11.58,11.58c-9.76,6.21-22.52,4.89-30.8-3.39Zm35.05,0c-.46.46-.94.89-1.43,1.31-.15.13-.32.26-.47.39-.22.18-.45.35-.68.52l-11.83-11.83,2.45-2.46c1.17-1.17,3.21-1.17,4.38,0l7.58,7.58c.6.61.93,1.41.93,2.25s-.33,1.64-.93,2.24Z" />
                    </svg>
                  </div>
                  <div>
                    <strong {...cp('contactConfig.emailLabel')}>{t(contact.emailLabel)}</strong>
                    <br />
                    <a href={`mailto:${contact.email}`} className="text-decoration-none text-dark" {...cp('contactConfig.email')}>
                      {contact.email}
                    </a>
                  </div>
                </div>
                <div className="info-card d-flex align-items-start mb-0">
                  <div className="info-card-icon p-1 me-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" viewBox="0 0 64 64" aria-hidden>
                      <path d="m49.27,10.87c-4.31,0-8.03,2.56-9.73,6.24H5s-.04,0-.05.01c-.07,0-.13.02-.2.04-.06.02-.12.03-.17.05-.05.03-.1.06-.15.1-.06.04-.11.08-.16.14-.01.01-.03.02-.04.03-.03.03-.04.08-.06.11-.04.06-.07.12-.1.19-.02.07-.03.13-.04.2,0,.04-.03.08-.03.13v34.02c0,.55.45,1,1,1h49.21c.55,0,1-.45,1-1v-21.59c2.89-1.93,4.79-5.21,4.79-8.93,0-5.92-4.81-10.73-10.73-10.73Zm-10.43,8.24c-.19.8-.3,1.63-.3,2.5,0,2.29.73,4.42,1.96,6.17l-10.9,8.69L7.86,19.11h30.99Zm14.36,32.02H6v-30.94l22.98,18.34c.18.15.4.22.62.22s.44-.07.62-.22l11.57-9.23c1.93,1.88,4.57,3.04,7.47,3.04,1.39,0,2.72-.27,3.94-.76v19.55Zm-3.94-20.79c-4.81,0-8.73-3.92-8.73-8.73s3.92-8.73,8.73-8.73,8.73,3.92,8.73,8.73-3.92,8.73-8.73,8.73Z" />
                    </svg>
                  </div>
                  <div>
                    <strong {...cp('contactConfig.phoneLabel')}>{t(contact.phoneLabel)}</strong>
                    <br />
                    <a href={`tel:${contact.phone}`} className="text-dark text-decoration-none" {...cp('contactConfig.phoneDisplay')}>
                      {t(contact.phoneDisplay)}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 contact-right d-flex align-items-center">
              <div className="contact-form-shell w-100">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
