'use strict';

// Handle uploads through Flow.js
app.post('/api/upload', function(req, res){
  flow.post(req, function(status, filename, original_filename, identifier){
    console.log('POST', status, original_filename, identifier);

    res.send(200, {
      // NOTE: comment this funciton to disable cross-domain request.
      'Access-Control-Allow-Origin': '*'
    });
  });
});

// Handle cross-domain requests
// NOTE: Uncomment this funciton to enable cross-domain request.

app.options('/upload', function(req, res){
  console.log('OPTIONS');
  res.send(true, {
  'Access-Control-Allow-Origin': '*'
  }, 200);
});


// Handle status checks on chunks through Flow.js
app.get('/api/upload', function(req, res){
  flow.get(req, function(status, filename, original_filename, identifier){
    console.log('GET', status);
    res.send(200, (status == 'found' ? 200 : 404));
  });
});