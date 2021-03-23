from flask import Flask, render_template, request, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow_sqlalchemy.fields import Nested
#to convert non serializable sql data to json easily without writing custom serializer
import yaml
import time

app = Flask(__name__)


#Mysql config
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:root@localhost/library'

db = SQLAlchemy(app)
ma = Marshmallow(app)

#Object model for books
class Books(db.Model):
    book_id = db.Column(db.Integer, primary_key=True)
    book_name = db.Column(db.String(30), nullable=False)
    author_name = db.Column(db.String(40), nullable=False)
    # issued=db.Column(db.Boolean, default=False)
    rent_price = db.Column(db.Integer, default=60)
    stocks_left = db.Column(db.Integer, default=1)
    issued = db.Column(db.Integer, default=0)
    # transactions = db.relationship("Transactions", backref="books")

    def __repr__(self):
        return "<Book %r>", self.book_id


#making schema to convert to json later
class BooksSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Books


#Object Model for Members
class Members(db.Model):
    member_id = db.Column(db.Integer, primary_key=True)
    member_name = db.Column(db.String(30), nullable=False)
    outstanding_debt = db.Column(db.Integer, nullable=False, default=0)
    total_paid = db.Column(db.Integer, nullable=False, default=0)
    books_in_possession = db.Column(db.Integer, nullable=False, default=0)
    # transactions = db.relationship("Transactions", backref="members")


class MembersScehema(SQLAlchemyAutoSchema):
    class Meta:
        model = Members


#object model for all transactions
class Transactions(db.Model):
    transaction_id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('books.book_id'))
    books = db.relationship("Books", backref="transactions")
    member_id = db.Column(db.Integer, db.ForeignKey('members.member_id'))
    members = db.relationship('Members', backref="transactions")
    transaction_type = db.Column(db.String(6), nullable=False)


class TransactionsSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Transactions
        include_fk = True        
    members = Nested(MembersScehema)
    books = Nested(BooksSchema)
        


#returns true if book is available to be issued
def getAvailability(book):
    bookDetail = Books.query.get(book)
    if bookDetail.stocks_left>=1:
        return True
    elif bookDetail.issued<1:
        return False

#checks if the member has any book or not
def checkAnyBooksInPossession(member):
    memberDetail = Members.query.get(member)
    if memberDetail.books_in_possession==0:
        return False
    elif memberDetail.books_in_possession>=1:
        return True

#checks if the outstanding deb to be paid is above 500
def checkOutstandingDebtLimitCrossed(member):
    memberDetail = Members.query.get(member)
    if memberDetail.outstanding_debt<500:
        return False
    elif memberDetail.outstanding_debt>=500:
        return True


#First Page
@app.route('/')
def index():
    return render_template('index.html')
    


#List of Books with update and delete options
@app.route('/books', methods=['GET', 'POST'])
def books():
    if request.method=='GET':

        bookDetails = Books.query.all()
        bookSchema = BooksSchema(many=True)
        bookDetails = bookSchema.dump(bookDetails)
        return jsonify({'bookDetails': bookDetails})
    
    if request.method=='POST':
        frontEndData = request.get_json()

        # print(bookDetailsFromUI)
        # return jsonify({'obj': bookDetailsFromUI})  

        bookName=frontEndData['bookName']        
        authorName=frontEndData['authorName']
        rentPrice = int(frontEndData['rentPrice'])
        stocks = int(frontEndData['stocks'])
        newBook = Books(book_name=bookName, author_name=authorName, rent_price=rentPrice, stocks_left=stocks)        
        try:
            db.session.add(newBook)
            db.session.commit()
            bookDetails = Books.query.all()
            bookSchema = BooksSchema(many=True)
            bookDetails = bookSchema.dump(bookDetails)
            return jsonify({'bookDetails': bookDetails})
        except:
            return jsonify({'error':'Error in book details or database'})

#deleting book
@app.route('/books/<int:id>/delete', methods=['DELETE'])
def delete_book(id):
    if request.method=='DELETE':
        try:
            Books.query.filter_by(book_id=id).delete()
            db.session.commit()
            bookDetails = Books.query.all()
            bookSchema = BooksSchema(many=True)
            bookDetails = bookSchema.dump(bookDetails)
            return jsonify({'bookDetails': bookDetails})
        except:
            return jsonify({'error':'Error in deleting the book'})

#updating the book details
@app.route('/books/<int:id>/update', methods=['GET','POST'])
def update_book(id):
    book = Books.query.get_or_404(id)

    if request.method=='GET':
        bookSchema = BooksSchema()
        output = bookSchema.dump(book)
        return jsonify({'book': output})
        
    
    if request.method=='POST':
        bookDataFrontEnd = request.get_json()
        book.book_name = bookDataFrontEnd['bookName']
        book.author_name = bookDataFrontEnd['authorName']
        book.rent_price = int(bookDataFrontEnd['rentPrice'])
        book.stocks_left = int(bookDataFrontEnd['stocks'])
        try:
            db.session.commit()
            bookDetails = Books.query.all()
            bookSchema = BooksSchema(many=True)
            bookDetails = bookSchema.dump(bookDetails)
            return jsonify({'bookDetails': bookDetails})
        except:
            return jsonify({'error':'Error in updating the book'})


