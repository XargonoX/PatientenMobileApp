angular.module('patientApp.controllers',
  ["ngAnimate", "ngSanitize", "ngMaterial", "ngStorage", "ui.router", "textAngular"])
  .filter('hrefToJS', function ($sce, $sanitize) {
    return function (text) {
      var regex = /href="([\S]+)"/g;
      var newString = $sanitize(text).replace(regex, "onClick=\"window.open('$1', '_blank', 'location=yes')\"");
      return $sce.trustAsHtml(newString);
    }
  })


  //******************************************************************************************
  //Task List Controller
  //******************************************************************************************

  .controller('TaskListCtrl', function (TranslateDayNamesToNumber, $scope, $rootScope,
                                        $http, $localStorage, $state,
                                        $cordovaLocalNotification, $ionicLoading,
                                        patientApi, therapyTaskApi, questionnaireApi) {
    $scope.$storage = $localStorage;
    $scope.$on("$ionicView.beforeEnter", function(event, data){
      $ionicLoading.show({
        template: 'Daten werden vom Server geladen...'
      }).then(function(){
        $scope.patient = patientApi.getSelected();
        $scope.therapyTaskPatterns = therapyTaskApi.all(false);
        $scope.existingQuestionnaire = questionnaireApi.all();
      });
        $ionicLoading.hide();
    });

    //Patientendaten abrufen

    $scope.getTaskById = function (TaskId) {
      return $.grep(therapyTaskApi.all(false), function (e, x) {
        return e._id == TaskId;
      });

    };
    $scope.getQuestionnaireById = function (questionnaireId) {
      return $.grep(questionnaireApi.all(), function (e, x) {
        return e._id == questionnaireId;
      });
    };

    $scope.tasks = $scope.$storage.patient.assignedTherapyTasks;
 $scope.addAllLocalNotification = function () {
    //Daten der bevorstehenden Tasks berechnen
    var taskDateContainer = [];
    var internalTaskId = 0;
    var notifications = [];
    for (var i = 0; i < $scope.tasks.length; i++) {
      var taskTime = new Date($scope.tasks[i].ActualContext.FromTime);
      for (var d = 0; d < $scope.tasks[i].ActualContext.OnWeekdays.length; d++) {
        var taskDate = new Date();
        taskDate.setHours(taskTime.getHours());
        taskDate.setMinutes(taskTime.getMinutes());
        taskDate.setSeconds(0);
        var day = TranslateDayNamesToNumber.trans($scope.tasks[i].ActualContext.OnWeekdays[d]);
        var dayDistance = 0;
        if (taskDate.getDay() > day) {
          var temp = 7 - taskDate.getDay();
          dayDistance = day + temp;
        } else {
          dayDistance = day - taskDate.getDay();
        }
        taskDate.setDate(taskDate.getDate() + dayDistance);
        console.log(taskDate);
        //console.log("taskDate aft: " + taskDate + "(dayDist: " + dayDistance);
        taskDateContainer.push(taskDate);
        var taskTitle = $scope.tasks[i].Pattern;
        var taskPatternId = $scope.tasks[i].PatternId;
        var questionnaireId = $scope.tasks[i].assignedQuestionnaire;
        console.log("questionnaireId: " + questionnaireId);

        //notifications.push
        $cordovaLocalNotification.schedule({
          id: internalTaskId,
          //every : "week",
          title: taskTitle,
          text: "Das Zeitinterval für ihre Übung hat begonnen",
          at: taskDate,
          data: {
            taskPatternId: taskPatternId,
            questionnaireId: questionnaireId
          }
        });
        internalTaskId++;
      }
    }
    };
/*
    $scope.addAllLocalNotification = function () {
      console.log("addAll");
      notifications[0].at = taskDate;
      console.log(notifications);

        $cordovaLocalNotification.schedule(notifications).then(function () {
          console.log("Notifications erstellt");
        });
    }
    $scope.cancelLocalNotifications = function () {
      $cordovaLocalNotification.cancelAll();
      console.log("Nots geloescht");
    };
*/
    $scope.addSoonNotification = function () {
      var soonDate = new Date();
      soonDate.setSeconds(soonDate.getSeconds() + 15);
      cordova.plugins.notification.local.schedule({
        id: 1987,
        title: "Soon Notification Incoming!",
        text: "Des geht ja!",
        at: soonDate,
        data: {
          QuestionnaireId: "57e795d2db97f7bd0ee6564a"
        }
      });
    };

    $rootScope.$on('$cordovaLocalNotification:click',
      function (event, notification, state) {
        $state.go("questionnaire-show", {questionnaireId: notification.data.QuestionnaireId});
      });

  })

  //******************************************************************************************
  //Task Details Controller
  //******************************************************************************************

  .controller('TaskDetailCtrl', function ($scope, $stateParams, $localStorage,
                                          $http, $state, $ionicPopup, ApiServer,
                                          ionicTimePicker, therapyTaskApi, patientApi) {

    $scope.$on("$ionicView.beforeEnter", function(event, data){
      $scope.patient = patientApi.getSelected();
      $scope.$currentTask = $scope.patient.assignedTherapyTasks[$stateParams.taskId];
      $scope.taskPattern = therapyTaskApi.get($scope.$currentTask.PatternId);
    });

    $scope.pickFromTime = function () {
      ionicTimePicker.openTimePicker({
        callback: function (val) {
          var newTime = new Date();
          newTime.setHours(Math.floor(val / 3600));
          newTime.setMinutes((val % 3600) / 60);
          $scope.$currentTask.ActualContext.FromTime = newTime;
        },
        inputTime: new Date($scope.$currentTask.ActualContext.FromTime).getHours() * 60 * 60 + new Date($scope.$currentTask.ActualContext.FromTime).getMinutes() * 60
      })
    };

    $scope.pickToTime = function () {
      ionicTimePicker.openTimePicker({
        callback: function (val) {
          var newTime = new Date();
          newTime.setHours(Math.floor(val / 3600));
          newTime.setMinutes((val % 3600) / 60);
          $scope.$currentTask.ActualContext.ToTime = newTime;
        },
        inputTime: new Date($scope.$currentTask.ActualContext.ToTime).getHours() * 60 * 60 + new Date($scope.$currentTask.ActualContext.ToTime).getMinutes() * 60
      });
    };

    $scope.saveActualTime = function () {
      if(patientApi.saveSelected($scope.patient) === true){
        $ionicPopup.alert({
          title: 'Wurde gespeichert'
        });
      $state.go("/tab/taskList");
      } else {
        $ionicPopup.alert({
          title: 'Speichern auf server Fehlgeschlagen'
        });
      }
    }
  })

  //******************************************************************************************
  //Profil Controller
  //******************************************************************************************

  .controller('ProfileCtrl', function ($scope) {
    //$scope.$on('$ionicView.enter', function(e) {
    //});

  })
  //******************************************************************************************
  //Settings Controller
  //******************************************************************************************

  .controller('SettingsCtrl', function ($scope, $http, $mdDialog, $ionicPopup,
                                        $localStorage, ApiServer, therapyTaskApi, patientApi) {

    $scope.$on("$ionicView.beforeEnter", function(event, data){
      therapyTaskApi.all(true);
      patientApi.getAll();

    });
    $scope.input = {};
    $scope.input.name = "Heiko Foschum";
    $scope.isNameFormDisabled = false;
    $scope.patient = patientApi.getSelected();
    console.log($scope.patient);
    if (patientApi.getSelected() != "undefined") {
      //$scope.isNameFormDisabled = true;
    }

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
                $scope.searchResult = $.grep(patientApi.getAll(), function (patients) {
                  return patients.name == $scope.input.name;
                });
                if ($scope.searchResult.length > 0) {
                  patientApi.saveSelected($scope.searchResult[0]);
                  $scope.patient = $scope.searchResult[0];
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
  })

  //******************************************************************************************
  //Questionnaire Show Controller
  //******************************************************************************************

  .controller('QuestionnaireShowCtrl',
    function ($scope, $http, $state, $stateParams, $sessionStorage, $ionicPopup,
              questionnaireApi, $localStorage, questionnaireHelper, answeredQuestionnaireApi,patientApi) {
      //Hilfsfunktion Quelle http://goessner.net/download/prj/jsonxml/xml2json.js
      var xml2json = function (xml, tab) {
        var X = {
          toObj: function (xml) {
            var o = {};
            if (xml.nodeType == 1) {   // element node ..
              if (xml.attributes.length)   // element with attributes  ..
                for (var i = 0; i < xml.attributes.length; i++)
                  o[xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue || "").toString();
              if (xml.firstChild) { // element has child nodes ..
                var textChild = 0, cdataChild = 0, hasElementChild = false;
                for (var n = xml.firstChild; n; n = n.nextSibling) {
                  if (n.nodeType == 1) hasElementChild = true;
                  else if (n.nodeType == 3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                  else if (n.nodeType == 4) cdataChild++; // cdata section node
                }
                if (hasElementChild) {
                  if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                    X.removeWhite(xml);
                    for (var n = xml.firstChild; n; n = n.nextSibling) {
                      if (n.nodeType == 3)  // text node
                        o["#text"] = X.escape(n.nodeValue);
                      else if (n.nodeType == 4)  // cdata node
                        o["#cdata"] = X.escape(n.nodeValue);
                      else if (o[n.nodeName]) {  // multiple occurence of element ..
                        if (o[n.nodeName] instanceof Array)
                          o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                        else
                          o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                      }
                      else  // first occurence of element..
                        o[n.nodeName] = X.toObj(n);
                    }
                  }
                  else { // mixed content
                    if (!xml.attributes.length)
                      o = X.escape(X.innerXml(xml));
                    else
                      o["#text"] = X.escape(X.innerXml(xml));
                  }
                }
                else if (textChild) { // pure text
                  if (!xml.attributes.length)
                    o = X.escape(X.innerXml(xml));
                  else
                    o["#text"] = X.escape(X.innerXml(xml));
                }
                else if (cdataChild) { // cdata
                  if (cdataChild > 1)
                    o = X.escape(X.innerXml(xml));
                  else
                    for (var n = xml.firstChild; n; n = n.nextSibling)
                      o["#cdata"] = X.escape(n.nodeValue);
                }
              }
              if (!xml.attributes.length && !xml.firstChild) o = null;
            }
            else if (xml.nodeType == 9) { // document.node
              o = X.toObj(xml.documentElement);
            }
            else
              alert("unhandled node type: " + xml.nodeType);
            return o;
          },
          toJson: function (o, name, ind) {
            name = name.replace(":", "");
            var json = name ? ("\"" + name + "\"") : "";
            if (o instanceof Array) {
              for (var i = 0, n = o.length; i < n; i++)
                o[i] = X.toJson(o[i], "", ind + "\t");
              json += (name ? ":[" : "[") + (o.length > 1 ? ("\n" + ind + "\t" + o.join(",\n" + ind + "\t") + "\n" + ind) : o.join("")) + "]";
            }
            else if (o == null)
              json += (name && ":") + "null";
            else if (typeof(o) == "object") {
              var arr = [];
              for (var m in o)
                arr[arr.length] = X.toJson(o[m], m, ind + "\t");
              json += (name ? ":{" : "{") + (arr.length > 1 ? ("\n" + ind + "\t" + arr.join(",\n" + ind + "\t") + "\n" + ind) : arr.join("")) + "}";
            }
            else if (typeof(o) == "string")
              json += (name && ":") + "\"" + o.toString() + "\"";
            else
              json += (name && ":") + o.toString();
            return json;
          },
          innerXml: function (node) {
            var s = ""
            if ("innerHTML" in node)
              s = node.innerHTML;
            else {
              var asXml = function (n) {
                var s = "";
                if (n.nodeType == 1) {
                  s += "<" + n.nodeName;
                  for (var i = 0; i < n.attributes.length; i++)
                    s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue || "").toString() + "\"";
                  if (n.firstChild) {
                    s += ">";
                    for (var c = n.firstChild; c; c = c.nextSibling)
                      s += asXml(c);
                    s += "</" + n.nodeName + ">";
                  }
                  else
                    s += "/>";
                }
                else if (n.nodeType == 3)
                  s += n.nodeValue;
                else if (n.nodeType == 4)
                  s += "<![CDATA[" + n.nodeValue + "]]>";
                return s;
              };
              for (var c = node.firstChild; c; c = c.nextSibling)
                s += asXml(c);
            }
            return s;
          },
          escape: function (txt) {
            return txt.replace(/[\\]/g, "\\\\")
              .replace(/[\"]/g, '\\"')
              .replace(/[\n]/g, '\\n')
              .replace(/[\r]/g, '\\r');
          },
          removeWhite: function (e) {
            e.normalize();
            for (var n = e.firstChild; n;) {
              if (n.nodeType == 3) {  // text node
                if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                  var nxt = n.nextSibling;
                  e.removeChild(n);
                  n = nxt;
                }
                else
                  n = n.nextSibling;
              }
              else if (n.nodeType == 1) {  // element node
                X.removeWhite(n);
                n = n.nextSibling;
              }
              else                      // any other node
                n = n.nextSibling;
            }
            return e;
          }
        };
        if (xml.nodeType == 9) // document node
          xml = xml.documentElement;
        var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
        return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
      };
      var questionnaireObject = JSON.parse(xml2json($.parseXML(questionnaireApi.get($stateParams.questionnaireId)[0].data), ""));
      console.log(questionnaireObject);
      $scope.questionCount = $sessionStorage.questionCount;
      if (typeof $stateParams.questionId == "undefined") {
        $sessionStorage.answeredQuestions = [];
        $scope.question = questionnaireHelper.getNextQuestionObj(questionnaireObject, questionnaireHelper.getStart(questionnaireObject));
      } else {
        $scope.question = questionnaireHelper.getQuestionObjById(questionnaireObject, $stateParams.questionId);
      }
      $scope.questionType = questionnaireHelper.getQuestionType($scope.question);
      $scope.possibleAnswers = questionnaireHelper.getPossibleAnswers(questionnaireObject, $scope.question);

      $scope.hideSingleQuestion = true;
      $scope.hideMultiQuestion = true;
      $scope.hideRatingQuestion = true;
      $scope.hideTextQuestion = true;
      $scope.delectedAnswerId = "nix";

      $scope.radioChanged = function (answerId) {
        console.log("radioChanged");
        $scope.selectedAnswerId = answerId;
      };
      if ($scope.questionType == "single") {
        $scope.hideSingleQuestion = false;
        $scope.answerAdapter = [{
          type : "single",
          answerText: "",
          questionText: $scope.question.name
        }];
      }
      else if ($scope.questionType == "multi") {
        $scope.hideMultiQuestion = false;
        $scope.selectedAnswerId = $scope.possibleAnswers[0].id;
        $scope.answerAdapter = [];
        for (var i = 0; i < $scope.possibleAnswers.length; i++) {
          $scope.answerAdapter.push({
            questionText: $scope.question.name,
            type : "multi",
            answerText: $scope.possibleAnswers[i].name,
            checked: false
          })
        }
      }
      else if ($scope.questionType == "rating") {
        $scope.hideRatingQuestion = false;
        $scope.selectedAnswerId = $scope.possibleAnswers[0].id;
        $scope.answerAdapter = [];
        for (var i = 0; i < $scope.possibleAnswers.length; i++) {
          $scope.answerAdapter.push({
            questionText: $scope.question.name,
            type : "rating",
            answerText: $scope.possibleAnswers[i].name,
            value: 50
          })
        }
      }
      else if ($scope.questionType == "text") {
        $scope.hideTextQuestion = false;
        $scope.selectedAnswerId = $scope.possibleAnswers[0].id;
        $scope.answerAdapter = [];
        for (var i = 0; i < $scope.possibleAnswers.length; i++) {
          $scope.answerAdapter.push({
            questionText: $scope.question.name,
            type : "text",
            answerText: $scope.possibleAnswers[i].name
          })
        }
      }

      $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
          title: 'Vielen Dank!',
          template: 'Das war die letzte Frage viele dank für das ausfüllen des Fragebogens.'
        });

        alertPopup.then(function(res) {
          answeredQuestionnaireApi.create({
            questionnaireId : $stateParams.questionnaireId,
            patientId : patientApi.getSelected._id,
            answeredQuestions : $sessionStorage.answeredQuestions
          });
          $state.go("tab.taskList");
        });
      };

      $scope.goToNextSite = function () {
        var selectedAnswerObj = questionnaireHelper.getAnswerObjById(questionnaireObject, $scope.selectedAnswerId);
        var nextQuestion = questionnaireHelper.getNextQuestionObj(questionnaireObject, selectedAnswerObj);
        if (typeof nextQuestion.outgoing == "undefined") {
          $scope.showAlert();
        } else{
          $sessionStorage.answeredQuestions.push($scope.answerAdapter);
          $state.go("questionnaire-show", {
            questionnaireId: $stateParams.questionnaireId,
            questionId: nextQuestion.id
          });
        }

      }
    });



