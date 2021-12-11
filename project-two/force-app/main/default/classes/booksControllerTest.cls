@isTest
public class booksControllerTest {
    
	@isTest
    public static void getBooksTest(){
        booksController.getBooks();
    }
    	@isTest
    public static void getBooksAndAuthorTest(){
        booksController.getBooksAndAuthor();
        
    }	@isTest
    public static void getBookRecommendationsTest(){
        booksController.getBookRecommendations();
        
    }	@isTest
    public static void getBooksWithoutAuthorsTest(){
        booksController.getBooksWithoutAuthors();
    }
    
    
}