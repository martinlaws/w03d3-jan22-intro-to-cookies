# HTTP & Cookies

### HTTP

Two most important parts of a request:
1. How // HTTP method (verb - e.g. `GET`, `POST`)
2. What // Path (e.g. `/contact` or `/contact?lang=fr`)
    - key value pair

#### Statelessness

HTTP does not remember you between requests - think Dory from Finding Nemo 🐠

In order to prompt the server to remember us, we need an identifier - think membership card at GoodLife. They have all of our user info in their system, but they give us a membership card to prompt their system into identifying us quickly.

### Remembering state _without_ cookies

How do we do this?

Example:
1. User sends `GET` request to `/profile`
2. Server has no clue who you are
3. Server sends redirect (`302`) to `/login` to client
4. Browser/user makes `GET` request to `/login`
5. Server renders `login` view (hypothetically `login.ejs`)
6. User fills out login form with valid credentials and clicks submit
7. Browser/user makes `POST` request to `/login` with form data as 'payload'
8. Server validates payload and finds the correct user object
9. Server redirects to `/profile`
10. User navigates to `/`, sending a `GET` request
11. Server has no idea who user is. Go back to step 3, lather, rinse, repeat.

#### Alternate approach
1. Steps 1-9 above
10. User navigates to `/?username=mlaws`, sending a `GET` request
11. Server looks up user based on `username` param
12. Server finds correct user object and responds with `profile.ejs`, and we make sure to interpolate `?username=mlaws` to every link in our app (what a pain)

```javascript
const usersDB = [{ username: 'mlaws', password: '123' }]
const { username } = req.params
const user = usersDB.find(user => user.username === username)

<% if (currentUser) { %>
  <a href="/?username=<%= currentUser.username %>">HOME</a>
<% } else { %>
  <a href="/login">Log In</a>
<% } %>
```

**Problems with this approach:**
- Security: 
    - Very easy to brute force guess usernames and impersonate someone
    - Sharing URLs means sharing your logged in state
- Usability:
    - Closing tab/window will log me out (unless I go back to URL with query string)


### Enter: Cookies!

Instead of exposing data in query params in the URL, we can store data in a cookie.

The cookie is assumed to be stored by the client, who will send it with **EVERY** request.

This addresses most of the problems outlined above (with one glaring exception).


## Demo 1: Language Switcher

## Demo 2: User Authenication

### Security

Problems with our demo:
1. Devs/Ops have access to people's passwords (this happened on GSuite recently!) === BAD
    - Hash passwords
        - `password: '123'` becomes: `_sesson="aa104ef8b4d64a8d8177e846509439d0"` in an MD5 hash, for example
        - Don't do this yourself, you aren't a cryptographer
2. Cookie is not encrypted, which opens us up to ~Man~Person in the Middle attacks (MITM) for all of our requests!
    - We need HTTPS in order to fully encrypt our requests
    - `cookie-session` node module encrypts _and signs_ our cookies by default! Yay!
