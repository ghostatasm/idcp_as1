# Documentation

## Functional Endpoints


/getToken

Supported Methods: GET

Description: Generates and returns a new CSRF token for the user to validate their requests.

Supported Return Types: JSON

<br>

### Account


/login

Supported Methods: POST

Body Params: username (String), pass (String)

Description: Authenticates user, stores account in session, and redirects to app page.

Supported Return Types: JSON

<br>

/signup

Supported Methods: POST

Body Params: username (String), pass (String), pass2 (String)

Description: Encrypts password, creates a new account in the database, authenticates user, stores account in session, and redirects to app page.

Supported Return Types: JSON

<br>

/logout

Supported Methods: GET

Description: Logs user out, clears account in session and redirects back to the home page.

Supported Return Types: JSON

<br>

/resetPassword

Supported Methods: POST

Body Params: pass (String), pass2 (String)

Description: Encrypts password and updates the current account in session's password in the database.

Supported Return Types: JSON

<br>

/account

Supported Methods: GET

Description: Returns current account in session.

Supported Return Types: JSON

<br>

### Game & Rooms


/rooms

Supported Methods: GET

Description: Returns all the game rooms currently in the database.

Supported Return Types: JSON

<br>

/room

Supported Methods: GET

Query Params: id (String, optional)

Description: Returns the room with the specified ID. If no ID is specified, returns the room in the user's session.

Supported Return Types: JSON

<br>

/board

Supported Methods: GET

Description: Returns the board in the user's session.

Supported Return Types: JSON

<br>

/create

Supported Methods: POST

Body Params: name (String)

Description: Creates a room in the database with the name specified, joins the user to it, saves it in session, and returns it.

Supported Return Types: JSON

<br>

/join

Supported Methods: POST

Body Params: id (String)

Description: Joins the user to a room with the id specified, saves it in session, and returns it.

Supported Return Types: JSON

<br>

/rejoin

Supported Methods: POST

Body Params: id (String)

Description: Rejoins user to a room with the id specified, saves it in session, and returns it.

Supported Return Types: JSON

<br>

/leave

Supported Methods: POST

Description: Removes user from room, removes room from session, and returns the room.

Supported Return Types: JSON

<br>

/turn

Supported Methods: POST

Body Params: utttCell (Number, [0-8]), tttCell (Number, [0-8])

Description: Takes a player's turn in the specified Ultimate Tic Tac Toe and inner Tic Tac Toe cell's index and returns the room. Indexes indicate the cells like so: 

0 1 2

3 4 5

6 7 8

Supported Return Types: JSON

<br>

/surrender

Supported Methods: POST

Description: Declares the other player the winner and returns the room.

Supported Return Types: JSON