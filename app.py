from flask import Flask, redirect, url_for, render_template, request, session
from flask_pymongo import PyMongo
from bson import ObjectId
from datetime import datetime
from datetime import timedelta

app = Flask(__name__)
app.secret_key = "abc"
app.config["MONGO_URI"] = "mongodb+srv://admin:Password1@mongo-cluster.pum38.mongodb.net/FarmKart?retryWrites=true&w=majority"
mongo = PyMongo(app)

login_details = mongo.db.loginDetails
item_details = mongo.db.ITEMS
items_on_sale = mongo.db.itemsOnSale
carts = mongo.db.carts


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/signup", methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        credentials = request.form.to_dict()
        fname = credentials["fname"]
        lname = credentials["lname"]
        email = credentials["email"]
        password = credentials["password"]
        existing_user = login_details.find_one(({"email": email}))
        if existing_user is None:
            login_details.insert_one(
                {"fname": fname, "lname": lname, "email": email, "password": password, "type": "user"})
            return redirect(url_for("login"))
        else:
            return render_template("signup.html", incorrect="User already exists")
    else:
        if not 'loggedIn' in session:
            return render_template("signup.html")
        else:
            return redirect(url_for("home"))


@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        credentials = request.form.to_dict()
        existing_user = login_details.find_one({"email": credentials['email']})
        if existing_user is None:
            return render_template("login.html", incorrect="Invalid email id or password!!!")
        else:
            if credentials['email'] == existing_user["email"] and credentials['password'] == existing_user['password']:
                session['loggedIn'] = True
                session['userId'] = existing_user['email']
                session['reqMethod'] = 'GET'
                user_cart = carts.find_one({'userId': session['userId']})
                if user_cart is None:
                    session['cartCount'] = 0
                else:
                    if 'cart' in user_cart:
                        session['cartCount'] = len(user_cart['cart'])
                    else:
                        session['cartCount'] = 0
                if existing_user["type"] == 'farmer':
                    session['privileges'] = 'farmer'
                else:
                    session['privileges'] = 'user'
                if session.get('req'):
                    return redirect(session["req"])
                else:
                    return redirect(url_for("home"))
            else:
                return render_template("login.html", incorrect="Invalid email id or password!!!")
    else:
        if not 'loggedIn' in session:
            return render_template("login.html")
        else:
            return redirect(url_for("home"))


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("home"))


@app.route("/fruits")
def fruits():
    fruits = items_on_sale.find({"type": "fruit"}).sort([("quantity", -1)])
    return render_template("items.html", items=fruits, type='fruit')


@app.route("/vegetables")
def vegetables():
    vegetables = items_on_sale.find(
        {"type": "vegetable"}).sort([("quantity", -1)])
    return render_template("items.html", items=vegetables, type='vegetable')


@app.route("/pulses")
def pulses():
    pulses = items_on_sale.find(
        {"type": "pulse"}).sort([("quantity", -1)])
    return render_template("items.html", items=pulses, type='pulse')


@app.route("/product/<id>", methods=['GET', 'POST'])
def product(id):
    if request.method == 'POST':
        if not 'loggedIn' in session:
            session["req"] = request.url
            return redirect(url_for("login"))
        else:
            item = session['item']
            quantity = request.form.to_dict()['itemCount']
            user_cart = carts.find_one({'userId': session['userId']})
            if user_cart is None:
                carts.insert_one(
                    {'userId': session['userId'], 'cart': {id: {'farmer_name': item['farmer_name'], 'img': item['img'], 'max_value': item['quantity'], 'name': item['name'], 'price': item['price'], 'quantity': quantity}}})
            else:
                carts.update_one({'userId': session['userId']}, {
                                 '$set': {'cart.' + id + '.farmer_name': item['farmer_name'], 'cart.' + id + '.img': item['img'], 'cart.' + id + '.max_value': item['quantity'], 'cart.' + id + '.name': item['name'], 'cart.' + id + '.price': item['price'], 'cart.' + id + '.quantity': quantity}})
            user_cart = carts.find_one({'userId': session['userId']})
            session['cartCount'] = len(user_cart['cart'])
            session['reqMethod'] = request.method
            return redirect(url_for("product", id=id))
    item = items_on_sale.find_one({"_id": ObjectId(id)})
    itemCopy = item.copy()
    itemCopy.pop('_id')
    session['item'] = itemCopy
    similarItems = items_on_sale.find(
        {"type": item['type'], 'name': item['name']})
    in_cart = False
    if 'loggedIn' in session:
        if session['reqMethod'] == 'POST':
            session['modalDisplay'] = True
        else:
            session['modalDisplay'] = False
        user_cart = carts.find_one({'userId': session['userId']})
        if user_cart is not None:
            if 'cart' in user_cart:
                if id in user_cart['cart'].keys():
                    in_cart = True
        session['reqMethod'] = request.method
    return render_template("product.html", item=item, similarItems=similarItems, in_cart=in_cart)


@app.route("/cart", methods=['GET', 'POST'])
def cart():
    if request.method == 'POST':
        session['price_details'] = request.form.to_dict()
        return redirect(url_for('address'))
    if not 'loggedIn' in session:
        session["req"] = request.url
        return redirect(url_for("login"))
    user_cart = carts.find_one({'userId': session['userId']})
    if user_cart is None:
        session['cartCount'] = 0
        cart = {}
        cart_id = ''
    else:
        if 'cart' in user_cart:
            session['cartCount'] = len(user_cart['cart'])
            cart = user_cart['cart']
        else:
            session['cartCount'] = 0
            cart = {}
        cart_id = user_cart['_id']
    return render_template("cart.html", cart=cart, cart_id=cart_id)