#Check transactions of the particular book
@app.route('/books/<int:id>/transactions')
def showBookTransactions(id):
    transactions = Transactions.query.filter(Transactions.book_id==id)
    length = 0
    for transaction in transactions:
        length = length+1    
    print(length)
    return render_template('book-transaction.html', transactions=transactions, length=length)




#List of Members with update and delete options
@app.route('/members', methods=['GET', 'POST'])
def members():
    if request.method=='GET':

        memberDetails = Members.query.all()
        membersSchema = MembersScehema(many=True)
        memberDetails = membersSchema.dump(memberDetails)
        return jsonify({'memberDetails': memberDetails})
    
    if request.method=='POST':
        try:
            newMemberFrontEnd = request.get_json()
            newMemberName = newMemberFrontEnd['memberName']
            if not newMemberName:
                return jsonify({'error': 'Name not entered properly'})
        
            newMember = Members(member_name=newMemberName)

            # memberName=request.form['memberName']        
            # newMember = Members(member_name=memberName)

            db.session.add(newMember)
            db.session.commit()
            memberDetails = Members.query.all()
            membersSchema = MembersScehema(many=True)
            memberDetails = membersSchema.dump(memberDetails)
            return jsonify({'memberDetails': memberDetails})
        except:
            return jsonify({'error': 'Database error'})


#update members
@app.route('/members/<int:id>/update', methods=['GET','POST'])
def update_members(id):
    
    member = Members.query.get_or_404(id)

    if request.method=='GET':
        return render_template('update-member.html', member=member)
    
    if request.method=='POST':
        memberDataFrontEnd = request.get_json()
        if not memberDataFrontEnd:
            return jsonify({'error':'Name not entered properly'})
        member.member_name = memberDataFrontEnd['memberName']
        try:
            db.session.commit()
            memberDetails = Members.query.all()
            membersSchema = MembersScehema(many=True)
            memberDetails = membersSchema.dump(memberDetails)
            return jsonify({'memberDetails': memberDetails})
        except:
            return jsonify({'error':'Error in updating'})


#deleting members
@app.route('/members/<int:id>/delete', methods=['DELETE'])
def delete_member(id):

    if request.method=='DELETE':
        try:
            member = Members.query.get_or_404(id)
            #should not be able to delete if there are any dues to be paid
            if member.outstanding_debt>0:
                return jsonify({'status':'outstanding debt remains'})
            else:
                db.session.delete(member)
                db.session.commit()

                memberDetails = Members.query.all()
                memberSchema = MembersScehema(many=True)
                memberDetails = memberSchema.dump(memberDetails)
                return jsonify({'memberDetails': memberDetails})
        except:
            return jsonify({'error':'Database error, member not deleted'})



@app.route('/transactions', methods=['GET', 'POST'])
def transactions():

    if request.method == 'GET':

        # memberDetails = Members.query.all()
        # membersSchema = MembersScehema(many=True)
        # memberDetails = membersSchema.dump(memberDetails)
        # return jsonify({'memberDetails': memberDetails})

        books = Books.query.all()
        booksSchema = BooksSchema(many=True)
        books = booksSchema.dump(books)

        members = Members.query.all()
        membersSchema=MembersScehema(many=True)
        members = membersSchema.dump(members)

        transactions = Transactions.query.all()#.join(Members).join(Books).filter(Books.book_id==Transactions.book_id)
        transactionsSchema=TransactionsSchema(many=True)
        transactions = transactionsSchema.dump(transactions)

        return jsonify({'transactions': transactions, 'members':members, 'books': books}) 
        #render_template('transactions.html', books=books, members=members, transactions=transactions)    
    # if request.method=='POST':
    #     book_id = request.form['book']
    #     member_id = request.form['member']
    #     transaction_type = request.form['transactionType']
    #     if transaction_type=='issue':
            
    #         #should not issue the book either if its out of stock or if the outstanding debt is above 500
    #         if getAvailability(book_id) and not checkOutstandingDebtLimitCrossed(member_id):
    #             member = Members.query.get_or_404(member_id)
    #             book = Books.query.get_or_404(book_id)
    #             book.stocks_left = book.stocks_left - 1
    #             book.issued = book.issued + 1
    #             member.outstanding_debt = member.outstanding_debt + book.rent_price
    #             newTransaction = Transactions(book_id=book_id, member_id=member_id, transaction_type=transaction_type)
    #             try:
    #                 db.session.add(newTransaction)
    #                 db.session.commit()
    #                 return redirect('/transactions')
    #             except:
    #                 return 'Database error'
                
    #         elif not getAvailability(book_id):
    #             return 'The requested book is out of stock'

    #         elif checkOutstandingDebtLimitCrossed(member_id):
    #             return 'The user cannot be issued anymore books as the outstanding debt limit is crossed'

    #     if transaction_type=='return':
    #         member = Members.query.get_or_404(member_id)
    #         book = Books.query.get_or_404(book_id)
    #         book.stocks_left = book.stocks_left + 1
    #         book.issued = book.issued - 1            
    #         member.outstanding_debt = member.outstanding_debt - book.rent_price
    #         newTransaction = Transactions(book_id=book_id, member_id=member_id, transaction_type=transaction_type)
    #         try:
    #             db.session.add(newTransaction)
    #             db.session.commit()
    #             return redirect('/transactions')
    #         except:
    #             return 'Database error'


