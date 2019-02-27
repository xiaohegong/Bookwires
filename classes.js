'use strict';
class Book {
    constructor(bookTitle, author, date, image, genre) {
        this.bookTitle = bookTitle;
        this.author = author;
        this.rate = 0;
        this.publishedDate = date;
        this.image = image;
        this.genre = genre;
        this.description = "A good book";
        this.NumberOfFollowers = 0;
        this.comments = [];
        this.chapters = [];
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

    setDscription(content){
    	this.description = content;
    }

    newComment(comment){
        this.comments.push(comment);
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
		this.followers = 0;
		this.following = [];
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
    newBook(book){
        this.writtenBook.push(book);
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
//fake data

const fakeUser = []
fakeUser.push(new user("Xie Wu", 0))
fakeUser.push(new user("Cixin Liu", 1))
fakeUser.push(new user("JK_Rowling", 2))
fakeUser[0].setImage("img/XieWu.png")

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
fakeBooks[1].setDscription('I begin tucking him into bed and he tells me, “Daddy check for monsters under my bed.” I look underneath for his amusement and see him, another him, under the bed, staring back at me quivering and whispering, “Daddy there’s somebody on my bed.”')


