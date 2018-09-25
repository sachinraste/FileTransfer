var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , nib = require('nib')
  , stylus = require('stylus')
  ,os = require('os')
//  , wdl = require('windows-drive-letters')
  , SFTP = require("sftp-ws")
  , childProcess = require('child_process');

//var command = 'echo Caption && mountvol /L | find ":\\"';

var command = '';
var virtualRoot = '';
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
//var letters = wdl.usedLettersSync().sort();
var letters = usedLettersSync();
app.get('/', routes.index(letters));

app.on('upgrade', function (req, socket, head) {
  console.log("proxying upgrade request", req.url);
  //proxy.ws(req, socket, head);
});
//app.use(express.static(process.cwd() + '/client' ));
// create a HTTP server for the express app

var server = http.createServer(app);
letters.forEach(a);

function a(item,index){
	var virtualRoot;
	if (operatingSystem = 'linux') {
		sftp.push(new SFTP.Server({
			server: server,
			virtualRoot: item.Drive,
			path: '/'+item.Drive,
			log: console // log to console
		}));
	}
	else {
		sftp.push(new SFTP.Server({
			server: server,
			virtualRoot: item.Drive+':\\',
			path: '/'+item.Drive,
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
	//console.log(usedLettersSync());
});

function usedLettersSync() {
	var stdout = childProcess.execSync(command);
	var letters = stdout.toString();

   //var letters = tableParser.parse(a).map((caption) => {
    //return caption.Caption[0].replace(':\\','').replace('\\','');
  //});
  return JSON.parse(letters);
}


