# Bookwires: A Novel Sharing Web Application
The app can be started from the home page (https://bookwires.herokuapp.com).

You do not have to be logged in to access all features of the site. 
The features that require the user to be logged in are viewing user pages, creating / deleting / editing / following / commenting / rating books, notifications, and following users. 

We suggest logging in to use all features and displaying on full screen Google Chrome for best visual experience. 

## Overall Purpose
The website we have decided to build is a community driven novel sharing website. Users will be able to sign up to the website and share books that they are writing/written. Users are also able to read the novels that people share. Our website serves people who are passionate about writing (or are new to writing and want to explore what it is like), as well as those who enjoy reading and discovering new material. The benefit our site provides is that it helps writers (aimed towards smaller writers) gain exposure by releasing their material to a large audience. They can also receive feedback on their books. It also provides a benefit to people who enjoy reading and like to discover new material written by different people.

## The application
### Users
Users of the website have two main functionalities: 1. Author, 2. Reader. 

As an author a user can create a novel on the website and upload the chapters they have written. The website will function in a way where the writer can publish their book incrementally (chapter by chapter) as they write it. The majority of the website’s functionality comes as a reader. A user can see a list of popular books and writers, as well as newly created books. They can search for books and view other users’ profiles. Viewing a profile consists of seeing what books the user has written and what books they are following. Users can follow other users to see when they release new material or follow individual books to get notified when that book has been extended. Users can read these books on a device.

### Interactions

- Sign up: Register user information into database
- Login/logout: Load user data on successful login
- Follow/unfollow user or book: Add/remove uid to following list
- Create a book: Creates a new book and adds it to user’s (written) book list and creates a notification for everyone following the user
- Add chapter to book: Adds a new chapter to a book and creates a notification for everyone following the book or user
- Comment on a book: Creates a new comment for the book
- Like a book: Add and update books total rating
- Search for a book: Check if a title in the websites database of books matches the search
- Remove a book: Remove the book from the website book list and user’s written book list
- Change personal information
- View other user’s profile: Get other user’s information to display
- View a book: Retrieve book data to display



![GitHub Logo](/public/img/homepage_view.png)


@s-cuneo @beijilang @chengHWang @xiaohegong