@app.route("/delete", methods=['POST'])
def delete():
    cart_id = str(request.form['cart_id'])
    item_id = str(request.form['item_id'])
    carts.update_one({"_id": ObjectId(cart_id)}, {
                     '$unset': {'cart.' + item_id: ''}})
    user_cart = carts.find_one({"_id": ObjectId(cart_id)})
    session['cartCount'] = len(user_cart['cart'])
    return 'True'


@app.route("/address")
def address():
    if not 'loggedIn' in session:
        return redirect(url_for("login"))
    return render_template('address.html')


@app.route("/payment")
def payment():
    if not 'loggedIn' in session:
        return redirect(url_for("login"))
    # user_cart = carts.find_one({'userId': session['userId']})
    # console.log(user_cart)
    carts.update_one({'userId': session['userId']}, {'$unset': {'cart': ''}})
    session['cartCount'] = 0
    return render_template('payment.html')


@app.route("/portal")
def portal():
    if 'loggedIn' in session:
        if session['privileges'] == 'farmer':
            farmer = login_details.find_one({"email": session['userId']})
            crops = items_on_sale.find({"farmer_id": farmer['farmer_id']})
            return render_template("portal.html", farmer=farmer, crops=crops)
        else:
            return redirect(url_for("home"))
    else:
        session["req"] = request.url
        return redirect(url_for("login"))


@app.route("/addcrops", methods=['GET', 'POST'])
def addcrops():
    if request.method == 'POST':
        formdata = request.form.to_dict()
        item = {}
        item['name'] = formdata['product']
        item['type'] = formdata['category'].lower()[:-1]
        item['price'] = int(formdata['price'])
        item['quantity'] = int(formdata['quantity'])
        item['description'] = formdata['description']
        item['img'] = formdata['product'].lower().replace(' ', '')
        farmer = login_details.find_one({"email": session['userId']})
        item['farmer_id'] = farmer['farmer_id']
        item['farmer_name'] = farmer['fname'] + ' ' + farmer['lname']
        items_on_sale.insert_one(item)
        session['reqMethod'] = request.method
        return redirect(url_for('addcrops'))
    if 'loggedIn' in session:
        if session['privileges'] == 'farmer':
            if session['reqMethod'] == 'POST':
                session['modalDisplay'] = True
            else:
                session['modalDisplay'] = False
            session['reqMethod'] = request.method
            return render_template("addcrops.html")
        else:
            return redirect(url_for("home"))
    else:
        session["req"] = request.url
        return redirect(url_for("login"))


@app.route("/selectcrop", methods=['GET', 'POST'])
def selectcrop():
    if request.method == 'POST':
        session['factors'] = request.form.to_dict()
        session['date'] = datetime.strptime(
            session['factors']['month'], "%Y-%m-%d")
        return redirect(url_for('result'))
    if 'loggedIn' in session:
        if session['privileges'] == 'farmer':
            return render_template("selectcrop.html")
        else:
            return redirect(url_for("home"))
    else:
        session["req"] = request.url
        return redirect(url_for("login"))


@app.route("/result")
def result():
    if 'loggedIn' in session:
        if session['privileges'] == 'farmer':
            if session.get('factors'):
                month = datetime.strftime(session['date'], "%B")
                result_cur = item_details.find({'Type': session['factors']['category'],
                                                'Sowing_Season': month,
                                                'District': session['factors']['district'],
                                                'Soil_Type': session['factors']['soil']})
                result_items = []
                for i in result_cur:
                    result_items.append(i)
                for i in range(len(result_items)):
                    harvest_date = session['date'] + \
                        timedelta(days=result_items[i]['Harvest_Time']*30)
                    current_date = datetime.strftime(
                        session['date'], "01-%m-%Y")
                    result_items[i]['harvest_date'] = datetime.strftime(
                        harvest_date, "01-%m-%Y")
                    if result_items[i]['harvest_date'] in result_items[i]['Predicted_Price'].keys():
                        result_items[i]['price'] = result_items[i]['Predicted_Price'][result_items[i]['harvest_date']]
                    else:
                        result_items[i]['price'] = result_items[i]['Predicted_Price'][current_date]
                print(session['factors'], len(result_items))
                return render_template("result.html", result_items=result_items)
            else:
                return redirect(url_for('portal'))
        else:
            return redirect(url_for("home"))
    else:
        session["req"] = request.url
        return redirect(url_for("login"))


@app.route("/congrats")
def congrats():
    if 'loggedIn' in session:
        if session['privileges'] == 'farmer':
            farmer = login_details.find_one({"email": session['userId']})
            crops = items_on_sale.find({"farmer_id": farmer['farmer_id']})
            return render_template("congrats.html")
        else:
            return redirect(url_for("home"))
    else:
        session["req"] = request.url
        return redirect(url_for("login"))


@app.route("/editprofile")
def editprofile():
    if 'loggedIn' in session:
        if session['privileges'] == 'farmer':
            farmer = login_details.find_one({"email": session['userId']})
            crops = items_on_sale.find({"farmer_id": farmer['farmer_id']})
            return render_template("editprofile.html")
        else:
            return redirect(url_for("home"))
    else:
        session["req"] = request.url
        return redirect(url_for("login"))


if __name__ == "__main__":
    app.run(debug=True)
