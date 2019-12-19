function privateController($scope,$firebaseArray,$location,$timeout){
	
	if(sessionStorage.getItem('key')!=null){
		$timeout(function(){
				$location.path("/privateUserNotepad");
			});
	}
	
	
	if(sessionStorage.getItem('key')==null){
	$location.path("/private");
	}

	$scope.isRegisterClicked= false;
	$scope.dataSaved=false;
	$scope.dataNotSaved=false;
	$scope.userNotExists = false;
	$scope.wrongPass = false;
	$scope.loginForm = function(isValid,val){
		debugger;
		if (isValid) {
      firebase.database().ref('/UserRegisterationDetails').orderByChild('emailId').equalTo(val.username.$modelValue).on('value',snap=>{
      console.log(snap.val())
	  $scope.UserForm = snap.val();
	  if($scope.UserForm!=null){
		  snap.forEach(function(data) {
        console.log(data.val().password);
		if(val.password.$modelValue == data.val().password){
			$timeout(function(){
				sessionStorage.setItem('key',data.key);
				$location.path("/privateUserNotepad");
			});
			
			// $scope.$apply();
		}
		else{
			$timeout(function(){
			$scope.wrongPass = true;
			$scope.closeAlert();
		  return ;
			});
		}
    })
	  }
	  else if(snap.val() == null){
		  $timeout(function(){
		  $scope.userNotExists = true;
		  // userForm.reset();
		  $scope.closeAlert();
		  });
	  }
    })
    }
		
	};
	
	$scope.RegisterForm = function(isValid,val){
		
	if (isValid) {
		console.log($scope.userFormPop);
		
		firebase.database().ref('/UserRegisterationDetails').orderByChild('emailId')
		.equalTo(val.emailpop.$modelValue).on('value',snap=>{
debugger;
	  if(snap.val()!=null){
		userFormPop.reset();
		$timeout(function(){
			if($scope.dataSaved==true){
				$scope.dataNotSaved=false;
			}else{
				$scope.dataNotSaved=true;
			}
				$scope.closeAlert();				
			});
		return ;
	  }
	  else if(snap.val()== null){
		createUser(val);
	  } 
    });
    
	 function createUser(val){
		var ref = firebase.database().ref().child("UserRegisterationDetails");
  
	$scope.userRegister = $firebaseArray(ref);
  
    $scope.userRegister.$add({
      emailId: val.emailpop.$modelValue,
	  password: val.passwordpop.$modelValue
    });
	$scope.dataSaved=true;
	$scope.isRegisterClicked= false;
	$scope.closeAlert();
	return false;
	 }
    }
	};
	
	$scope.ChangeToRegister = function(){
	
	$scope.isRegisterClicked= true;
	
	}
	$scope.ChangeToLogin = function(){
	
	$scope.isRegisterClicked= false;
	
	}
	
	$scope.closeAlert = function(){
		$timeout(function(){
			
      $("#success-alert").slideUp(4000);
	  $scope.dataSaved=false;
	$scope.dataNotSaved=false;
	$scope.userNotExists = false;
	$scope.wrongPass = false;
	  
		},4000);
	};
	
	
} 


function privateNotesController($scope,$firebaseArray,$location,$timeout){
	
	$scope.logout = function(){
		sessionStorage.clear();
		$location.path("/private");
	}
	
	if(sessionStorage.getItem('key')==null){
	$location.path("/private");
	}
	$scope.isCollapsed = true;
	
	$scope.clearthis = function(){
  var input = document.getElementById('inbox');
  input.value = "";
  $scope.newMessageText=undefined;
  };
  
  var t= sessionStorage.getItem('key');	
  var ref = firebase.database().ref().child('/UserRegisterationDetails/'+t+'/messages');
  $scope.userMesgs = $firebaseArray(ref);
  debugger;
  $scope.addMessage = function() {
    $scope.userMesgs.$add({
      text: $scope.newMessageText
    });
	$scope.clearthis();
  };
  
  $scope.pastethis = function(){
	var input = document.getElementById('inbox');
	input.focus();
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
  
}
