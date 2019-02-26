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
        this.comment = [];
        this.chapters = [];
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
    	return this.chapters[i]
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
		this.image = []
	}

	getName(){
		return this.name;
	}
}

//fake data

const fakeUser = []
fakeUser.push(new user("Xie Wu", 0))
fakeUser.push(new user("Cixin Liu", 1))
fakeUser.push(new user("JK_Rowling", 2))

const fakeBooks = []
fakeBooks.push(new Book('Harry Potter', fakeUser[2],'1999/10/1','img/harryPotter.jpg','fantasy'))
fakeBooks.push(new Book('Time Raiders', fakeUser[0],'2002/4/5','img/TimeRaiders.jpg','fantasy'))
fakeBooks.push(new Book('Wandering Earth', fakeUser[1],'2008/8/8','img/WanderingEarth.jpg','Sci-fi'))
fakeBooks.push(new Book('ThreeBody Problem', fakeUser[1],'2010/5/3','img/threebody.jpg','Sci-fi'))
fakeBooks[1].addChapter(new Chapter(1,'1'))
fakeBooks[1].addChapter(new Chapter(2,'2'))
fakeBooks[1].addChapter(new Chapter(3,'3'))
fakeBooks[1].addChapter(new Chapter(4,'4'))
fakeBooks[1].addChapter(new Chapter(5,'5'))
fakeBooks[1].addChapter(new Chapter(6,'6'))



