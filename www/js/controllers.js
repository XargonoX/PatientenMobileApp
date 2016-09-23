angular.module('patientApp.controllers', ["ngAnimate", "ngSanitize", "ngMaterial", "ngStorage", "ui.router"])
  .filter('hrefToJS', function ($sce, $sanitize) {
    return function (text) {
      var regex = /href="([\S]+)"/g;
      var newString = $sanitize(text).replace(regex, "onClick=\"window.open('$1', '_blank', 'location=yes')\"");
      return $sce.trustAsHtml(newString);
    }
  })

  .controller('TaskListCtrl', function ($scope, $http, $localStorage, $state, $cordovaLocalNotification) {
    $scope.$storage = $localStorage;

    $http.get("/patientAPI/" + $scope.$storage.patient._id).success(function (response) {
      $scope.$storage.patient = response;
    }).error(function (res) {
      console.log("API Zugriff fehlgeschlagen: " + res);
    });

    $scope.addLocalNotification = function(){
      var alarmTime = new Date();
      alarmTime.setMinutes(alarmTime.getMinutes()+1);
      $cordovaLocalNotification.add({
        id : "12345",
        date: alarmTime,
        message: "fu Message alda",
        autoCancel: true
        title: "What a Title BOAY"
      }).then(function () {
        console.log("Alarm set!");
      })
    };

  })

  .controller('TaskDetailCtrl', function ($scope, $stateParams, $localStorage, $http, ionicTimePicker) {
    $scope.$storage = $localStorage;
    $scope.id = $stateParams.taskId;
    $scope.$currentTask = $scope.$storage.patient.assignedTherapyTasks[$scope.id];

    $http.get("/therapyTaskAPI/" + $scope.$currentTask.PatternID).success(function (response) {
      $scope.taskPattern = response;
    }).error(function (res) {
      console.log("API Zugriff fehlgeschlagen");
      console.log(res);
    });

    $scope.pickFromTime = function () {
      ionicTimePicker.openTimePicker({
        callback: function (val) {
          var newTime = new Date(val);
          newTime.setHours(newTime.getHours()-1);
          $scope.$currentTask.ActualContext.FromTime = newTime;
          console.log($scope.$currentTask.ActualContext.FromTime);
        },
        inputTime: new Date($scope.$currentTask.ActualContext.FromTime).getHours() * 60 * 60 + new Date($scope.$currentTask.ActualContext.FromTime).getMinutes() * 60
      })
    };

    $scope.pickToTime = function () {
      ionicTimePicker.openTimePicker({
        callback: function (val) {
          var newTime = new Date(val);
          newTime.setHours(newTime.getHours()-1);
          $scope.$currentTask.ActualContext.ToTime = newTime;
        },
        inputTime: new Date($scope.$currentTask.ActualContext.ToTime).getHours() * 60 * 60 + new Date($scope.$currentTask.ActualContext.ToTime).getMinutes() * 60
      });
    };

    $scope.saveActualTime = function () {
      $http.put("/patientAPI/" + $scope.$storage.patient._id, $scope.$storage.patient)
        .success(function(response){
          console.log("eigenes  Zeitinterval auf server gespeichert");
        });
    };
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
    if (typeof $scope.$storage.patient != "undefined") {
      //$scope.isNameFormDisabled = true;
    }

    //http://192.168.40.106:3000/
    //http://192.168.10.100:3000/
    $http.get("/patientAPI").success(function (response) {
      console.log("success!!!");
      $scope.patients = response;
    }).error(function (res) {
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
          {text: 'Cancel'},
          {
            text: '<b>Save</b>', type: 'button-positive',
            onTap: function (e) {
              if (!$scope.input.name) {
                e.preventDefault();  //don't allow the user to close unless he enters model...
              } else {
                console.log("lalala");
                $scope.searchResult = {};
                $scope.searchResult = $.grep($scope.patients, function (patients) {
                  return patients.name == $scope.input.name;
                });
                if ($scope.searchResult.length > 0) {
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






