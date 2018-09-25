var client; //= new SFTP.Client();
var currentPath = '/';
var list = document.getElementById('dirlist');
var __rootDrive = "", __selectedDrive;
var __wsPath = "";
var TreeJSON = { d: [], f: [], l: '', p: '', hasBack: false };
var FinalTreeJSON = [];
var __pathArr = [], __dirIndex = -1;

var previewFileIconSettings = { // configure your icon file extensions  	#f37735
	'doc': '<i class="fa fa-file-word-o fa-2x text-primary" style="foreground-color:color;color:#00aedb"></i>',
	'xls': '<i class="fa fa-file-excel-o fa-2x text-success" style="foreground-color:color;color:#00b159"></i>',
	'ppt': '<i class="fa fa-file-powerpoint-o fa-2x text-danger fg-brown" style="foreground-color:color;color:#ffc425"></i>',
	'pdf': '<i class="fa fa-file-pdf-o fa-2x text-danger fg-red" style="foreground-color:color;color:#ffc425"></i>',
	'zip': '<i class="fa fa-file-archive-o fa-2x text-muted fg-yellow" style="foreground-color:color;color:#ffc425"></i>',
	'htm': '<i class="fa fa-file-code-o  fa-2x text-info" style="foreground-color:color;color:#ffc425"></i>',
	'txt': '<i class="fa fa-file-text-o  fa-2x text-info" style="foreground-color:color;color:#ffc425"></i>',
	'mov': '<i class="fa fa-file-movie-o fa-2x  text-warning fg-cyan" style="foreground-color:color;color:#ffc425"></i>',
	'mp3': '<i class="fa fa-file-audio-o fa-2x  text-warning fg-cyan" style="foreground-color:color;color:#ffc425"></i>',
	'jpg': '<i class="fa fa-file-photo-o fa-2x  text-danger fg-orange" style="foreground-color:color;color:#ffc425"></i>',
	'file': '<i class="fa fa-file fa-2x text-info fg-orange"></i>'
}

$(function () {
	$('.wsFTPPath').click(function () {
		__wsPath = $(this).attr('data-path');
		__rootDrive = __wsPath + ":";
		__selectedDrive = $(this);
		var address = (window.location.protocol == "https") ? "wss" : "ws";
		address += "://" + window.location.hostname + ":" + window.location.port + "/" + __wsPath;
		client = '';
		client = new SFTP.Client();
		$(list).empty();
		$(list).html('<tr><td class="text-center"><i class="fa fa-spinner fa-spin fa-3x"></i><br><label class="text text-info">Initializing ' + __wsPath + ' Drive</label></td></tr>');
		client.connect(address);
		client.on("ready", onConnected);
		client.on("close", onError);
		return false;
	});
	
	$('#opexplorer').click();

	$(window).resize(function(){
		var curheight=$(window).height();
		$('#winExplorer').height(curheight-50+'px');
	});
	$(window).resize();
	
	$(window).contextmenu(function(){
		return false;
	});
})

function onError(error) {
	alert(error)
	$(list).empty();
	$(list).html('<tr><td class="alert alert-danger"> Drive "' + __wsPath + ':" ' + error + '</td></tr>');
	$(__selectedDrive).removeClass("btn-info btn-success");
	$(__selectedDrive).addClass("btn-danger");
}

function onConnected() {
	$(__selectedDrive).removeClass("btn-info btn-success");
	$(__selectedDrive).addClass("btn-success");
	__pathArr = [];
	__dirIndex = -1;
	getList('/', true);
}

