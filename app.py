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
    rent_price = db.Column(db.Integer, default=60)
    stocks_left = db.Column(db.Integer, default=1)
    issued = db.Column(db.Integer, default=0)

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
def get_availability(book):
    book_detail = Books.query.get(book)
    if book_detail.stocks_left >= 1:
        return True
    elif book_detail.issued < 1:
        return False


# checks if the member has any book or not


def check_if_booksin_possession(member):
    member_detail = Members.query.get(member)
    if member_detail.books_in_possession == 0:
        return False
    elif member_detail.books_in_possession >= 1:
        return True


# checks if the outstanding deb to be paid is above 500


def check_outstanding_debt_limit(member):
    member_detail = Members.query.get(member)
    if member_detail.outstanding_debt < 500:
        return False
    elif member_detail.outstanding_debt >= 500:
        return True


def exception_handler(func):
    def inner_function(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except:
            db.session.rollback()
            return (
                jsonify(
                    {
                        "errorMessage": "Database error, changes cannot be accepted. No changes made"
                    }
                ),
                500,
            )

    inner_function.__name__ = func.__name__
    return inner_function


# First Page
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    return render_template("index.html")


# List of Books with update and delete options
@app.route("/api/books", methods=["GET", "POST"])
@exception_handler
def books():
    if request.method == "GET":

        book_details = Books.query.all()
        book_schema = BooksSchema(many=True)
        book_details = book_schema.dump(book_details)
        return jsonify({"bookDetails": book_details})

    if request.method == "POST":
        frontend_data = request.get_json()

        book = frontend_data["bookName"]
        author = frontend_data["authorName"]
        rent = int(frontend_data["rentPrice"])
        stocks = int(frontend_data["stocks"])

        if not book or not author or not rent or not stocks:
            return (
                jsonify(
                    {"errorMessage": "Some details missing - fill details properly"}
                ),
                406,
            )

        newBook = Books(
            book_name=book,
            author_name=author,
            rent_price=rent,
            stocks_left=stocks,
        )

        db.session.add(newBook)
        db.session.commit()
        book_details = Books.query.all()
        book_schema = BooksSchema(many=True)
        book_details = book_schema.dump(book_details)
        return jsonify({"bookDetails": book_details})


# deleting book
@app.route("/api/books/<int:id>/delete", methods=["DELETE"])
@exception_handler
def delete_book(id):
    Books.query.filter_by(book_id=id).delete()
    db.session.commit()
    book_details = Books.query.all()
    book_schema = BooksSchema(many=True)
    book_details = book_schema.dump(book_details)
    return jsonify({"bookDetails": book_details})


# updating the book details
@app.route("/api/books/<int:id>/update", methods=["GET", "POST"])
@exception_handler
def update_book(id):

    try:
        book = Books.query.get_or_404(id)
    except:
        return jsonify({"errorMessage": "This book does not exist in database"}), 404

    # book = Books.query.get_or_404(id)

    if request.method == "GET":
        book_schema = BooksSchema()
        output = book_schema.dump(book)
        return jsonify({"book": output})

    if request.method == "POST":
        frontend_data = request.get_json()
        book.book_name = frontend_data["bookName"]
        book.author_name = frontend_data["authorName"]
        book.rent_price = int(frontend_data["rentPrice"])
        book.stocks_left = int(frontend_data["stocks"])

        db.session.commit()
        book_details = Books.query.all()
        book_schema = BooksSchema(many=True)
        book_details = book_schema.dump(book_details)
        return jsonify({"bookDetails": book_details})


# Check transactions of the particular book
@app.route("/api/books/<int:id>/transactions", methods=["GET"])
def showBookTransactions(id):
    if request.method == "GET":
        transactions = Transactions.query.filter(Transactions.book_id == id)
        transaction_schema = TransactionsSchema(many=True)
        transactions = transaction_schema.dump(transactions)
        length = 0

        return jsonify({"transactions": transactions})


# List of Members with update and delete options
@app.route("/api/members", methods=["GET", "POST"])
@exception_handler
def members():
    if request.method == "GET":

        member_details = Members.query.all()
        member_schema = MembersScehema(many=True)
        member_details = member_schema.dump(member_details)
        return jsonify({"memberDetails": member_details})

    if request.method == "POST":
        frontend_data = request.get_json()
        new_member_name = frontend_data["memberName"]
        if not new_member_name:
            return (
                jsonify(
                    {"errorMessage": "Name not entered properly or was not present"}
                ),
                406,
            )

        new_member = Members(member_name=new_member_name)

        db.session.add(new_member)
        db.session.commit()
        memeber_details = Members.query.all()
        member_schema = MembersScehema(many=True)
        memeber_details = member_schema.dump(memeber_details)
        return jsonify({"memberDetails": memeber_details})


# update members
@app.route("/api/members/<int:id>/update", methods=["POST"])
@exception_handler
def update_members(id):
    try:
        member = Members.query.get_or_404(id)
    except:
        return jsonify({"errorMessage": "No such user found in database"}), 404

    if request.method == "POST":
        frontend_data = request.get_json()
        if not frontend_data:
            return jsonify({"errorMessage": "Name not entered properly"}), 406
        member.member_name = frontend_data["memberName"]

        db.session.commit()
        member_details = Members.query.all()
        member_schema = MembersScehema(many=True)
        member_details = member_schema.dump(member_details)
        return jsonify({"memberDetails": member_details})


# deleting members
@app.route("/api/members/<int:id>/delete", methods=["DELETE"])
@exception_handler
def delete_member(id):
    try:
        member = Members.query.get_or_404(id)
    except:
        return jsonify({"errorMessage": "No such user found in database"}), 404

    # should not be able to delete if there are any dues to be paid
    if member.outstanding_debt > 0:
        return jsonify({"errorMessage": "Outstanding debt remains, cannot delete"}), 405
    else:
        db.session.delete(member)
        db.session.commit()

        member_details = Members.query.all()
        member_schema = MembersScehema(many=True)
        member_details = member_schema.dump(member_details)
        return jsonify({"memberDetails": member_details})


@app.route("/api/members/<int:id>/books-in-possession", methods=["GET"])
def getBooksInPossession(id):
    r = db.engine.execute(
        """SELECT t.book_id, 
        SUM(CASE WHEN transaction_type = "issue" THEN 1 ELSE 0 END)-
        SUM(CASE WHEN transaction_type = "return" THEN 1 ELSE 0 END) AS balance,
        book_name,rent_price FROM transactions t 
        INNER JOIN books b ON t.book_id = b.book_id 
        WHERE member_id={} 
        GROUP BY b.book_id""".format(
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


@app.route("/api/transactions", methods=["GET"])
def transactions():

    if request.method == "GET":

        books = Books.query.all()
        book_schema = BooksSchema(many=True)
        books = book_schema.dump(books)

        members = Members.query.all()
        member_schema = MembersScehema(many=True)
        members = member_schema.dump(members)

        transactions = Transactions.query.all()
        transaction_schema = TransactionsSchema(many=True)
        transactions = transaction_schema.dump(transactions)

        return jsonify(
            {"transactions": transactions, "members": members, "books": books}
        )


# issue book transaction
@app.route("/api/transactions/issue-book", methods=["POST"])
def issueBook():

    details = request.get_json()
    book_id = int(details["book"])
    member_id = int(details["member"])
    transaction_type = "issue"

    if get_availability(book_id) and not check_outstanding_debt_limit(member_id):
        member = Members.query.get_or_404(member_id)
        book = Books.query.get_or_404(book_id)

        if member.outstanding_debt + book.rent_price >= 500:
            return (
                jsonify(
                    {
                        "errorMessage": "The user cannot be issued anymore books as the outstanding debt limit is crossed"
                    }
                ),
                405,
            )

        book.stocks_left = book.stocks_left - 1
        book.issued = book.issued + 1
        member.outstanding_debt = member.outstanding_debt + book.rent_price
        member.books_in_possession = member.books_in_possession + 1
        new_transaction = Transactions(
            book_id=book_id,
            member_id=member_id,
            transaction_type=transaction_type,
        )

        db.session.add(new_transaction)
        db.session.commit()
        return jsonify({"message": "database changed"})

    elif not get_availability(book_id):
        return jsonify({"errorMessage": "Book not available"}), 405

    elif check_outstanding_debt_limit(member_id):
        return (
            jsonify(
                {
                    "errorMessage": "The user cannot be issued anymore books as the outstanding debt limit is crossed"
                }
            ),
            405,
        )


# return book transaction
@app.route("/api/transactions/return-book", methods=["GET", "POST"])
@exception_handler
def returnBook():
    details = request.get_json()
    book_id = int(details["book"])
    member_id = int(details["member"])
    transaction_type = "return"

    # if the member has books_in_possession more than 0
    if check_if_booksin_possession(member_id):
        # return the book
        member = Members.query.get_or_404(member_id)
        book = Books.query.get_or_404(book_id)
        payment = book.rent_price
        book.stocks_left = book.stocks_left + 1
        book.issued = book.issued - 1
        member.outstanding_debt = member.outstanding_debt - payment
        member.total_paid = member.total_paid + payment
        member.books_in_possession = member.books_in_possession - 1

        new_transaction = Transactions(
            book_id=book_id, member_id=member_id, transaction_type=transaction_type
        )

        db.session.add(new_transaction)
        db.session.commit()
        return jsonify({"message": "database changed"})

    # if the member has books_in_possesion as 0
    if not check_if_booksin_possession(member_id):
        # do not retyrn any book
        return (
            jsonify(
                {
                    "errorMessage": "This member currently does not have any book in possession to be able to return"
                }
            ),
            406,
        )


@app.route("/api/report", methods=["GET"])
@exception_handler
def report():
    transactions = Transactions.query.all()
    transaction_schema = TransactionsSchema(many=True)
    transactions = transaction_schema.dump(transactions)

    query2 = db.engine.execute(
        """SELECT b.book_id, 
        b.book_name,b.stocks_left,(b.stocks_left+b.issued) AS total, 
        COUNT(DISTINCT t.member_id) AS number_of_members,
        COUNT(t.transaction_type = "issue") AS popularity 
        FROM books b 
        LEFT JOIN transactions t ON b.book_id = t.book_id 
        GROUP BY b.book_id 
        ORDER BY number_of_members DESC
        LIMIT 7"""
    ).fetchall()

    query1 = db.engine.execute(
        """SELECT b.book_id, b.book_name, b.stocks_left, (b.stocks_left+b.issued) AS total 
        FROM books b ORDER BY b.stocks_left DESC LIMIT 6"""
    ).fetchall()

    query3 = db.engine.execute(
        "SELECT * FROM members ORDER BY total_paid DESC LIMIT 5"
    ).fetchall()

    book_ranking_details = []
    member_ranking_details = []
    book_stock_details = []

    for row_number, row in enumerate(query2):
        book_ranking_details.append({})
        for column_number, value in enumerate(row):
            book_ranking_details[row_number][row.keys()[column_number]] = value

    
    for row_number, row in enumerate(query3):
        member_ranking_details.append({})
        for column_number, value in enumerate(row):
            member_ranking_details[row_number][row.keys()[column_number]] = value

    
    for row_number, row in enumerate(query1):
        book_stock_details.append({})
        for column_number, value in enumerate(row):
            book_stock_details[row_number][row.keys()[column_number]] = value


    return jsonify(
        {
            "bookRankingDetails": book_ranking_details,
            "memberRankingDetails": member_ranking_details,
            "bookStockDetails": book_stock_details
        }
    )


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