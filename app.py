from flask import Flask, render_template, request, redirect, jsonify
import simplejson as json
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow_sqlalchemy.fields import Nested
from sqlalchemy.sql import func, Alias
from sqlalchemy import case
import os
from dotenv import load_dotenv

load_dotenv(".env")
app = Flask(
    __name__,
    static_folder="./frontend/build/static",
    template_folder="./frontend/build",
)


# Mysql config
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:root@localhost/library'
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///library.db"

db = SQLAlchemy(app)
ma = Marshmallow(app)

# Object model for books


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


# making schema to convert to json later
class BooksSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Books


# Object Model for Members
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


# object model for all transactions
class Transactions(db.Model):
    transaction_id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey("books.book_id"))
    books = db.relationship("Books", backref="transactions")
    member_id = db.Column(db.Integer, db.ForeignKey("members.member_id"))
    members = db.relationship("Members", backref="transactions")
    transaction_type = db.Column(db.String(6), nullable=False)


class TransactionsSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Transactions
        include_fk = True

    members = Nested(MembersScehema)
    books = Nested(BooksSchema)


# returns true if book is available to be issued
def getAvailability(book):
    bookDetail = Books.query.get(book)
    if bookDetail.stocks_left >= 1:
        return True
    elif bookDetail.issued < 1:
        return False


# checks if the member has any book or not


def checkAnyBooksInPossession(member):
    memberDetail = Members.query.get(member)
    if memberDetail.books_in_possession == 0:
        return False
    elif memberDetail.books_in_possession >= 1:
        return True


# checks if the outstanding deb to be paid is above 500


def checkOutstandingDebtLimitCrossed(member):
    memberDetail = Members.query.get(member)
    if memberDetail.outstanding_debt < 500:
        return False
    elif memberDetail.outstanding_debt >= 500:
        return True


# First Page
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    return render_template("index.html")


# List of Books with update and delete options
@app.route("/api/books", methods=["GET", "POST"])
def books():
    if request.method == "GET":

        bookDetails = Books.query.all()
        bookSchema = BooksSchema(many=True)
        bookDetails = bookSchema.dump(bookDetails)
        return jsonify({"bookDetails": bookDetails})

    if request.method == "POST":
        frontEndData = request.get_json()

        bookName = frontEndData["bookName"]
        authorName = frontEndData["authorName"]
        rentPrice = int(frontEndData["rentPrice"])
        stocks = int(frontEndData["stocks"])
        newBook = Books(
            book_name=bookName,
            author_name=authorName,
            rent_price=rentPrice,
            stocks_left=stocks,
        )
        try:
            db.session.add(newBook)
            db.session.commit()
            bookDetails = Books.query.all()
            bookSchema = BooksSchema(many=True)
            bookDetails = bookSchema.dump(bookDetails)
            return jsonify({"bookDetails": bookDetails})
        except:
            return jsonify({"error": "Error in book details or database"})


# deleting book
@app.route("/api/books/<int:id>/delete", methods=["DELETE"])
def delete_book(id):
    if request.method == "DELETE":
        try:
            Books.query.filter_by(book_id=id).delete()
            db.session.commit()
            bookDetails = Books.query.all()
            bookSchema = BooksSchema(many=True)
            bookDetails = bookSchema.dump(bookDetails)
            return jsonify({"bookDetails": bookDetails})
        except:
            return jsonify({"error": "Error in deleting the book"})


# updating the book details
@app.route("/api/books/<int:id>/update", methods=["GET", "POST"])
def update_book(id):
    book = Books.query.get_or_404(id)

    if request.method == "GET":
        bookSchema = BooksSchema()
        output = bookSchema.dump(book)
        return jsonify({"book": output})

    if request.method == "POST":
        bookDataFrontEnd = request.get_json()
        book.book_name = bookDataFrontEnd["bookName"]
        book.author_name = bookDataFrontEnd["authorName"]
        book.rent_price = int(bookDataFrontEnd["rentPrice"])
        book.stocks_left = int(bookDataFrontEnd["stocks"])
        try:
            db.session.commit()
            bookDetails = Books.query.all()
            bookSchema = BooksSchema(many=True)
            bookDetails = bookSchema.dump(bookDetails)
            return jsonify({"bookDetails": bookDetails})
        except:
            return jsonify({"error": "Error in updating the book"})


# Check transactions of the particular book
@app.route("/api/books/<int:id>/transactions", methods=["GET"])
def showBookTransactions(id):
    if request.method == "GET":
        transactions = Transactions.query.filter(Transactions.book_id == id)
        transactionsSchema = TransactionsSchema(many=True)
        transactions = transactionsSchema.dump(transactions)
        length = 0

        return jsonify({"transactions": transactions})


