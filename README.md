# Library Management System
### This app is made only for the admin of the library to manage the members and books of the library
Admin can add books and other details about the book such as its Author Name and the price for its
rent. The admin can delete or update the information of these books. Same can be done with its members
The admin can keep track of the number of books currently in circulation and books left in stock.
The members can issue or return a book. A rent would be charged on returning the book. Members cannot
proceed without paying these rent. A member cannot issue a book once his/her outstanding debt reaches 
Rs.500. Paying off these rents by returning the books will only let them issue more books. The homepage
shows reports of most popular books and highest paying members. The transactions page keeps track of
all the transactions and can be referred when needed.


## Technology Stack
- MySQL for backend (use SQLite when deploying)
- Flask API in backend, flask-sqlalchemy and marshmallow to connect MySQL DB and backend
- ReactJS for frontend, Material-UI components for theme


For npm packages use **npm install**


## GIF

![ScreenRecording 1](https://github.com/kakarot98/library-management/tree/main/screenshots/ScreenRecording1.gif?raw=true)


## Screenshots

### Charts:
![Screenshot 1](https://github.com/kakarot98/library-management/tree/main/screenshots/Screenshot1.png?raw=true)

![Screenshot 2](https://github.com/kakarot98/library-management/tree/main/screenshots/Screenshot2.png?raw=true)

### List of books
![Screenshot 3](https://github.com/kakarot98/library-management/tree/main/screenshots/Screenshot3.png?raw=true)

### List of members
![Screenshot 4](https://github.com/kakarot98/library-management/tree/main/screenshots/Screenshot4.png?raw=true)

### Record for all transactions
![Screenshot 5](https://github.com/kakarot98/library-management/tree/main/screenshots/Screenshot5.png?raw=true)

