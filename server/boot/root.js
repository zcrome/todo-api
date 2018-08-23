'use strict';

module.exports = function(app) {
  // Install a `/` route that returns server status
  var router = app.loopback.Router();

  var ToDo = app.models.ToDo;
  var ToDoUser = app.models.ToDoUser;
  var Token = app.models.AccessToken;
  var Note = app.models.Note;

  function okResponseToClient(responseToClient) {
    responseToClient.code = 200;
    responseToClient.message = 'OK';
  }

  function serverFailResponseToClient(responseToClient) {
    responseToClient.code = 500;
    responseToClient.message = 'Ocurrió un problema, inténtelo más tarde';
  }

  router.post('/api/user-todos', function (req, res) {
    // accessToken string   params
    // userId number        params
    //local vars
		var responseToClient = {
			code: 500,
			todos: []
    };

    if (!req.body.accessToken) {
			serverFailResponseToClient(responseToClient);
			return res.json(responseToClient);
    }
    
    if (!req.body.userId) {
			serverFailResponseToClient(responseToClient);
			return res.json(responseToClient);
		}
    
    Token.findById(req.body.accessToken, function (err, token) {
      if (err) {
        serverFailResponseToClient(responseToClient);
        return res.json(responseToClient);
      }

      if (token) {
        var query = {
          where: {
            and: [{
              toDoUserId: token.toDoUserId
            }, {
              isDeleted: false
            }]
          },
          include: "tasks"
        };

        ToDo.find(query, function (err, todos) {
          if (err) {
						serverFailResponseToClient(responseToClient);
						return res.json(responseToClient);
          }
          responseToClient.todos = todos
          okResponseToClient(responseToClient);
					return res.json(responseToClient);
        });
      }else{
        serverFailResponseToClient(responseToClient);
				return res.json(responseToClient);
      }
    });
  });


  router.post('/api/user-notes', function (req, res) {
    // accessToken string   params
    // userId number        params
    //local vars
		var responseToClient = {
			code: 500,
			todos: []
    };

    if (!req.body.accessToken) {
			serverFailResponseToClient(responseToClient);
			return res.json(responseToClient);
    }
    
    if (!req.body.userId) {
			serverFailResponseToClient(responseToClient);
			return res.json(responseToClient);
		}
    
    Token.findById(req.body.accessToken, function (err, token) {
      if (err) {
        serverFailResponseToClient(responseToClient);
        return res.json(responseToClient);
      }

      if (token) {
        var query = {
          where: {
            toDoUserId: token.toDoUserId
          }
        };

        Note.find(query, function (err, notes) {
          if (err) {
						serverFailResponseToClient(responseToClient);
						return res.json(responseToClient);
          }
          responseToClient.notes = notes
          okResponseToClient(responseToClient);
					return res.json(responseToClient);
        });
      }else{
        serverFailResponseToClient(responseToClient);
				return res.json(responseToClient);
      }
    });
  });





  app.use(router);
};
