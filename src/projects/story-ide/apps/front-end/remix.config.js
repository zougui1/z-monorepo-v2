/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  // appDirectory: 'app',
  // assetsBuildDirectory: 'public/build',
  // serverBuildPath: 'build/index.js',
  // publicPath: '/build/',
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
  serverDependenciesToBundle: [
    'react-dnd',
    'react-dnd-html5-backend',
    'react-dnd-touch-backend',
    '@react-dnd/invariant',
    'dnd-core',
    '@react-dnd/shallowequal',
    '@react-dnd/asap',
    'monaco-editor',
    'monaco-editor-core',
    'shortcuts',
  ],
};
