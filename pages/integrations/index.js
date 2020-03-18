import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import LazyImage from 'components/LazyImage';
import Head from 'next/head';
import { gqlStaticProps, imageFields } from 'lib/datocms';
import s from './style.module.css';
import gql from 'graphql-tag';
import { Image } from 'react-datocms';
import truncate from 'truncate';
import ArrowIcon from 'public/images/illustrations/arrow-usecase.svg';
import Link from 'next/link';
import cn from 'classnames';
import docHref from 'utils/docHref';
import Space from 'components/Space';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Verizon from 'public/images/logos/verizon.svg';
import Nike from 'public/images/logos/nike.svg';
import Linkedin from 'public/images/logos/linkedin.svg';
import LogosBar from 'components/LogosBar';
import PluginBox, { LogoImage } from 'components/PluginBox';

export const getStaticProps = gqlStaticProps(
  gql`
    {
      page: integrationsPage {
        demos {
          id
          code
          githubRepo
          deploymentType
          description
          name
          demoName
          technology {
            name
            logo {
              url
            }
          }
          category {
            name
          }
          screenshot {
            responsiveImage(
              imgixParams: { w: 300, h: 200, fit: crop, crop: top }
            ) {
              ...imageFields
            }
          }
        }
        plugins {
          packageName
          coverImage {
            responsiveImage(imgixParams: { w: 300, h: 200, fit: crop }) {
              ...imageFields
            }
          }
          title
          description
        }
        hostingBuilding {
          slug
          title
          description: shortDescription
          logo {
            url
            width
            height
          }
        }
        assetsStorage {
          ...enterpriseApp
        }
        singleSignOn {
          ...enterpriseApp
        }
      }
    }

    fragment enterpriseApp on EnterpriseAppRecord {
      slug
      title
      description: shortDescription
      logo {
        url
        width
        height
      }
    }

    ${imageFields}
  `,
);

const Category = ({ title, description, children, browse }) => (
  <div className={s.category}>
    <div
      className={cn(s.categoryHeader, {
        [s.categoryHeaderWithBrowse]: !!browse,
      })}
    >
      <div className={s.categoryLeft}>
        <div className={s.categoryTitle}>{title}</div>
        <div className={s.categoryDesc}>{description}</div>
      </div>
      {browse}
    </div>
    <div className={s.boxes}>{children}</div>
  </div>
);

const Box = ({ title, description, image, href, as }) => (
  <div className={s.boxContainer}>
    <Link href={href} as={as}>
      <a className={s.box}>
        <PluginBox title={title} description={description} image={image} />
      </a>
    </Link>
  </div>
);

export default function IntegrationsPage({ page }) {
  return (
    <Layout>
      <Head>
        <title>Integrations Marketplace</title>
      </Head>
      <Hero
        title={
          <>
            <Highlight>Integrations Marketplace</Highlight>
          </>
        }
        subtitle="Expand and customize the capabilities of DatoCMS, integrating your favorite third-party services"
      />
      <Category
        title="Starter projects"
        description={
          <>
            Start with a fully configured DatoCMS project, a best practice
            frontend in a range of popular frameworks, and deployment on
            Netlify/ZEIT/Heroku.
          </>
        }
        browse={
          <Link href="/starters">
            <a className={s.browseAll}>
              Browse all the starter projects <ArrowIcon />
            </a>
          </Link>
        }
      >
        {page.demos.map(item => (
          <Box
            key={item.code}
            title={item.name}
            as={`/integrations/starters/${item.code}`}
            href="/integrations/starters/[slug]"
            description={
              <div className={s.demoDesc}>
                <div className={s.demoDescBody}>{item.description}</div>
                <div className={s.demoDescImage}>
                  <LazyImage
                    className={s.techLogo}
                    src={item.technology.logo.url}
                  />
                </div>
              </div>
            }
            image={
              <Image
                className={s.boxImageImage}
                data={item.screenshot.responsiveImage}
              />
            }
          />
        ))}
      </Category>
      <Category
        title="Community Plugins"
        browse={
          <Link href="/plugins">
            <a className={s.browseAll}>
              Browse all the plugins <ArrowIcon />
            </a>
          </Link>
        }
        description={
          <>
            Easily expand and customize the capabilities of DatoCMS with one of
            the existing community plugins.
          </>
        }
      >
        {page.plugins.map(item => (
          <Box
            key={item.packageName}
            href="/plugins/i/[...chunks]"
            as={`/plugins/i/${item.packageName}`}
            title={item.title}
            description={truncate(item.description, 55)}
            image={
              <Image
                className={s.boxImageImage}
                data={item.coverImage.responsiveImage}
              />
            }
          />
        ))}
      </Category>
      <Category
        title="Hosting &amp; CI Building"
        description={
          <>
            Server, serverless or static. No matter the stack you're using,
            we've got you covered.
          </>
        }
      >
        {page.hostingBuilding.map(item => (
          <Box
            key={item.slug}
            as={`/integrations/hosting/${item.slug}`}
            href="/integrations/hosting/[slug]"
            title={item.title}
            description={truncate(item.description, 55)}
            image={<LogoImage logo={item.logo} />}
          />
        ))}
      </Category>
      <div className={s.grid}>
        <Category
          title="Assets storage"
          description={
            <>
              Keep 100% ownership of your media files using your own AWS/Google
              Storage buckets.
            </>
          }
        >
          {page.assetsStorage.map(item => (
            <Box
              key={item.slug}
              as={`/integrations/enterprise/${item.slug}`}
              href="/integrations/enterprise/[slug]"
              title={item.title}
              description={truncate(item.description, 55)}
              image={<LogoImage logo={item.logo} />}
            />
          ))}
        </Category>
        <Category
          title="Single Sign-On"
          description={
            <>
              Keep your company data secure with centralized users management.
            </>
          }
        >
          {page.singleSignOn.map(item => (
            <Box
              key={item.slug}
              as={`/integrations/enterprise/${item.slug}`}
              href="/integrations/enterprise/[slug]"
              title={item.title}
              description={truncate(item.description, 55)}
              image={<LogoImage logo={item.logo} />}
            />
          ))}
        </Category>
      </div>
      <Space bottom={1}>
        <LogosBar
          title="We power experiences for over half a billion users"
          clients={[DeutscheTelekom, Hashicorp, Verizon, Nike, Linkedin]}
        />
      </Space>
    </Layout>
  );
}
