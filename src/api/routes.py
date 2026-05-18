"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
 
api = Blueprint('api', __name__)
CORS(api)
bcrypt = Bcrypt()
 
 
@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200
 
 

@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()
    email = body.get("email", "").strip().lower()
    password = body.get("password", "")
 
    if not email or not password:
        raise APIException("Email y contraseña son requeridos", status_code=400)
 
    if User.query.filter_by(email=email).first():
        raise APIException("El correo ya está registrado", status_code=409)
 
    hashed = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(email=email, password=hashed, is_active=True)
    db.session.add(new_user)
    db.session.commit()
 
    return jsonify({"msg": "Usuario creado exitosamente"}), 201
 
 

@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    email = body.get("email", "").strip().lower()
    password = body.get("password", "")
 
    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        raise APIException("Credenciales inválidas", status_code=401)
 
    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.serialize()}), 200
 

@api.route('/validate-token', methods=['GET'])
@jwt_required()
def validate_token():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        raise APIException("Usuario no encontrado", status_code=404)
    return jsonify({"user": user.serialize()}), 200