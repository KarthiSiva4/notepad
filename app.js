var app = angular.module("notepadApp", ['ngRoute','firebase']);

app.config(
        function($routeProvider,$locationProvider){
            $routeProvider
			.when('/',{
                templateUrl : "notePad.html"
            })
			.when('/upload',{
                templateUrl : "uploadFiles.html"
            })
			.when('/private',{
                templateUrl : "privateNotePad.html",
				controller: 'privateController'
            })
			.when('/privateUserNotepad',{
                templateUrl : "/privateUserNotes.html",
				controller: 'privateNotesController'
            });
		
			 // for disabling "#"
			  $locationProvider.html5Mode({
				enabled: true
				});  
				// for disabling "%2F"
			$locationProvider.hashPrefix('');

        });
		
		
		/* app.controller('privateController', ['$scope', function($scope) {
    $scope.name = 'GitHub';
  }]);
   */
   
   app.controller('privateController', privateController);
   app.controller('privateNotesController', privateNotesController);

app.controller("SampleCtrl", function($scope, $firebaseArray,$firebaseStorage, $firebaseObject) {
	
	
	 $scope.fileToUpload = null;
	 
    $scope.onChange = function onChange(fileList) {
        $scope.fileToUpload = fileList[0];
		document.getElementsByClassName('nameChange')[0].innerHTML=$scope.fileToUpload.name;
		console.log($scope.fileToUpload==null);
    };
    $scope.upload = function() {
        if ($scope.fileToUpload) {
            let storageRef = firebase.storage().ref($scope.fileToUpload.name);
            let storage = $firebaseStorage(storageRef);
			
            let uploadTask = storage.$put($scope.fileToUpload);
			
			uploadTask.$progress(function(snapshot) {
			$scope.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log($scope.progress);
});
            uploadTask.$complete((snapshot) => {
                let ref = firebase.database().ref("Files");
                let pushKey = ref.push().key;
                let formData = $firebaseObject(ref.child(pushKey));
                formData.name = $scope.fileToUpload.name;
                formData.timestamp = firebase.database.ServerValue.TIMESTAMP;
                formData.url = snapshot.downloadURL;
                formData.$save().then(() => {
                    angular.element("input[type='file']").val(null);
					document.getElementsByClassName('nameChange')[0].innerHTML="Choose file";
                    $scope.fileToUpload = null;
					$scope.progress = undefined;
                })
            });
        }
    };
	
	let fileRef = firebase.database().ref('Files');
	
	fileRef.on("value", function(snapshot) {
  console.log("There are "+snapshot.numChildren()+" messages");
  $scope.numFile=snapshot.numChildren();
});

    $scope.files = $firebaseObject(fileRef);
    $scope.delete = (key, name) => {
        let storageRef = firebase.storage().ref(name);
        let storage = $firebaseStorage(storageRef);
        storage.$delete().then(() => {
            delete $scope.files[key];
            $scope.files.$save();
        })
    }
	 
	$scope.isCollapsed = true;
	
	$scope.clearthis = function(){
  var input = document.getElementById('inbox');
  input.value = "";
  $scope.newMessageText=undefined;
  };
	
     var ref = firebase.database().ref().child("messages");
  // create a synchronized array
  $scope.messages = $firebaseArray(ref);
  // add new items to the array
  // the message is automatically added to our Firebase database!
  $scope.addMessage = function() {
    $scope.messages.$add({
      text: $scope.newMessageText
    });
	$scope.clearthis();
  };
  
  $scope.pastethis = function(){
	  
	  var input = document.getElementById('inbox');
	input.focus();
	// input.setSelectionRange(0, 99999);
	
	navigator.clipboard.readText().then(function(text){ 
    document.execCommand( "insertHTML", false, text || "");
});
	


  };
  
  $scope.copyIt = function(data,index){
	var input = document.getElementById(index);
	input.select();
	input.setSelectionRange(0, 99999);
	document.execCommand('copy');
	document.getElementById('copyBtn'+index);
  };

});
