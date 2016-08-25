angular.module('patientApp.controllers', [ "ngAnimate", "ngSanitize", "ngMaterial", "ngStorage", "ui.router"])

  .controller('TaskListCtrl', function ($scope, $localStorage, $state) {
    $scope.$storage = $localStorage;

  })

  .controller('TaskDetailCtrl', function ($scope, $stateParams, $localStorage, $http) {
    $scope.$storage = $localStorage;
    $scope.id = $stateParams.taskId;
    console.log("id: " + $scope.id);
    $scope.currentTask = $scope.$storage.patient.assignedTherapyTasks[$scope.id];
    $http.get("/therapyTaskAPI/" + $scope.currentTask.PatternID).success(function (response) {
      console.log("Task Pattern geladen");
      $scope.taskPattern = response;
    }).error(function(res){
      console.log("API Zugriff fehlgeschlagen");
      console.log(res);
      });
      //console.log("mat: " + $scope.currentTask.materials[0]);
  })

  .controller('ProfileCtrl', function ($scope, Chats) {
    //$scope.$on('$ionicView.enter', function(e) {
    //});

  })

  .controller('SettingsCtrl', function ($scope, $http, $mdDialog, $ionicPopup, $localStorage) {
    $scope.input = {};
    $scope.input.name = "Heiko Foschum";
    $scope.patients = {};
    $scope.isNameFormDisabled = false;
    $scope.patient = {};
    $scope.$storage = $localStorage;
    if(typeof $scope.$storage.patient != "undefined"){
      //$scope.isNameFormDisabled = true;
    }

    //http://192.168.40.106:3000/
    $http.get("/patientAPI").success(function (response) {
    console.log("success!!!");
      $scope.patients = response;
    }).error(function(res){
      console.log("API Zugriff fehlgeschlagen");
      console.log(res);
      });

    $scope.showPopup = function () {
      // Custom popup
      var myPopup = $ionicPopup.show({
        template: '<input type = "text" ng-model = "input.name">',
        title: 'Profil waehlen',
        subTitle: 'Bitte geben sie Vor-/Nachnamen ein',
        scope: $scope,
        buttons: [
          { text: 'Cancel'},
          { text: '<b>Save</b>', type: 'button-positive',
            onTap: function (e) {
              if (!$scope.input.name) {
                e.preventDefault();  //don't allow the user to close unless he enters model...
              } else {
              console.log("lalala");
                $scope.searchResult = {};
                $scope.searchResult = $.grep($scope.patients, function (patients) {
                  return patients.name == $scope.input.name;
                });
                if($scope.searchResult.length > 0){
                  $scope.$storage.patient = $scope.searchResult[0];
                  $scope.isNameFormDisabled = true;
                }
                return $scope.input.name;
              }
            }
          }
        ]
      });

      myPopup.then(function (res) {
        console.log('Tapped!', res);
      });

    };
  });






