# Website

My personal website and blog. Add new blog posts to the `/blog` directory in markdown format to have then added to the site.

It is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ npm install
```

### Local Development

```
$ npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Deployment is done automatically by a Github action on pushes to the main branch. This will build the site and place the build assets on the `gh-pages` branch to be served.