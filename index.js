// requires

var Metalsmith  = require('metalsmith'),
    markdown    = require('metalsmith-markdown'),
    templates   = require('metalsmith-templates'),
    collections = require('metalsmith-collections'),
    permalinks  = require('metalsmith-permalinks'),
    coffee      = require('metalsmith-coffee'),
    less        = require('metalsmith-less'),
    watch       = require('metalsmith-watch'),
    connect     = require('connect'),
    liveReload  = require('connect-livereload'),
    serveStatic = require('serve-static'),
    Handlebars  = require('handlebars'),
    fs          = require('fs');



// register partials

Handlebars.registerPartial('header', fs.readFileSync(__dirname + '/templates/partials/header.hbt').toString());
Handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/templates/partials/footer.hbt').toString());



// plugin to add a template key to posts (so we don't need to specify the template for every post)

var findTemplate = function(config) {
  var pattern = new RegExp(config.pattern);
  return function(files, metalsmith, done) {
    for (var file in files) {
      if (pattern.test(file)) {
        var _f = files[file];
        if (!_f.template) {
          _f.template = config.templateName;
        }
      }
    }
    done();
  };
};



// start dev server

connect()
  .use(liveReload({
    port: 35729
  }))
  .use(serveStatic(__dirname + '/build'))
  .listen(3000);



// build

Metalsmith(__dirname)
  .use(watch({
    livereload: true
  }))
  .use(collections({
    pages: {
      pattern: 'content/pages/*.md'
    },
    posts: {
      pattern: 'content/posts/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(findTemplate({
    pattern: 'posts',
    templateName: 'post.hbt'
  }))
  .use(markdown())
  .use(permalinks({
    pattern: ':collection/:title'
  }))
  .use(templates('handlebars'))
  .use(less())
  .use(coffee())
  .destination('./build')
  .build(function(err, files) {
    if (err) {
      throw err;
    }
  });
