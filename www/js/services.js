angular.module('patientApp.services', ["ngAnimate", "ngSanitize", "ngMaterial", "ngStorage"])
  .constant('ApiServer', {
    url: "http://192.168.40.105:3000/" //http://192.168.40.105:3000/
  })

  .factory('patientApi', function (ApiServer, $http, $localStorage) {
    return {
      getAll: function () {
        if(typeof $localStorage.allPatients === "undefined"){
          $http.get(ApiServer.url + "patientAPI/").success(function (response) {
            console.log("patient api success");
            console.log(response);
            $localStorage.allPatients = response;
          }).error(function (err) {
            console.log("patient API Fehler!");
            return err;
          });
        }
        return $localStorage.allPatients;
      },
      get: function (patientId) {
        $http.get(ApiServer.url + "patientAPI/" + patientId).success(function (response) {
          console.log(response);
          return response;
        }).error(function (err) {
          console.log("patient API Fehler!");
          return err;
        });
      },
      getSelected: function () {
      console.log(typeof $localStorage.patient);
        if(typeof $localStorage.patient === "undefined"){
        console.log("zuerst Patient wählen");
          return "undefined";
        } else {
          $http.get(ApiServer.url + "patientAPI/" + $localStorage.patient._id).success(function (response) {
            $localStorage.patient = response;
            return $localStorage.patient;
          }).error(function (err) {
            console.log("patient API Fehler!");
            return err;
          });
        }
        return $localStorage.patient;
      },
      saveSelected: function (PatientObj) {
        $localStorage.patient = PatientObj;
        var success = true;
        $http.put(ApiServer.url + "patientAPI/" + PatientObj._id, PatientObj)
          .success(function (response) {
            console.log("Patient editiert");
            success = true;
          }).error(function () {
            console.log("patient API Fehler!");
            success = false;
        });
        console.log(success);
        return success;
      },
      remove: function (patientId) {
        $http.delete(ApiServer.url + "patientAPI/" + patientId).success(function (response) {
          console.log(response);
          console.log("patient gelöscht");
          return true;
        }).error(function () {
          console.log("patient API Fehler!");
          return false;
        });
      },
      create: function (patient) {
        $http.post(ApiServer.url + "patientAPI/", patient)
          .success(function (response) {
            console.log("Neuen Patient angelegt");
            return true;
          }).error(function () {
          console.log("patient API Fehler!");
          return false;
        });
      },
      update: function (patientId, patient) {
        $http.put(ApiServer.url + "patientAPI/" + patientId, patient)
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
    return {
      all: function (forceUpdate) {
        if(typeof $localStorage.allTherapyTasks === "undefined" || forceUpdate ||
            $localStorage.therapyTaskLastUpdate.getDate() != new Date().getDate() ){
        $http.get(ApiServer.url + "therapyTaskAPI/").success(function (response) {
          console.log("TT Api all succ");
          console.log(response);
          $localStorage.allTherapyTasks = response;
          $localStorage.therapyTaskLastUpdate = new Date();
        }).error(function (err) {
          console.log("therapyTask API Fehler!");
          return err;
        });
      }
      return $localStorage.allTherapyTasks;
      },
      get: function (therapyTaskId) {
        var searchResult = $.grep($localStorage.allTherapyTasks, function (e, x) {
                return e._id == therapyTaskId;
              });
        if(searchResult.length > 0){
          console.log("return searchResult");
          return searchResult[0];
        } else {
          $http.get(ApiServer.url + "therapyTaskAPI/" + therapyTaskId).success(function (response) {
            console.log(response);
            return response;
          }).error(function (err) {
            console.log("therapyTask API Fehler!");
            return err;
          });
        }
      },
      remove: function (therapyTaskId) {
        $http.delete(ApiServer.url + "therapyTaskAPI/" + therapyTaskId).success(function (response) {
          console.log("therapyTask gelöscht");
          return true;
        }).error(function () {
          console.log("therapyTask API Fehler!");
          return false;
        });
      },
      create: function (therapyTask) {
        $http.post(ApiServer.url + "therapyTaskAPI/", therapyTask)
          .success(function (response) {
            console.log("Neuer therapyTask angelegt");
            return true;
          }).error(function () {
          console.log("therapyTask API Fehler!");
          return false;
        });
      },
      update: function (therapyTaskId, therapyTask) {
        $http.put(ApiServer.url + "therapyTaskAPI/" + therapyTaskId, therapyTask)
          .success(function (response) {
            console.log("therapyTask editiert");
            return true;
          }).error(function () {
          console.log("therapyTask API Fehler!");
          return false;
        });
      }
    }
  })
  .factory('questionnaireApi', function (ApiServer, $http, $localStorage) {
    $http.get(ApiServer.url + "questionnaireAPI/").success(function (response) {
      $localStorage.allquestionnaires = response;
    }).error(function (err) {
      console.log("Questionnaire API Fehler!");
      return err;
    });
    return {
      all: function () {
        return $localStorage.allquestionnaires;
      },
      get: function (questionnaireId) {
        return $.grep($localStorage.allquestionnaires, function (e, x) {
          return e._id == questionnaireId;
        });
      },
      remove: function (questionnaireId) {
        $http.delete(ApiServer.url + "questionnaireAPI/" + questionnaireId).success(function (response) {
          console.log("Questionnaire gelöscht");
          return true;
        }).error(function () {
          console.log("Questionnaire API Fehler!");
          return false;
        });
      },
      create: function (questionnaire) {
        $http.post(ApiServer.url + "questionnaireAPI/", questionnaire)
          .success(function (response) {
            console.log("Neues Questionnaire angelegt");
            return true;
          }).error(function () {
          console.log("Questionnaire API Fehler!");
          return false;
        });
      },
      update: function (questionnaireId, questionnaire) {
        $http.put(ApiServer.url + "questionnaireAPI/" + questionnaireId, questionnaire)
          .success(function (response) {
            console.log("Questionnaire editiert");
            return true;
          }).error(function () {
          console.log("Questionnaire API Fehler!");
          return false;
        });
      }
    }
  })
  .factory('answeredQuestionnaireApi', function (ApiServer, $http, $localStorage) {
    $http.get(ApiServer.url + "answeredQuestionnaireApi/").success(function (response) {
      $localStorage.allAnsweredQuestionnaires = response;
    }).error(function (err) {
      console.log("AnsweredQuestionnaire API Fehler!");
      return err;
    });
    return {
      all: function () {
        return $localStorage.allAnsweredQuestionnaires;
      },
      get: function (answeredQuestionnaireId) {
        return $.grep($localStorage.allAnsweredQuestionnaires, function (e, x) {
          return e._id == answeredQuestionnaireId;
        });
      },
      remove: function (answeredQuestionnaireId) {
        $http.delete(ApiServer.url + "answeredQuestionnaireApi/" + answeredQuestionnaireId).success(function (response) {
          console.log("AnsweredQuestionnaire gelöscht");
          return true;
        }).error(function () {
          console.log("AnsweredQuestionnaire API Fehler!");
          return false;
        });
      },
      create: function (answeredQuestionnaire) {
        $http.post(ApiServer.url + "answeredQuestionnaireApi/", answeredQuestionnaire)
          .success(function (response) {
            console.log("Neue AnsweredQuestionnaire angelegt");
            return true;
          }).error(function () {
          console.log("AnsweredQuestionnaire API Fehler!");
          return false;
        });
      },
      update: function (answeredQuestionnaireId, answeredQuestionnaire) {
        $http.put(ApiServer.url + "answeredQuestionnaireApi/" + answeredQuestionnaireId, answeredQuestionnaire)
          .success(function (response) {
            console.log("AnsweredQuestionnaire editiert");
            return true;
          }).error(function () {
          console.log("AnsweredQuestionnaire API Fehler!");
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
        })[0];
      };
      var findAnswerById = function (questionnaireObject, AnswerId) {
        return $.grep(questionnaireObject.definitions.process.task, function (e) {
          return e.id == AnswerId;
        })[0];
      };
      var findQuestionById = function (questionnaireObject, QuestionId) {
        return $.grep(questionnaireObject.definitions.process.exclusiveGateway, function (e) {
          return e.id == QuestionId;
        })[0];
      };
      var findQuestionType = function (Question) {

        if (isAnArray(Question.extensionElements.camundaproperties.camundaproperty)) {
          return $.grep(Question.extensionElements.camundaproperties.camundaproperty, function (e) {
            return e.name == "type";
          })[0].value;
        } else {
          if (Question.extensionElements.camundaproperties.camundaproperty.name == "type") {
            return Question.extensionElements.camundaproperties.camundaproperty.value;
          }
        }
      };
      return {
        getStart: function (questionnaireObject) {

          return questionnaireObject.definitions.process.startEvent;
        },

        getNextQuestionObj: function (questionnaireObject, answerObj) {
          var flowId = answerObj.outgoing;
          var sequenceFlow = findSequenceFlowById(questionnaireObject, flowId);
          if(sequenceFlow.targetRef.search("EndEvent") > -1){
            return questionnaireObject.definitions.process.endEvent;
          } else {
            return findQuestionById(questionnaireObject, sequenceFlow.targetRef);
          }

        },

        getQuestionType: function (inQuestion) {
          return findQuestionType(inQuestion);
        },

        getPossibleAnswers: function (questionnaireObject, inQuestion) {
          var result = [];
          if (isAnArray(inQuestion.outgoing)) {
            for (var i = 0; i < inQuestion.outgoing.length; i++) {
              result.push(findAnswerById(questionnaireObject,
                findSequenceFlowById(questionnaireObject, inQuestion.outgoing[i]).targetRef));
            }
          } else {
            result.push(findAnswerById(questionnaireObject,
              findSequenceFlowById(questionnaireObject, inQuestion.outgoing).targetRef));
          }
          return result;
        },

        getQuestionObjById: function (questionnaireObject, inQuestionId) {
          return findQuestionById(questionnaireObject, inQuestionId);
        },

        getAnswerObjById: function (questionnaireObject, inAnswerId) {
          return findAnswerById(questionnaireObject, inAnswerId);

        }
      };
    }
  );

