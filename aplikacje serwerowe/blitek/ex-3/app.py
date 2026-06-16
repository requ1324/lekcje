from pathlib import Path

from flask import Flask, render_template

from blueprints import analiza_bp


def create_app() -> Flask:
    app = Flask(__name__, template_folder='templates')

    data_path = Path(__file__).resolve().parent / 'data'
    data_path.mkdir(parents=True, exist_ok=True)

    app.register_blueprint(analiza_bp)
    return app


app = create_app()


@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