# List of Members with update and delete options
@app.route("/api/members", methods=["GET", "POST"])
def members():
    if request.method == "GET":

        memberDetails = Members.query.all()
        membersSchema = MembersScehema(many=True)
        memberDetails = membersSchema.dump(memberDetails)
        return jsonify({"memberDetails": memberDetails})

    if request.method == "POST":
        try:
            newMemberFrontEnd = request.get_json()
            newMemberName = newMemberFrontEnd["memberName"]
            if not newMemberName:
                return jsonify({"error": "Name not entered properly"})

            newMember = Members(member_name=newMemberName)

            db.session.add(newMember)
            db.session.commit()
            memberDetails = Members.query.all()
            membersSchema = MembersScehema(many=True)
            memberDetails = membersSchema.dump(memberDetails)
            return jsonify({"memberDetails": memberDetails})
        except:
            return jsonify({"error": "Database error"})


# update members
@app.route("/api/members/<int:id>/update", methods=["GET", "POST"])
def update_members(id):

    member = Members.query.get_or_404(id)

    if request.method == "GET":
        return render_template("update-member.html", member=member)

    if request.method == "POST":
        memberDataFrontEnd = request.get_json()
        if not memberDataFrontEnd:
            return jsonify({"error": "Name not entered properly"})
        member.member_name = memberDataFrontEnd["memberName"]
        try:
            db.session.commit()
            memberDetails = Members.query.all()
            membersSchema = MembersScehema(many=True)
            memberDetails = membersSchema.dump(memberDetails)
            return jsonify({"memberDetails": memberDetails})
        except:
            return jsonify({"error": "Error in updating"})


# deleting members
@app.route("/api/members/<int:id>/delete", methods=["DELETE"])
def delete_member(id):

    if request.method == "DELETE":
        try:
            member = Members.query.get_or_404(id)
            # should not be able to delete if there are any dues to be paid
            if member.outstanding_debt > 0:
                return jsonify({"status": "outstanding debt remains"})
            else:
                db.session.delete(member)
                db.session.commit()

                memberDetails = Members.query.all()
                memberSchema = MembersScehema(many=True)
                memberDetails = memberSchema.dump(memberDetails)
                return jsonify({"memberDetails": memberDetails})
        except:
            return jsonify({"error": "Database error, member not deleted"})


@app.route("/api/members/<int:id>/books-in-possession", methods=["GET"])
def getBooksInPossession(id):
    if request.method == "GET":
        # transactions = Transactions.query.filter_by(member_id=id and func.sum(case((Transactions.transaction_type=='issue',1),else_=1)-case(Transactions.transaction_type=='return,1'),else_=0))
        # valueWhenIssue = case([(Transactions.transaction_type=='issue', 1)], else_=0)
        # valueWhenReturn = case([(Transactions.transaction_type=='return', 1)], else_=0)
        r = db.engine.execute(
            'SELECT t.book_id, SUM(CASE WHEN transaction_type = "issue" THEN 1 ELSE 0 END)-SUM(CASE WHEN transaction_type = "return" THEN 1 ELSE 0 END) AS balance,book_name,rent_price FROM transactions t INNER JOIN books b ON t.book_id = b.book_id WHERE member_id={} GROUP BY b.book_id'.format(
                id
            )
        ).fetchall()

        result = []
        for row_number, row in enumerate(r):
            result.append({})
            for column_number, value in enumerate(row):
                result[row_number][row.keys()[column_number]] = value

        # print(result)
        return jsonify({"transactions": result})


@app.route("/api/transactions", methods=["GET", "POST"])
def transactions():

    if request.method == "GET":

        books = Books.query.all()
        booksSchema = BooksSchema(many=True)
        books = booksSchema.dump(books)

        members = Members.query.all()
        membersSchema = MembersScehema(many=True)
        members = membersSchema.dump(members)

        transactions = Transactions.query.all()
        transactionsSchema = TransactionsSchema(many=True)
        transactions = transactionsSchema.dump(transactions)

        return jsonify(
            {"transactions": transactions, "members": members, "books": books}
        )


# issue book transaction
@app.route("/api/transactions/issue-book", methods=["GET", "POST"])
def issueBook():
    if request.method == "GET":
        books = Books.query.all()
        members = Members.query.all()
        transactions = Transactions.query.all()
        return render_template(
            "issue-book.html", books=books, members=members, transactions=transactions
        )

    if request.method == "POST":
        try:
            details = request.get_json()
            book_id = int(details["book"])
            member_id = int(details["member"])
            transaction_type = "issue"
            # return jsonify({'message':'receiving data', 'details': details})
            if getAvailability(book_id) and not checkOutstandingDebtLimitCrossed(
                member_id
            ):
                member = Members.query.get_or_404(member_id)
                book = Books.query.get_or_404(book_id)

                if member.outstanding_debt + book.rent_price >= 500:
                    return (
                        json.dumps(
                            {
                                "error": "The user cannot be issued anymore books as the outstanding debt limit is crossed"
                            }
                        ),
                        400,
                    )

                book.stocks_left = book.stocks_left - 1
                book.issued = book.issued + 1
                member.outstanding_debt = member.outstanding_debt + book.rent_price
                member.books_in_possession = member.books_in_possession + 1
                newTransaction = Transactions(
                    book_id=book_id,
                    member_id=member_id,
                    transaction_type=transaction_type,
                )
                try:
                    db.session.add(newTransaction)
                    db.session.commit()
                    return jsonify({"message": "database changed"})
                except:
                    return jsonify({"message": "error happened"})

            elif not getAvailability(book_id):
                return json.dumps({"error": "Book not available"}), 400

            elif checkOutstandingDebtLimitCrossed(member_id):
                return (
                    json.dumps(
                        {
                            "error": "The user cannot be issued anymore books as the outstanding debt limit is crossed"
                        }
                    ),
                    400,
                )
        except:
            return json.dumps({"error": "not receiving data"}), 400
        # should not issue the book either if its out of stock or if the outstanding debt is above 500


