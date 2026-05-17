from flask import Blueprint, redirect, url_for, render_template
from flask_login import current_user, login_required

drive_bp = Blueprint('drive', __name__)

@drive_bp.get("/")
def index():
    if current_user.is_authenticated:
        return redirect(url_for('drive.dashboard'))
    return redirect(url_for("auth.login_get"))

@drive_bp.get("/dashboard")
@login_required
def dashboard():
    return render_template("dashboard.html", title="Dashboard")
