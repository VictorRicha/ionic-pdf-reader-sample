angular
	.module('pdfReader')
	.controller('pdfController', pdfController);
	
	
pdfController.$inject = ['$ionicLoading', '$ionicPlatform', '$cordovaFileTransfer', '$cordovaFile', '$cordovaInAppBrowser'];
	
function pdfController($ionicLoading, $ionicPlatform, $cordovaFileTransfer, $cordovaFile, $cordovaInAppBrowser) {
	var vm = this;
	
	vm.files = [];
	vm.path = "downloads";
	
	vm.downloadPDF = downloadPDF;
	vm.openPDF = openPDF;
	
	$ionicPlatform.ready(activate);
	
	//////////////
	
	function activate(){
		$cordovaFile.createDir(vm.path, false)
			.then(function(result) {
		      // Success!
			  vm.path = result.nativeURL;
			  console.log("createDir result : " + JSON.stringify(result));
		},function(error) {
		      // Success!
			  console.log("createDir error : " + JSON.stringify(error));
		});
		listFiles();
	}
	
	function listFiles(){
		$cordovaFile.listDir('downloads', true).then(function(result) {
		      // Success!
			  vm.files = result;
			  console.log("listDir result : " + JSON.stringify(result));
		},function(error) {
		      // Success!
			  console.log("listDir error : " + JSON.stringify(error));
		});
	}
	
	function downloadPDF() {
		var baseUrl = 'http://www.education.gov.yk.ca/pdf/';
		var pdfs = [
			'pdf-test.pdf'
		];
		var targetPath = vm.path + "/pdf-test.pdf";
		var trustHosts = true
    	var options = {};
		
		$ionicLoading.show({
	      template: 'Loading...'
	    });
		
		pdfs.forEach(function(pdf){
			$cordovaFileTransfer.download(baseUrl+pdf, targetPath, options, trustHosts)
				.then(function(result) {
					listFiles();
			        $ionicLoading.hide();
			      }, function(error){
					  console.log("downloadPDF error : " + JSON.stringify(error));
					  $ionicLoading.hide();
				  }, function (progress) {
				    // constant progress updates
				    console.log('Downloading:  '+(progress.loaded/progress.total).toFixed()+'%');
				  });
		});
	}
	
	function openPDF(file){
		console.log("opening Pdf");
		$cordovaInAppBrowser.open(
		    file.nativeURL,
		    '_blank',
			{ location: 'no', clearcache: 'yes', toolbar: 'yes' }
		  ).then(function() {
		      console.log("openPdf success");
		  }, function(err) {
		      console.log("openPdf error");
		  });
	}
}