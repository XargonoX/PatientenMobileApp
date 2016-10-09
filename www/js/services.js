angular.module('patientApp.services', ["ngAnimate", "ngSanitize", "ngMaterial", "ngStorage"])
  .constant('ApiServer', {
    url: "" //http://192.168.40.105:3000/
  })
  .factory('patientApi', function (ApiServer, $http, $localStorage) {

    return {
      all: function () {
        $http.get(ApiServer.url + "patientAPI").success(function (response) {
          console.log("patient api success");
          $localStorage.allPatients = response;
          return response;
        }).error(function (err) {
          console.log("patient API Fehler!");
          return err;
        });
      },
      get: function (patientId) {
        $http.get(ApiServer.url + "patientAPI/" + patientId).success(function (response) {
          return response;
        }).error(function (err) {
          console.log("patient API Fehler!");
          return err;
        });
      },
      me: function () {
        $http.get(ApiServer.url + "patientAPI/" + $localStorage.patient._id).success(function (response) {
          $localStorage.patient = response;
          return $localStorage.patient;
        }).error(function (err) {
          console.log("patient API Fehler!");
          return err;
        });
      },
      remove: function (patientId) {
        $http.delete(ApiServer.url + "patientAPI/" + patientId).success(function (response) {
          console.log("patient gelöscht");
          return true;
        }).error(function () {
          console.log("patient API Fehler!");
          return false;
        });
      },
      create: function (patient) {
        $http.post("http://localhost:3000/patientAPI", patient)
          .success(function (response) {
            console.log("Neuen Patient angelegt");
            return true;
          }).error(function () {
          console.log("patient API Fehler!");
          return false;
        });
      },
      update: function (patientId, patient) {
        $http.put("http://localhost:3000/patientAPI/" + patientId, patient)
          .success(function (response) {
            console.log("Patient editiert");
            return true;
          }).error(function () {
          console.log("patient API Fehler!");
          return false;
        });
      }
    }
  })
  .factory('therapyTaskApi', function (ApiServer, $http, $localStorage) {

    function makeRequest(callback) {
      $.ajax({
        url: "therapyTaskAPI",
        //data: {id: id},
        complete: callback
        //async : false
      });
    }

    makeRequest(function (data) {
      $localStorage.therapyTaskPatterns = JSON.parse(data.responseText);
    });
    return {
      all: function () {
        return $localStorage.therapyTaskPatterns;
      },
      get: function (patientId) {
        $http.get(ApiServer.url + "therapyTaskAPI/" + patientId).success(function (response) {
          return response;
        }).error(function (err) {
          console.log("therapyTask API Fehler!");
          return err;
        });
      },
      remove: function (patientId) {
        $http.delete(ApiServer.url + "therapyTaskAPI/" + patientId).success(function (response) {
          console.log("therapyTask gelöscht");
          return true;
        }).error(function () {
          console.log("therapyTask API Fehler!");
          return false;
        });
      },
      create: function (patient) {
        $http.post("http://localhost:3000/therapyTaskAPI", patient)
          .success(function (response) {
            console.log("Neuer Questionnaire angelegt");
            return true;
          }).error(function () {
          console.log("patient API Fehler!");
          return false;
        });
      },
      update: function (patientId, patient) {
        $http.put("http://localhost:3000/therapyTaskAPI/" + patientId, patient)
          .success(function (response) {
            console.log("Questionnaire editiert");
            return true;
          }).error(function () {
          console.log("patient API Fehler!");
          return false;
        });
      }
    }
  })
  .factory('questionnaireApi', function (ApiServer, $http, $localStorage) {
    $http.get(ApiServer.url + "questionnaireAPI").success(function (response) {
      $localStorage.allquestionnaires = response;
    }).error(function (err) {
      console.log("therapyTask API Fehler!");
      return err;
    });
    return {
      all: function () {
        return $localStorage.allquestionnaires;
      },
      get: function (patientId) {
        return $.grep($localStorage.allquestionnaires, function (e, x) {
          return e._id == patientId;
        });
      },
      remove: function (patientId) {
        $http.delete(ApiServer.url + "questionnaireAPI/" + patientId).success(function (response) {
          console.log("therapyTask gelöscht");
          return true;
        }).error(function () {
          console.log("therapyTask API Fehler!");
          return false;
        });
      },
      create: function (patient) {
        $http.post(ApiServer.url + "questionnaireAPI", patient)
          .success(function (response) {
            console.log("Neuer Questionnaire angelegt");
            return true;
          }).error(function () {
          console.log("patient API Fehler!");
          return false;
        });
      },
      update: function (patientId, patient) {
        $http.put(ApiServer.url + "questionnaireAPI/" + patientId, patient)
          .success(function (response) {
            console.log("Questionnaire editiert");
            return true;
          }).error(function () {
          console.log("patient API Fehler!");
          return false;
        });
      }
    }
  })
  .factory('TranslateDayNames', function () {
    return {
      trans: function (german) {
        var english = "Init";
        switch (german) {
          case "Montag":
            english = "monday";
            break;
          case "Dienstag":
            english = "tuesday";
            break;
          case "Mittwoch":
            english = "wednesday";
            break;
          case "Donnerstag":
            english = "thursday";
            break;
          case "Freitag":
            english = "friday";
            break;
          case "Samstag":
            english = "saturday";
            break;
          case "Sonntag":
            english = "sunday";
            break;
        }
        return english;
      }
    }
  })
  .factory('TranslateDayNamesToNumber', function () {
    return {
      trans: function (german) {
        var number;
        switch (german) {
          case "Montag":
            number = 1;
            break;
          case "Dienstag":
            number = 2;
            break;
          case "Mittwoch":
            number = 3;
            break;
          case "Donnerstag":
            number = 4;
            break;
          case "Freitag":
            number = 5;
            break;
          case "Samstag":
            number = 6;
            break;
          case "Sonntag":
            number = 7;
            break;
        }
        return number;
      }
    };
  })
  .factory('questionnaireHelper', function () {
      var isAnArray = function (obj) {
        return (typeof obj !== 'undefined' && obj !== null && typeof obj.length === 'number' && typeof obj != "string");
      };

      var findSequenceFlowById = function (questionnaireObject, SeFlowId) {
        return $.grep(questionnaireObject.definitions.process.sequenceFlow, function (e) {
          return e.id == SeFlowId;
        });
      };
      var findAnswerById = function (questionnaireObject, AnswerId) {
        return $.grep(questionnaireObject.definitions.process.task, function (e) {
          return e.id == AnswerId;
        });
      };
      var findQuestionById = function (questionnaireObject, QuestionId) {
        return $.grep(questionnaireObject.definitions.process.exclusiveGateway, function (e) {
          return e.id == QuestionId;
        })[0];
      };
      var findQuestionType = function (Question) {

        if (isAnArray(Question.extensionElements.camundaproperties.camundaproperty)) {
          console.log("isArray");
          return $.grep(Question.extensionElements.camundaproperties.camundaproperty, function (e) {
            return e.name == "type";
          })[0].value;
        } else {
          console.log("isKoiArray");
          if (Question.extensionElements.camundaproperties.camundaproperty.name == "type") {
            return Question.extensionElements.camundaproperties.camundaproperty.value;
          }
        }
      };
      return {
        getStart: function (questionnaireObject) {

          return questionnaireObject.definitions.process.startEvent;
        },

        getNextQuestion: function (questionnaireObject, answerObj) {
          var flowId = answerObj.outgoing;
          var seFlow = findSequenceFlowById(questionnaireObject, flowId);
          return findQuestionById(questionnaireObject, seFlow[0].targetRef);
        },

        getQuestionType: function (inQuestion) {
          return findQuestionType(inQuestion);
        },

        getPossibleAnswers: function (questionnaireObject, inQuestion) {
          var result = [];
          if(isAnArray(inQuestion.outgoing)){
            console.log("isAhNArray");
            console.log(typeof inQuestion.outgoing);
            for (var i = 0; i < inQuestion.outgoing.length; i++) {
              result.push(findAnswerById(questionnaireObject,
                findSequenceFlowById(questionnaireObject, inQuestion.outgoing[i])[0].targetRef)[0]);
            }
          } else {
            result.push(findAnswerById(questionnaireObject,
              findSequenceFlowById(questionnaireObject, inQuestion.outgoing)[0].targetRef)[0]);
          }

          return result;
        },
        getQuestionObjById: function (questionnaireObject, inQuestionId) {
          return findQuestionById(questionnaireObject, inQuestionId);

        },
        getAnswerObjById: function (questionnaireObject, inAnswerId) {
          return findAnswerById(questionnaireObject, inAnswerId)[0];

        }
      };
    }
  );

