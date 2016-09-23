angular.module('patientApp.controllers', ["ngAnimate", "ngSanitize", "ngMaterial", "ngStorage", "ui.router"])
  .filter('hrefToJS', function ($sce, $sanitize) {
    return function (text) {
      var regex = /href="([\S]+)"/g;
      var newString = $sanitize(text).replace(regex, "onClick=\"window.open('$1', '_blank', 'location=yes')\"");
      return $sce.trustAsHtml(newString);
    }
  })

  .controller('TaskListCtrl', function (TranslateDayNamesToNumber, $scope, $http, $localStorage, $state, $cordovaLocalNotification) {
    console.log("Peng  /===/>***************D");
    $scope.$storage = $localStorage;
    //Patientendaten abrufen
    $http.get("http://134.60.167.209:3000/patientAPI/" + $scope.$storage.patient._id).success(function (response) { ///////////////////////////////////////////////////////////////////////////////
      $scope.$storage.patient = response;
    }).error(function (res) {
      console.log("API Zugriff fehlgeschlagen: " + res);
    });
    var $tasks = $scope.$storage.patient.assignedTherapyTasks;

    //Daten der bevorstehenden Tasks berechnen
    var taskDateContainer = [];
    var internalTaskId = 0;
    for(var i = 0; i < $tasks.length; i++){
      var taskTime = new Date($tasks[i].ActualContext.FromTime);
      var taskDate = new Date();
      taskDate.setHours(taskTime.getHours());
      taskDate.setMinutes(taskTime.getMinutes());
      for(var d = 0; d < $tasks[i].ActualContext.OnWeekdays.length; d++) {
        var day = TranslateDayNamesToNumber.trans($tasks[i].ActualContext.OnWeekdays[d]);
        var dayDistance;
        if (taskDate.getDay() > day) {
          var temp = 7 - taskDate.getDay();
          dayDistance = day + temp;
        } else {
          dayDistance = day - taskDate.getDay();
        }
        taskDate.setDate(taskDate.getDate() + dayDistance);
        console.log("taskDate aft: " + taskDate);
        taskDateContainer.push(taskDate);
/*
         $cordovaLocalNotification.schedule({
         id : internalTaskId,
         date: taskDate,
         message: $tasks[i].Pattern,
         autoCancel: true,
         title: "Das Zeitinterval für ihre Übung hat begonnen"
         }).then(function () {
         console.log("Alarm set!");
         });
*/
      }
    }

    $scope.addLocalNotification = function(){
      var alarmTime = new Date();
      alarmTime.setMinutes(alarmTime.getMinutes()+1);
      $cordovaLocalNotification.add({
        id: 1,
        title: "Production Jour fixe",
        text: "Duration 1h",
        at: alarmTime
      }).then(function () {
        console.log("Alarm set!");
      });
    };
    $scope.cancelLocalNotifications = function(){
      $cordovaLocalNotification.cancelAll();
    };


  })

  .controller('TaskDetailCtrl', function ($scope, $stateParams, $localStorage, $http, ionicTimePicker) {
    $scope.$storage = $localStorage;
    $scope.id = $stateParams.taskId;
    $scope.$currentTask = $scope.$storage.patient.assignedTherapyTasks[$scope.id];

    $http.get("http://134.60.167.209:3000/therapyTaskAPI/" + $scope.$currentTask.PatternID).success(function (response) {
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
      $http.put("http://134.60.167.209:3000/patientAPI/" + $scope.$storage.patient._id, $scope.$storage.patient)
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
    $http.get("http://134.60.167.209:3000/patientAPI").success(function (response) {
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






