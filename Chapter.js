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

class Book{
	constructor(bookName,author){
		this.bookName = bookName;
		this.author = author;
	}
}

class user{
	constructor(name,id){
		this.name = name;
		this.id = id;
		this.token = 0;
		this.bookshelf = [];
		this.createdBook = [];
	}
}