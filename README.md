# web-applications-project

This web application is done as a project work for *Advanced Web Applications* course in LUT University. It is a simple website for code snippets.

## Technology requirements
### Backend
* [Node.js](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)

### Frontend
* [React](https://reactjs.org/)
* [MaterialUI](https://mui.com/)

### Authentication
* [JSON Web Tokens](https://jwt.io/)


## Installation

You can clone this repository by running

```
git clone https://github.com/attlih/web-applications-project.git
```

After cloning, you must set two environment variables. `JWT_SECRET` for authentication and `NODE_ENV` for cors. Server supports dotenv, so you can create following `.env` file to **server** folder:

``` 
JWT_SECRET="your_secret"
NODE_ENV="production"
```

You can also set `NODE_ENV` to `development` in case you want to develop the code.

Next, you must build the project. Go to root folder and run following command

 //TODO continue
```
npm build
```

## User manual
### Login and register
When connecting to [Localhost](http://localhost:3000), users can see all the snippets and filter them without logging in. Users are also able to click a snippet title or comment button to focus on that snippet showing comments. Any other interaction requires registration.

User must be created first by pressing **Register** and submitting required information. After registration, user can **Login** with email or username. There is **admin** user with advanced functionalities. It is the first user created with username *admin*.

### Search
Just type in a query and press **Search**. All snippets with matching titles or code are shown. Uses regex.  

### Snippet functionality
Clicking snippets like or comment button when logged in focuses on that snippet. After that all comments are shown.
Users can like and comment snippets and like comments. They can also modify the posts they have done. **Admin** user can edit all posts and also delete them.   



## Feature list and asked points
|  Feature | Max points   | Proposed points   |
|---|---|---|
|Basic features|  25 |  25 |
|  Users can edit their own comments/posts | 4  | 4  |
| Utilization of a frontside framework, such as React, but you can also use Angular, Vue or some other | 5 | 5 |
| Use some highlight library for the code snippets, for example https://highlightjs.org/ | 2 | 2 |
|  Use of a pager when there is more than 10 posts available|  2 |   |
|  Login with Facebook, Google or Twitter accounts (use Passport.js) |  2 |   |
|  Admin account with rights to edit all the post and comments and delete content (if a post is removed, all its comments should be removed too) |3   |  3 |
|   Test software for accessibility; can it be used only with keyboard / voice command? Can screen readers work with your application?| 3  |   |
| Provide a search that can filter out only those messages that have the searched keyword  | 2 | 2 |
|  Vote (up or down) posts and comments (only one vote per user) |  3 |  3 |
|  User profiles can have images which are show next to posts/comments |  3 |   |
|  User can click username and see user profile page where name, register date, (user picture) and user bio is listed |  2 |   |
| Last edited timestamp is stored and shown with posts/comments  | 2  | 2  |
|Translation of the whole UI in two or more languages| 2| |
|  Create (unit) tests and automate some testing for example with https://www.cypress.io/ (at least 10 cases have to be implemented) | 5  |   |
| Using typescript in client side (additional feature) |  | 4 |
|No minus points for me|-350 | 0|
| Total| 63| 50 |

