import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
  color: string;
  url: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Webtransport Polyfill',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: <>A window.WebTransport JavaScript polyfill.</>,
    color: '#2E8555',
    url: '/docs/webtransport-polyfill/intro',
  },
  {
    title: 'Presence',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: <>2</>,
    color: '#D0372D',
    url: '/docs/presence/intro',
  },
  {
    title: 'Presence React',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: <>1</>,
    color: '#6a737d',
    url: '/docs/presence-react/intro',
  },
];

function Feature({ title, Svg, description, color, url }: FeatureItem) {
  return (
    <div
      className={'flex flex-col items-center cursor-pointer hover:border-2 flex-1'}
      style={{
        borderBottom: `8px solid ${color}`,
      }}
    >
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Link to={url}>
          <h3 className="text-2xl">{title}</h3>
        </Link>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="flex justify-center w-auto border">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
