var Metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    templates = require('metalsmith-templates');

Metalsmith(__dirname)
  .use(markdown())
  .use(templates('jade'))
  .destination('./build')
  .build();
