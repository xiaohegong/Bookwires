'use strict';
class Book {
    constructor(bookTitle, author, date, image, genre) {
        this.bookTitle = bookTitle;
        this.author = author;
        this.rating = 0;
        this.publishedDate = date;
        this.image = image;
        this.genre = genre;
        this.description = "A good book";
        this.NumberOfFollowers = 0;
        this.comments = [];
        this.chapters = [];
    }

    getRating(){
        return this.rating;
    }

    getAuthorOtherBook(){
        return author.writtenBook;
    }
    // get the book title
    getBookTitle() {
        return this.bookTitle;
    }

	getAuthor(){
		return this.author.getName()
	}
    getImage() {
        return this.image;
    }

    getGenre() {
        return this.genre;
    }

    getDescription() {
        return this.description;
    }

    addChapter(chapter) {
        this.chapters.push(chapter);
    }

    getChapter(i){
    	return this.chapters[i];
    }
    getTotalChapter(){
    	return this.chapters.length;
    }

    setDescription(content){
    	this.description = content;
    }

    setRating(rate){
        this.rating = rate;
    }

    newComment(comment){
        this.comments.push(comment);
    }

    save(user){
        user.addToBookShelf(new readingBook(book));
    }
}
class readingBook{
    constructor(book){
        this.book = book;
        this.currentCurrentReading = 0;
    }

    nextChapter(){
        this.currentCurrentReading += 1;
    }

    jumpToChapter(n){
        this.currentCurrentReading = n;
    }
}
class Chapter {
    constructor(num, chapterName) {
        this.num = num;
        this.chapterName = chapterName;
    }

    setContent(con) {
        this.content = con;
    }

    getContent() {
        return this.content;
    }

    getNum() {
        return this.num;
    }

    getName() {
        return this.chapterName;
    }

    getDescription() {
        return 'chapter ' + this.num + ' : ' + this.chapterName;
    }
}

class user{
	constructor(name,id){
		this.name = name;
		this.id = id;
		this.token = 0;
		this.bookshelf = [];
		this.writtenBook = [];
        this.topThreeBook = [];
		this.followers = 0;
		this.following = [];
		this.mailAddress = "";
		this.passWord = "";
	}

	getName(){
		return this.name;
	}
    getImage(){
        return this.image;
    }
    setImage(src){
        this.image = src;
    }
    addToBookShelf(book){
        this.bookshelf.push(book);
    }
    newBook(book){
        this.writtenBook.push(book);
    }
	setPassWord(passWord){
		this.passWord = passWord;
	}
	setMailAdd(address){
		this.mailAddress = address;
	}
}

class Comment{
    constructor(user,content){
        this.user = user;
        this.content = content;
    }
    getUser(){
        return this.user;
    }
    getContent(){
        return this.content;
    }
}
function newBook(author,book){
    fakeBooks.push(book)
    author.newBook(book)
}

let numberOfUsers = 0;
function userCreater(name,mailAddress,passWord){
	const rawUser = new user(name, numberOfUsers)
	rawUser.setMailAdd(mailAddress)
	rawUser.setPassWord(passWord)
	numberOfUsers += 1
	return rawUser
}

//fake data
const fakeUser = []
fakeUser.push(userCreater("Xie Wu","wuxie@gmail.com","123456"))
fakeUser.push(userCreater("Cixin Liu","liucixin@gmail.com","123456"))
fakeUser.push(userCreater("JK_Rowling","jkR@gmail.com","123456"))
fakeUser[0].setImage("img/XieWu.png")
fakeUser[2].setImage("img/jk.jpg")

const fakeBooks = []
newBook(fakeUser[2],new Book('Harry Potter', fakeUser[2],'1999/10/1','img/harryPotter.jpg','fantasy'))
newBook(fakeUser[0],new Book('Time Raiders', fakeUser[0],'2002/4/5','img/TimeRaiders.jpg','fantasy'))
newBook(fakeUser[1],new Book('Wandering Earth', fakeUser[1],'2008/8/8','img/WanderingEarth.jpg','Sci-fi'))
newBook(fakeUser[1],new Book('ThreeBody Problem', fakeUser[1],'2010/5/3','img/threebody.jpg','Sci-fi'))

fakeBooks[1].addChapter(new Chapter(1,'1'))
fakeBooks[1].addChapter(new Chapter(2,'2'))
fakeBooks[1].addChapter(new Chapter(3,'3'))
fakeBooks[1].addChapter(new Chapter(4,'4'))
fakeBooks[1].addChapter(new Chapter(5,'5'))
fakeBooks[1].addChapter(new Chapter(6,'6'))
fakeBooks[1].addChapter(new Chapter(7,'7'))
fakeBooks[1].newComment(new Comment(fakeUser[0],'this is a good book'))
fakeBooks[1].setDescription('I begin tucking him into bed and he tells me, “Daddy check for monsters under my bed.” I look underneath for his amusement and see him, another him, under the bed, staring back at me quivering and whispering, “Daddy there’s somebody on my bed.”')

fakeBooks[0].setRating(4);
fakeBooks[1].setRating(5);


//currentUserId shows the current login user's id. 0 means user0 has logined, -1 means no one hsa logined yet.
let currentUserId = -1;