function getList(path, __resetForward) {
	showInfo(null, null);

	list.innerHTML = "";

	if (path[path.length - 1] == '/')
		path = path.substr(path, path.length - 1);

	var p = path.lastIndexOf('/');
	if (path.length > 0 && p >= 0) {

		var parentPath = path.substr(0, p);
		if (parentPath.length == 0)
			parentPath = '/';

		TreeJSON.hasBack = true;
	}

	if (__resetForward) {
		var i = __dirIndex + 1;
		__pathArr.splice(i, (__pathArr.length - i));
	}

	path += '/';
	currentPath = path;

	client.list(path)
		.on("error", onError)
		.on("item", onItem)
		.on("success", onSuccessArray);

	function onSuccessArray(__resetForward) {
		if (__resetForward) {
			FinalTreeJSON = TreeJSON;
			TreeJSON = { d: [], f: [], l: '', p: '', hasBack: false };
		}
		//FinalTreeJSON.d.sort(GetSortOrder("filename"));
		FinalTreeJSON.d.sort(sort_by("filename", false, function (a) { return a.toLowerCase(); }));
		//FinalTreeJSON.f.sort(GetSortOrder("filename"));
		FinalTreeJSON.f.sort(sort_by("filename", false, function (a) { return a.toLowerCase(); }));
		FinalTreeJSON.p = currentPath;
		FinalTreeJSON.l = __wsPath;

		/**
		 *Creating traversing records
		*/
		var __arrIndex = $.inArray(currentPath, __pathArr);
		if (__arrIndex === -1) {
			__pathArr.push(path);
			__dirIndex++;
		}
		else {
			__dirIndex = __arrIndex;
		}
		/**
		 * End Traversing Records
		 */

		if (FinalTreeJSON.hasBack == true) {
			//createTable("..", false);
		}
		if (FinalTreeJSON.d.length === 0 && FinalTreeJSON.f.length === 0) {
			//Directory is empty
			$(list).html("Empty folder");
			return;
		}

		$('#windowPath').html('&nbsp;&nbsp;<strong>'+ FinalTreeJSON.l + ':' + path.split('/').join('&nbsp;&nbsp;<i class="fa fa-chevron-right"></i>&nbsp;&nbsp;') + '</strong>');
				
		FinalTreeJSON.d.forEach(function (element) {
			//createTable(element, false);
			__CreateListView(element, false);
		});

		FinalTreeJSON.f.forEach(function (element) {
			__CreateListView(element, false);
		});

		console.log("FinalTreeJSON", FinalTreeJSON);

	}
	
	/**
	 * To Create Medium Layout (Windows)
	 * @param {*} ___item 
	 * @param {*} ___isuploading 
	 */

	function __createMediumIcon(__item, __isuploading) {
		var __tr = $('<a>', { href: "#" });
		var __td = $('<span>');
		var __indicator = "", name = "", info = false;

		name = __item.filename;
		if (typeof (__item) === "string") {
			name = __item;
		} else if (__item.stats.isDirectory()) {
			__indicator = '<i class="fa fa-folder fa-2x"></i>';
			$(__tr).dblclick(function () { getList(path + __item.filename, true); });
			info = true;
		} else if (__item.stats.isFile()) {
			var ext = __item.filename.split('.');
			var extTemp = previewFileExtSettings(ext[ext.length - 1]);
			__indicator = previewFileIconSettings[extTemp] + '&nbsp;';
			$(__tr).dblclick(function () { 
				if(confirm("Do you want to download file : "+__item.filename)){
					downloadFile(path, __item.filename, __item); 
				}
			});
			info = true;
		}

		if (info) {
			$(__tr).click(function () {
				showInfo(__item, __tr);
			});
		}

		$(__td).append(name);
		$(__tr).append(__indicator);
		$(__tr).append(__td);
		$(list).append(__tr);
	}
	
	/*Create Medium Icon Layout Windows*/
	
	/**
	 * 
	 * @param {*} ___item 
	 * @param {*} isUploading 
	 */
	function __CreateListView(__item,isUploading){
		var __ul;
		var __li=$('<li>');

		name = __item.filename;
		$(__li).attr('data-caption',name);
		$(__li).attr('data-size',getSizeEvaluated(__item.stats.size));
		$(__li).attr('data-cdate',GetFormattedDate(__item.stats.atime));
		if (typeof (__item) === "string") {
			name = __item;
		} else if (__item.stats.isDirectory()) {
			$(__li).attr('data-icon','<i class="fa fa-folder fg-blue"></i>');
			$(__li).attr('data-ftype',"File Folder");
			$(__li).dblclick(function () { getList(path + __item.filename, true); });
			info = true;
		} else if (__item.stats.isFile()) {
			var ext = __item.filename.split('.');
			var extTemp = previewFileExtSettings(ext[ext.length - 1]);
			$(__li).attr('data-icon',previewFileIconSettings[extTemp].replace('fa-2x',''));//previewFileIconSettingsListView
			$(__li).attr('data-ftype',"File");
			$(__li).dblclick(function () { 
				if(confirm("Do you want to download file : "+__item.filename)){
					downloadFile(path, __item.filename, __item); 
				}
			});
			info = true;
		}

		if (info) {
			$(__li).click(function () {
				$('#preview').hide();
				showInfo(__item, __li);
			});
		}

		if($(list).find('ul').length===0){
			__ul=$('<ul>');
			__ul.attr('data-role','listview');
			__ul.attr('data-view','table');
			__ul.attr('data-structure','{"ftype":true,"cdate":true,"size":true}');
			var __headLI=$('<li>');
			$(__headLI).attr('data-caption',"<h6>FileName</h6>");
			$(__headLI).attr('data-ftype',"<h6>Type</h6>");
			$(__headLI).attr('data-size',"<h6>Size</h6>");
			$(__headLI).attr('data-cdate',"<h6>Created Date</h6>");
			$(__headLI).attr('data-icon','<i class="fa fa-windows1 fg-blue"></i>');
			$(__ul).append(__headLI);
			$(list).append(__ul);
		}
		else{
			__ul=$(list).find('ul');
		}
		$(__ul).append(__li);
	}
	/*Create Medium Icon Layout Windows*/
	
	/*function createTable(__item, isUploading) {
		var div = createItem(__item, false);
		$(div).addClass('col-md-12');
		var __tr = $('<tr>');
		var __td = $('<td>');

		if (typeof (__item) === "string") {
			//$(div).css('cursor', 'pointer');
			//div.onclick = function () { getList(parentPath,true); }
		} else if (__item.stats.isDirectory()) {
			$(div).css('cursor', 'pointer');
			$(__td).css('background', '#d0d0d0');
			div.onclick = function () { getList(path + __item.filename, true); }
		} else if (__item.stats.isFile()) {
			$(div).css('cursor', 'pointer');
			div.onclick = function () { downloadFile(path, __item.filename, __item); }
		}

		$(__td).append(div);
		$(__tr).append(__td);
		$(list).append(__tr);
	}*/

	function onItem(item) {
		if (item.longname[0] == 'd') {
			TreeJSON.d.push(item);
		} else {
			//console.log(item.longname);
			//console.log(item.stats);
			//console.log(item.longname);
			//console.log('----------');
			TreeJSON.f.push(item);
		}
	};
}

