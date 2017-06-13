var isUseHTTPs = true && !(!!process.env.PORT || !!process.env.IP);
var ipAddr;
var port = process.env.PORT || 8000;

try {
    var _port = require('./config.json').port;

    if (_port && _port.toString() !== '8000') {
        port = parseInt(_port);
    }
} catch (e) {}

var server = require(isUseHTTPs ? 'https' : 'http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');

function serverHandler(request, response) {
    try {
		ipAddr=request.connection.remoteAddress

        	var uri = url.parse(request.url).pathname,
                filename = path.join(process.cwd(), uri);

        	if (filename && filename.search(/server.js|Scalable-Broadcast.js|Signaling-Server.js/g) !== -1) 
		{
            		response.writeHead(404, {'Content-Type': 'text/plain'});
            		response.write('404 Not Found: ' + path.join('/', uri) + '\n');
            		response.end();
            		return;
        	}

        	var stats;

        	try 
		{
            		stats = fs.statSync(filename);

            		if (filename && filename.search(/demos/) === -1 && stats.isDirectory()) 
			{
                		response.writeHead(200, {'Content-Type': 'text/html'});
                		response.write('<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=/frontend/videoconference.html"></head><body></body></html>');
                		response.end();
                		return;
            		}	
        	} 
		catch(e)
        	{
            		response.writeHead(404, {'Content-Type': 'text/plain'});
            		response.write('404 Not Found: ' + path.join('/', uri) + '\n');
            		response.end();
            		return;
        	}

        	fs.readFile(filename, 'utf8', function(err, file) {
            	if (err)
		{
                	response.writeHead(500, {'Content-Type': 'text/plain'});
                	response.write('404 Not Found: ' + path.join('/', uri) + '\n');
                	response.end();
                	return;
            	}

           

            	try
		{
                	var docs = (fs.readdirSync('docs') || []);

                	if (docs.length) 
			{
                    		var html = '<section class="experiment" id="docs">';
                    		html += '<h2><a href="#docs">Documentation</a></h2>';
                    		html += '<ol>';
                    		html += '</ol></section><section class="experiment own-widgets latest-commits">';

                    		file = file.replace('<section class="experiment own-widgets latest-commits">', html);
                	}
            	}
		catch(e){}

            	response.writeHead(200);
            	response.write(file, 'utf8');
            	response.end();
        	});
    }
    catch (e)
    {
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.write('<h1>Unexpected error:</h1><br><br>' + e.stack || e.message || JSON.stringify(e));
        response.end();
    }
}

var app;

if (isUseHTTPs) 
{
    var options = {
        key: fs.readFileSync(path.join(__dirname, 'keys/privatekey.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'keys/certificate.pem'))
    };
    app = server.createServer(options, serverHandler);
} else app = server.createServer(serverHandler);

app = app.listen(port, process.env.IP || '0.0.0.0', function() {
    var addr = app.address();

    if (addr.address === '0.0.0.0')
    {
        addr.address = 'localhost';
    }
    else 
	addr.address = ipaddr;

    console.log('Server listening at ' + (isUseHTTPs ? 'https' : 'http') + '://' + addr.address + ':' + addr.port);
});

require('./Signaling-Server.js')(app, function(socket) {
    try {
        var params = socket.handshake.query;

        // "socket" object is totally in your own hands!
        // do whatever you want!

        // in your HTML page, you can access socket as following:
        // connection.socketCustomEvent = 'custom-message';
        // var socket = connection.getSocket();
        // socket.emit(connection.socketCustomEvent, { test: true });

        if (!params.socketCustomEvent) {
            params.socketCustomEvent = 'custom-message';
        }

        socket.on(params.socketCustomEvent, function(message) {
            try 
	    {
                socket.broadcast.emit(params.socketCustomEvent, message);
            } catch (e) {}
        });
    } catch (e) {}
});
