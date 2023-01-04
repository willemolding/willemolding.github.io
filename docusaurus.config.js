// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const math = require('remark-math');
const katex = require('rehype-katex');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Willem Olding',
  tagline: 'Computer Systems Engineer and Researcher, PhD',
  url: 'https://willemolding.github.io/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'willemolding', // Usually your GitHub org/user name.
  projectName: 'willemolding.github.io', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: {
          showReadingTime: true,
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL',
          postsPerPage: 'ALL',
          remarkPlugins: [math],
          rehypePlugins: [katex], 
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Willem Olding',
        items: [
          {to: '/blog', label: 'Blog', position: 'left'},
          { type: "html", value: addNewTabLink("/resume.pdf", "Resume"), position: "left" },          {
            href: 'https://github.com/willemolding',
            label: 'GitHub',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
              {
                label: 'GitHub',
                href: 'https://github.com/willemolding',
              },
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/in/willem-olding/',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/WillemOlding1',
              },
            ],
        copyright: `Copyright © ${new Date().getFullYear()} Willem Olding. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
       metadata: [{name: 'keywords', content: 'research blockchain cryptocurrency cryptography'}],
    }),
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
};

/**
 * Create a new tab link that also uses the responsive Docusaurus stuff
 * @type {(href: string, label: string) => string}
 */
 function addNewTabLink(href, label) {
  const CLASS_NAME = "custom_menu__link";
  return `\
<style>
  @media screen and (max-width: 996px) {
    .${CLASS_NAME} {
        color: var(--ifm-menu-color);
        flex: 1;
        line-height: 1.25;
        padding: var(--ifm-menu-link-padding-vertical)
          var(--ifm-menu-link-padding-horizontal);
    }
  }
</style>
<a target="_blank" rel="noopener noreferrer" class="navbar__link ${CLASS_NAME}" href="${href}">
  ${label}
</a>`;
}

module.exports = config;
