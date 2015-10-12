// app/routes.js

// grab the nerd model we just created
var Nerd = require('./models/nerd');

var Bear = require('./models/bear');

module.exports = function(app, express) {

    var router = express.Router();              // get an instance of the express Router

    router.route('/bears')

        // create a bear (accessed at POST http://localhost:8080/api/bears)
        .post(function(req, res) {

            var bear = new Bear();      // create a new instance of the Bear model
            bear.name = req.body.name;  // set the bears name (comes from the request)

            // save the bear and check for errors
            bear.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Bear created!' });
            });

        })

        .get(function(req, res) {
            Bear.find(function(err, bears) {
                if (err)
                    res.send(err);
                res.json(bears);
            });
        });

    router.route('/bears/:bear_id')

        // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
        .get(function(req, res) {
            Bear.findById(req.params.bear_id, function(err, bear) {
                if (err)
                    res.send(err);
                res.json(bear);
            });
        })

        // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
        .put(function(req, res) {

            // use our bear model to find the bear we want
            Bear.findById(req.params.bear_id, function(err, bear) {

                if (err)
                    res.send(err);

                bear.name = req.body.name;  // update the bears info

                // save the bear
                bear.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Bear updated!' });
                });

            });
        })

        // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
        .delete(function(req, res) {
            Bear.remove({
                _id: req.params.bear_id
            }, function(err, bear) {
                if (err)
                    res.send(err);

                res.json({ message: 'Successfully deleted' });
            });
        });

    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/api', router);

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // sample api route
    app.get('/api/nerds', function(req, res) {
        // use mongoose to get all nerds in the database
        Nerd.find(function(err, nerds) {

            // if there is an error retrieving, send the error.
                            // nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(nerds); // return all nerds in JSON format
        });
    });

    app.get('/api', function(req, res) {
      res.json({ message: 'hooray! welcome to our api!' });
    });

    // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });

};
