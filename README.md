# Blog
Simple blog platform. For backend I used NodeJS, frontend Angular and for storage Firebase.
The way this system works is that frontend (Angular) sends requests to the backend (NodeJS) and then 
Node handles everything with Firebase.


### Current status of the project
You can see all posts on the home page, you can click on one of the posts to see detailed view. In that view
you can see all the information about post, comments and input fields to add new comments. Also you can add 
new posts as anonymous user (for now register and login options don't work).

### How to use
Clone the repository wherever you like.  
`git clone https://github.com/boris-ns/Blog`  
First run the service using node or nodemon.  
`cd service`  
`node app.js`  
And then you can run client app.  
`cd client`  
`ng serve -o`

### Screenshots

![Home page screenshot](/screenshots/home_page.PNG?raw=true "Home page")  
![Post details screenshot](/screenshots/post_details_view.PNG?raw=true "Post details view")