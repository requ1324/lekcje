from flask import Flask
from admin.routes import admin_bp
from auth.routes import auth_bp
from blog.routes import blog_bp

app = Flask(__name__)
app.register_blueprint(admin_bp, url_prefix='/admin')
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(blog_bp, url_prefix='/blog')

if __name__ == '__main__':
    app.run(debug=True)