#issue book transaction
@app.route('/transactions/issue-book', methods=['GET','POST'])
def issueBook():
    if request.method=='GET':
        books = Books.query.all()
        members = Members.query.all()
        transactions = Transactions.query.all()
        return render_template('issue-book.html',books=books, members=members, transactions=transactions)
    
    if request.method=='POST':
        try:
            details = request.get_json()
            book_id = int(details['book'])
            member_id = int(details['member'])
            transaction_type = "issue"
            # return jsonify({'message':'receiving data', 'details': details})
            if getAvailability(book_id) and not checkOutstandingDebtLimitCrossed(member_id):
                member = Members.query.get_or_404(member_id)
                book = Books.query.get_or_404(book_id)
                book.stocks_left = book.stocks_left - 1
                book.issued = book.issued + 1
                member.outstanding_debt = member.outstanding_debt + book.rent_price
                member.books_in_possession = member.books_in_possession + 1
                newTransaction = Transactions(book_id=book_id, member_id=member_id, transaction_type=transaction_type)
                try:
                    db.session.add(newTransaction)
                    db.session.commit()
                    return jsonify({'message': 'database changed'})
                except:
                    return jsonify({'message': 'error happened'})
                
            elif not getAvailability(book_id):
                return jsonify({'message': 'Book not available'})

            elif checkOutstandingDebtLimitCrossed(member_id):
                return jsonify({'message': 'The user cannot be issued anymore books as the outstanding debt limit is crossed'})
        except:
            return jsonify({'message':'not receiving data'})
        #should not issue the book either if its out of stock or if the outstanding debt is above 500
        # if getAvailability(book_id) and not checkOutstandingDebtLimitCrossed(member_id):
        #     member = Members.query.get_or_404(member_id)
        #     book = Books.query.get_or_404(book_id)
        #     book.stocks_left = book.stocks_left - 1
        #     book.issued = book.issued + 1
        #     member.outstanding_debt = member.outstanding_debt + book.rent_price
        #     member.books_in_possession = member.books_in_possession + 1
        #     newTransaction = Transactions(book_id=book_id, member_id=member_id, transaction_type=transaction_type)
        #     try:
        #         db.session.add(newTransaction)
        #         db.session.commit()
        #         return redirect('/transactions')
        #     except:
        #         return 'Database error'
            
        # elif not getAvailability(book_id):
        #     return 'The requested book is out of stock'

        # elif checkOutstandingDebtLimitCrossed(member_id):
        #     return 'The user cannot be issued anymore books as the outstanding debt limit is crossed'


#return book transaction
@app.route('/transactions/return-book', methods=['GET','POST'])
def returnBook():

    if request.method=='GET':
        books = Books.query.all()
        members = Members.query.all()
        transactions = Transactions.query.all()
        return render_template('return-book.html',books=books, members=members, transactions=transactions)
    
    if request.method=='POST':
        details = request.get_json()
        book_id = int(details['book'])
        member_id = int(details['member'])
        payment = int(details['payment'])
        transaction_type = "return"
        
        #return jsonify({'detsils':details, 'type of payment': payment})
        #check if the user possess any book or not

        #if the member has books_in_possession more than 0
        if checkAnyBooksInPossession(member_id):
            #return the book
            member = Members.query.get_or_404(member_id)
            book = Books.query.get_or_404(book_id)
            book.stocks_left = book.stocks_left + 1
            book.issued = book.issued - 1
            member.outstanding_debt = member.outstanding_debt - payment
            member.total_paid = member.total_paid + payment
            member.books_in_possession = member.books_in_possession - 1
            
            newTransaction = Transactions(book_id=book_id, member_id=member_id, transaction_type=transaction_type)

            try:
                db.session.add(newTransaction)
                db.session.commit()
                return jsonify({'message':'database changed'})
            except:
                return jsonify({'message':'database NOT changed'})

        #if the member has books_in_possesion as 0
        if not checkAnyBooksInPossession(member_id):
            #do not retyrn any book
            return jsonify({'message':'This member currently does not have any book in possession to be able to return'})

        


#Deleting all transactions
@app.route('/transactions/delete')
def deleteAllTransactions():
    db.session.query(Transactions).delete()
    db.session.commit()
    return redirect('/transactions')



if __name__=='__main__':
    app.run(debug=True)
    