var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , nib = require('nib')
  , stylus = require('stylus')
  ,os = require('os')
  , SFTP = require("sftp-ws")
  , childProcess = require('child_process');

var command = '';

var operatingSystem = os.platform().toLowerCase()
console.log('Operating System : ' , operatingSystem );
switch (operatingSystem) {
        case'darwin':
            command = './GetDrive.sh';
            break;
        case'linux':
            command = './GetDrive.sh';
            break;
	case'win32':
            command = 'GetDrive.exe';
            break;
        default:
            command = './GetDrive.sh';
}

var port = 4002;
var host = '0.0.0.0';
var app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

app.configure(function(){
  app.set('port', port);
  app.set('ipaddress', host);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(stylus.middleware({ src: __dirname + '/public', compile: compile}));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var sftp=[]; 

var letters = usedLettersSync();
app.get('/', routes.index(letters));

app.on('upgrade', function (req, socket, head) {
  console.log("proxying upgrade request", req.url);
  //proxy.ws(req, socket, head);
});

// create a HTTP server for the express app

var server = http.createServer(app);
letters.forEach(a);

function a(item,index){
	var driveLetter = item.Drive;

	if (operatingSystem === 'linux') { 
	sftp.push(new SFTP.Server({
			server: server,
			virtualRoot: driveLetter ,
			path: '/' + driveLetter,
			log: console // log to console
		}));	
		
	} else {
	sftp.push(new SFTP.Server({
			server: server,
			virtualRoot: driveLetter + ':\\',
			path: '/' + driveLetter,
			log: console // log to console
		}));	
	}
}

function b(item,index){
	console.log(item._sessionInfo.virtualRoot ,'Drive Mounted.');
}

server.listen(port, host, function () {
    var host = server.address().address;
    console.log('HTTP server listening at http://%s:%s', host, port);
	sftp.forEach(b);
});

function usedLettersSync() {
	var stdout = childProcess.execSync(command);
	var letters = stdout.toString();
	return JSON.parse(letters);
}