# return book transaction
@app.route("/api/transactions/return-book", methods=["GET", "POST"])
def returnBook():

    if request.method == "GET":
        books = Books.query.all()
        members = Members.query.all()
        transactions = Transactions.query.all()
        return render_template(
            "return-book.html", books=books, members=members, transactions=transactions
        )

    if request.method == "POST":
        details = request.get_json()
        book_id = int(details["book"])
        member_id = int(details["member"])
        # payment = int(details['payment'])
        transaction_type = "return"

        # if the member has books_in_possession more than 0
        if checkAnyBooksInPossession(member_id):
            # return the book
            member = Members.query.get_or_404(member_id)
            book = Books.query.get_or_404(book_id)
            payment = book.rent_price
            book.stocks_left = book.stocks_left + 1
            book.issued = book.issued - 1
            member.outstanding_debt = member.outstanding_debt - payment
            member.total_paid = member.total_paid + payment
            member.books_in_possession = member.books_in_possession - 1

            newTransaction = Transactions(
                book_id=book_id, member_id=member_id, transaction_type=transaction_type
            )

            try:
                db.session.add(newTransaction)
                db.session.commit()
                return jsonify({"message": "database changed"})
            except:
                return jsonify({"message": "database NOT changed"})

        # if the member has books_in_possesion as 0
        if not checkAnyBooksInPossession(member_id):
            # do not retyrn any book
            return jsonify(
                {
                    "message": "This member currently does not have any book in possession to be able to return"
                }
            )


@app.route("/api/report", methods=["GET"])
def report():
    if request.method == "GET":
        transactions = Transactions.query.all()
        transactionsSchema = TransactionsSchema(many=True)
        transactions = transactionsSchema.dump(transactions)

        # query1 = db.engine.execute('SELECT t.book_id, book_name,COUNT(t.transaction_type = "issue") AS popularity FROM transactions t INNER JOIN library.books b ON t.book_id = b.book_id GROUP BY book_id ORDER BY popularity DESC').fetchall()
        query2 = db.engine.execute(
            'SELECT b.book_id, b.book_name,b.stocks_left,(b.stocks_left+b.issued) AS total, COUNT(DISTINCT t.member_id) AS number_of_members,COUNT(t.transaction_type = "issue") AS popularity FROM books b LEFT JOIN transactions t ON b.book_id = t.book_id GROUP BY b.book_id ORDER BY number_of_members DESC'
        ).fetchall()
        query1 = db.engine.execute(
            'SELECT t.book_id, b.book_name,COUNT(t.transaction_type = "issue") AS popularity FROM transactions t INNER JOIN books b ON t.book_id = b.book_id GROUP BY b.book_id ORDER BY popularity DESC'
        ).fetchall()

        query3 = db.engine.execute(
            "SELECT * FROM members ORDER BY total_paid DESC"
        ).fetchall()

        # popularityByTotalRents = []
        # for row_number, row in enumerate(query1):
        #     popularityByTotalRents.append({})
        #     for column_number, value in enumerate(row):
        #         popularityByTotalRents[row_number][row.keys()[column_number]] = value

        bookRankingDetails = []
        for row_number, row in enumerate(query2):
            bookRankingDetails.append({})
            for column_number, value in enumerate(row):
                bookRankingDetails[row_number][row.keys()[column_number]] = value

        memberRankingDetails = []
        for row_number, row in enumerate(query3):
            memberRankingDetails.append({})
            for column_number, value in enumerate(row):
                memberRankingDetails[row_number][row.keys()[column_number]] = value

        return jsonify(
            {
                "bookRankingDetails": bookRankingDetails,
                "memberRankingDetails": memberRankingDetails,
            }
        )

        # return jsonify({'popularityByTotalRents': popularityByTotalRents, 'popularityByDistinctRents':popularityByDistinctRents})


# Deleting all transactions
@app.route("/api/transactions/delete")
def deleteAllTransactions():
    db.session.query(Transactions).delete()
    db.session.commit()
    return redirect("/transactions")


def main():
    app.threaded = True
    app.processes = 2
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)


if __name__ == "__main__":
    main()