function downloadFile(path, name, item) {
	path += name;
	var itemDivDownload = null;
	var progressDownload = null;
	var textDownload = null;

	client.readFile(path, { mimeType: "application/octet-stream", type: "Blob" })
		.on("error", onError)
		.on("success", function (blob) {
			//var image = document.getElementById('image');
			var preview = document.getElementById('preview');
			//var progress = document.getElementById('progress');
			var url = URL.createObjectURL(blob);

			//image.src = url;
			preview.href = url;
			//preview.href = '#' + path;
			preview.innerHTML ="Save to Disk";//+= "<i class=\"fa fa-download\"></i> <br>";
			preview.draggable = "true";
			preview.download = name;
			preview.click();
		})
		.on("progress", onDownloadProgress);

	function onDownloadProgress(path, current, length) {
		$('#preview').show();
		if (itemDivDownload == null) {
			$('#preview').empty();
			$('#preview').css("width", "100%");
			$('#preview').css("word-wrap", "break-word");
			$('#preview').css("padding", "0");
			showInfo(item, null);
			//itemDivDownload = createItem(item, true);
			//$('#preview').append(itemDivDownload);

			textDownload = $("<small>");
			$(textDownload).css('text-align','left');
			
			progressDownload = document.createElement("div");
			progressDownload.className = 'progress';
			progressDownload.style.width = '0%';
			progressDownload.style['background-color'] = "#e76e54";
			$('#preview').prepend(progressDownload);
			$('#preview').prepend(textDownload);
			//itemDivDownload.appendChild(progressDownload);
		}
		$(textDownload).html(item.filename + " " +((100 * current / length) | 0) + '%');
		progressDownload.style.width = ((100 * current / length) | 0) + '%';
		if (progressDownload.style.width === '100%') {
			progressDownload.style['background-color'] = "rgb(2, 200, 101)";
		}
	};
}

