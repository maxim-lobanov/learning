# ReactBootcamp
Application was implemented as a part of "ReactJS bootcamp" to look into JavaScript and ReactJS  
Mockups: https://ninjamock.com/s/SFN77Wx  
Application has 4 screens:
1. Login screen:
It is just a dummy login screen with hardcoded credentials (admin - admin)
Checkbox "rememberme" saves info about successful authorization to localStorage.
2. Home screen:
Simple screen that contains "Hello, %USERNAME%!"
3. People screen: 
This page contains a list of all users and buttons to add/remove them from my team.
You can use input to filter users by `USER_FIRSTNAME + ' ' + USER_LASTNAME`
4. My team screen:
This page contains list of user in my team with the same actions as people page.

Source code was refactored in accordance with ESLINT with airbnb settings.  
"Toast" is used to show notifications to user.  
"axios" is used to perform requests to server.  
"bootstrap" is used for layout.  
  
## How build
Skeleton of application was generated by "react-scripts", so just run `npm start` to run application

