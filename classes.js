class Book{
	constructor(bookTitle,author,date,image,genre){
		this.bookTitle = bookTitle;
		this.author = author;
		this.rate = 0;
		this.publishedDate = date;
		this.image = image;
		this.genre = genre;
		this.NumberOfFollowers = 0;
		this.comment = []
		this.chapters = []
	}

	// get the book title
	getbookTitle(){
		return this.bookTitle;
	}

	getAuthor(){
		return this.author
	}

	getImage(){
		return this.Image
	}

	addChapter(chapter){
		this chapters.push(chapter)
	}
}

class Chapter{
  constructor(num,chapterName){
		this.num = num;
		this.chapterName = chapterName;
	}
	setContent(con){
		this.content = con;
	}
	getContent(){
		return this.content;
	}
	getNum(){
		return this.num;
	}
	getName(){
		return this.chapterName;
	}

	getDescription(){
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
}

//fake data
fakeBooks = []
fakeBooks.push(new Book('Harry Potter', 'JK_Rowling','1999/10/1','img/harryPotter.jpg','fantasy'))
fakeBooks.push(new Book('Time Raiders', 'Xie Wu','2002/4/5','img/TimeRaiders.jpg','fantasy'))
fakeBooks.push(new Book('Wandering Earth', 'Cixin Liu','2008/8/8','img/WanderingEarth.jpg','Sci-fi'))