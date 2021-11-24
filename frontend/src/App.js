import React, { Component } from 'react';
import Terminal from 'terminal-in-react';
 
/* checkResponse will print update the authenticated variable and will print
   the flag if the response code is ok */
const checkResponse = (response, authenticated, print) => {
   if (response.status === 200) {
      authenticated.login = true
      print('Login Complete: Welcome Back Ralph')
      print('Flag{31:HACKINGTHEHACKERS!}')
   }
   return response.json()
}

class App extends Component {

// The variable to keep track of the user's authentication status
   authenticated = {login: false}

   /* This function will run an API call with the user's inputted email and
      password. */
   login = (args, print, runCommand, authenticated) => {
      if (authenticated.login) {
         print('Error: Already Logged In')
      }
      else {
         print('Executing login...')
         const username = prompt('Username:')
         const password = prompt('Password:')
         fetch('http://localhost:4000/login', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify({username: username, password: password})
          }).then(result => checkResponse(result, authenticated, print)).then(data => print(data.output));
      }
  }

  // A command that prints some text for the users
  readme = (args, print, runCommand) => {
     print('Welcome hackers, sign in and let\'s get this party started')
  }
 
  render() {

/* Returns the Terminal page with arguments specifying the commands and 
   style. */

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}
      >
        <Terminal
          color='#00FF00'
          backgroundColor='#000000'
          style={{ fontWeight: "bold", fontSize: "1em" }}
          commands={{
            login: (args, print, runCommand) => this.login(args, print, runCommand, this.authenticated),
            'README.txt': (args, print, runCommand) => this.readme(args, print, runCommand),
          }}
          descriptions={{
            'login': 'attempt to log in into the Unwanted Guest Chatroom',
            'show': 'print the welcome message',
            'README.txt': 'opens the provided text file',
          }}
          msg='Welcome to the Unwanted Guest Terminal, run the command "help" to list all available commands.'
          prompt='#00FF00'
          promptSymbol='>>>'
          startState='maximised'
          barColor='#E2E0E2'
         //  hideTopBar={true}
         //  allowTabs={false}
         //  showActions={false}
        />
      </div>
    );
  }
}

export default App;
