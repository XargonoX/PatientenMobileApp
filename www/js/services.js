angular.module('patientApp.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})
  .factory('TranslateDayNames', function() {
    return {
      trans: function(german) {
        var english = "Init";
        switch(german){
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
  }})
  .factory('TranslateDayNamesToNumber', function() {
    return {
      trans: function(german) {
        var number;
        switch(german){
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
  }
);