function showInfo(item, elem) {
	var info = document.getElementById('details');
	if (item == null) {
		info.innerHTML = "";
	} else {
		var __detailsH = "Name: " + item.filename + "<br/>"
			+ "Size: " + ((item.stats.size / 1024) | 0) + " KB<br/>"
			+ "Date: " + item.stats.mtime.toLocaleString();

		var __detailsT = "Name: " + item.filename + "\n"
			+ "Size: " + ((item.stats.size / 1024) | 0) + " KB\n"
			+ "Date: " + item.stats.mtime.toLocaleString();
		//$('#preview').hide();
		/*if (item.stats.isFile()) {
			$('#preview').html('Save to Disk...');
			$('#preview').attr('href', '#');
			$('#preview').css("width", "100%");
			$('#preview').css("word-wrap", "break-word");
			$('#preview').css("padding", "0");
			//$('#preview').click(function () {
			//	console.log(item.filename, item);
			//	console.log(currentPath);
			//	downloadFile(currentPath, item.filename, item);
			//});
			$('#preview').show();
		}*/
		info.innerHTML = '<small>' + __detailsH + '</small>';
		if (elem != null) {
			$(elem).attr('title', __detailsT);
		}
	}
}

function previewFileExtSettings(ext) { // configure the logic for determining icon file extensions
	var extn = '';
	if (ext.match(/(doc|docx)$/i) != null) {
		extn = 'doc';
	} else if (ext.match(/(pdf)$/i) != null) {
		extn = 'pdf';
	} else if (ext.match(/(xls|xlsx)$/i) != null) {
		extn = 'xls';
	} else if (ext.match(/(ppt|pptx)$/i) != null) {
		extn = 'ppt';
	} else if (ext.match(/(zip|rar|tar|gzip|gz|7z)$/i) != null) {
		extn = 'zip';
	} else if (ext.match(/(htm|html)$/i) != null) {
		extn = 'htm';
	} else if (ext.match(/(txt|ini|csv|java|php|js|css|json)$/i) != null) {
		extn = 'txt';
	} else if (ext.match(/(avi|mpg|mkv|mov|mp4|3gp|webm|wmv)$/i) != null) {
		extn = 'mov';
	} else if (ext.match(/(mp3|wav)$/i) != null) {
		extn = 'mp3';
	} else if (ext.match(/(jpg|gif|png)$/i) != null) {
		extn = 'jpg';
	} else {
		extn = 'file';
	}
	return extn;
}

