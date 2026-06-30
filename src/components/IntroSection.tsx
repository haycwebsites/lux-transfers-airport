import { useHayc } from '../hayc/config-context';

export default function IntroSection() {
  const { t, config, cp } = useHayc();
  const intro = config.introConfig;
  const heading = t(intro.heading);
  const [line1, ...rest] = heading.split('\n');
  const line2 = rest.join('\n').trimStart();

  return (
    <section className="bg-white py-5 pt-xl-8 pb-xl-6 text-center text-lg-start">
      <div className="container">
        <div className="row flex-column flex-lg-row justify-content-between align-items-center">
          <div className="col-lg-6">
            <div className="lc-block">
              <p className="rfs-20" {...cp('introConfig.heading')}>
                <span className="text-dark">{line1}</span>
                {line2 ? (
                  <>
                    <br />
                    {line2}
                  </>
                ) : null}
              </p>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="lc-block">
              <p className="text-info rfs-9" {...cp('introConfig.body')}>
                {t(intro.body)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
