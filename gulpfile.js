var gulp = require("gulp"),
	server = require("gulp-develop-server"),
	livereload = require("gulp-livereload"),
	stylus = require("gulp-stylus"),
	Q = require("q");

var preprosCssFiles = "public/stylesheets/stylus/**/*.styl",
	cssLocation = "public/stylesheets/",
	applicationScript = "app.js",
	nodeRoutes = "routes/**/*.js",
	services = "services/**/*.js",
	nodeJadeViews = "views/**/*.jade",
	nodeHtmlViews = "views/**/*.html",
	javascriptFiles = "public/javascripts/**/*.js",
	angularViews = "public/javascripts/partials/**/*.html";

var nodeServer = {
    	path: "bin/www"
	},
	preprosFilePattern = /(.*\.styl$)/; // Stylus files end with ".styl"

gulp.task("styles", function() {
	compilePreprosSheets();
});

gulp.task("server:start", function() {
	server.listen(nodeServer, livereload.listen);
});

gulp.task("watch", function() {
	gulp.watch([applicationScript, nodeRoutes, services, nodeJadeViews, nodeHtmlViews, javascriptFiles, angularViews, preprosCssFiles, cssLocation])
		.on("change", handleFileChanges);
});

gulp.task("default", ["styles", "server:start", "watch"]);

function compilePreprosSheets() {
	var deferred = Q.defer();
	gulp.src(preprosCssFiles)
		.pipe(stylus())
		.pipe(gulp.dest(cssLocation))
		.on("end", function() {
			deferred.resolve();
		});
	return deferred.promise;
};

function restartServer(file) {
	/* Restart server. */
    server.changed(function(error) { // It will throw exception if the server is not yet started [User Awareness].
        if(!error) {
        	livereload.changed(file.path);
        } else {
        	console.log("Error: " + JSON.stringify(error));
        }
    });
}

function handleFileChanges(file) {
	console.log('Changed');
	/* Check if a SASS file has changed. */
	if (preprosFilePattern.exec(file.path)) {
		compilePreprosSheets().then(restartServer(file));
	} else {
		restartServer(file);
	}
};