function createItem(item, isUploading) {
	var name;
	var info;
	var __indicator;

	if (typeof item === 'string') {
		name = item;
		__indicator = '';//'<i class="fa fa-folder fa-2x text-success"></i>&nbsp;';
		info = false;
	} else {
		if (!isUploading) {
			name = item.longname;
		}
		else {
			name = item.filename;
		}
		if (name.substring(0, 1) == 'd' && !isUploading) {
			__indicator = '<i class="fa fa-folder fa-2x text-success"></i>&nbsp;';
		}
		else {
			var ext = item.filename.split('.');
			var extTemp = previewFileExtSettings(ext[ext.length - 1]);
			__indicator = previewFileIconSettings[extTemp] + '&nbsp;';
		}
		info = true;
	}

	var div = document.createElement("div");
	if (info) {
		//$(div).css('font-size','14px');
		div.innerHTML = '<small>' + __indicator + item.filename + '<br>Size: ' + ((item.stats.size / 1024) | 0) + ' KB <br>Date: ' + item.stats.mtime.toLocaleString() + ' </small>';
	}
	else {
		div.innerHTML = '<dl><dt><i class="fa fa-arrow-left fa-1.5x"><i/></dt></dl>'
	}

	//div.className = 'item';

	if (info) {
		div.onmouseover = function () {
			showInfo(item, div);
		};
	}
	return div;
}

document.getElementById('files').addEventListener('change', onUploadFiles, false);

var uploadQueue = [];
var uploading = false;

function onUploadFiles(e) {
	var files = e.target.files;

	for (var i = 0, file; file = files[i]; i++) {
		uploadQueue.push(file);
	}

	uploadFile();
}

function uploadFile() {
	/*if (uploading)
		return;*/

	var file = uploadQueue.shift();
	if (typeof file === 'undefined')
		return;

	console.log('uploading to ' + currentPath + file.name + ' (' + file.size + ' ' + file.lastModifiedDate + ')');
	uploading = true;
	var itemDiv = null;
	var progress = null;

	client.upload(file, currentPath)
		.on("error", function (error) {
			uploading = false;
			uploadQueue.length = 0;
			onError(error);
		})
		.on("success", onSuccess)
		.on("progress", onProgress);

	function onSuccess() {
		if (progress != null) {
			itemDiv.removeChild(progress);
		}
		uploading = false;
		getList(currentPath, true);
		uploadFile();
	}

	function onProgress(path, current, length) {
		if (itemDiv == null) {
			$('#list_upload').empty();
			itemDiv = createItem({ filename: file.name, stats: { size: file.size, mtime: (file.lastModifiedDate ? file.lastModifiedDate : file.lastModified) } }, true);
			$('#list_upload').append(itemDiv);

			progress = document.createElement("div");
			progress.className = 'progress';
			progress.style.width = '0%';
			progress.style['background-color'] = "#e76e54";
			itemDiv.appendChild(progress);
		}
		progress.style.width = ((100 * current / length) | 0) + '%';
		if (progress.style.width === '100%') {
			progress.style['background-color'] = "rgb(2, 200, 101)";
		}
	}
}

function GetSortOrder(prop) {
	return function (a, b) {
		if (a[prop] > b[prop]) {
			return 1;
		} else if (a[prop] < b[prop]) {
			return -1;
		}
		return 0;
	}
}

function sort_by(field, reverse, primer) {
	var key = primer ? function (x) { return primer(x[field]) } : function (x) { return x[field] };
	reverse = !reverse ? 1 : -1;
	return function (a, b) {
		return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
	}
}

function GetFormattedDate(__date) {
    var todayTime = new Date(__date);
    var month = (todayTime .getMonth() + 1);
    var day = (todayTime .getDate());
    var year = (todayTime .getFullYear());
    return month + "/" + day + "/" + year;
}

function getSizeEvaluated(bytes) {
	//return bytes;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return ' ';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return bytes + ' ' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

$(function () {
	$('#windowBack').click(function () {
		if (__dirIndex === 0) return false;
		__dirIndex--;
		__curDirectory = __pathArr[__dirIndex]
		getList(__curDirectory, false);
	});
	$('#windowNxt').click(function () {
		if (__dirIndex === __pathArr.length - 1) return false;
		__dirIndex++;
		__curDirectory = __pathArr[__dirIndex]
		getList(__curDirectory, false);
	});
	$('#files').click(function(){
		if(!client){
			var html="Server Not Connected."
			Metro.infobox.create(html,'alert');
			return false;
		}
	});
});
