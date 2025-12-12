# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, flash, redirect, url_for, send_from_directory
import os
import sqlite3
from datetime import datetime

app = Flask(__name__)
app.secret_key = "your-secret-key-here"

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "submissions.db")


def initialize_database():
    with sqlite3.connect(DB_PATH) as connection:
        cursor = connection.cursor()

        # Заявки с формы "Контакты"
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS contact_submissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                message TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)

        # Заявки с формы "Бриф"
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS brief_submissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                message TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)

        connection.commit()


initialize_database()


def save_to_table(table_name: str):
    """Сохраняет заявку в указанную таблицу и возвращает redirect."""
    name = (request.form.get("name") or "").strip()
    email = (request.form.get("email") or "").strip()
    phone = (request.form.get("phone") or "").strip()
    message = (request.form.get("message") or "").strip()

    redirect_to = request.referrer or url_for("contact")

    if not name or not email or not message:
        flash("Заполните обязательные поля: имя, email и сообщение.")
        return redirect(redirect_to)

    try:
        with sqlite3.connect(DB_PATH) as connection:
            connection.execute(
                f"INSERT INTO {table_name} (name, email, phone, message, created_at) VALUES (?, ?, ?, ?, ?)",
                (name, email, phone, message, datetime.utcnow().isoformat(timespec="seconds"))
            )
            connection.commit()
    except Exception:
        flash("Произошла ошибка при сохранении данных. Попробуйте позже.")
        return redirect(redirect_to)

    flash("Спасибо за обращение! Мы свяжемся с вами в ближайшее время.")
    return redirect(redirect_to)

@app.route("/favicon.ico")
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, "static", "img"),
        "favicon.ico",
        mimetype="image/vnd.microsoft.icon"
    )


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/portfolio")
def portfolio():
    return render_template("portfolio.html")


@app.route("/price")
def price():
    return render_template("price.html")


@app.route("/articles")
def articles():
    return render_template("articles.html")


@app.route("/contact")
def contact():
    return render_template("contact.html")


@app.route("/form")
def form():
    return render_template("form.html")


# Отправка формы "Контакты"
@app.route("/submit_contact", methods=["POST"])
def submit_contact():
    return save_to_table("contact_submissions")


# Отправка формы "Бриф"
@app.route("/submit_brief", methods=["POST"])
def submit_brief():
    return save_to_table("brief_submissions")


# Просмотр всех заявок (две таблицы)
@app.route("/submissions")
def submissions():
    with sqlite3.connect(DB_PATH) as connection:
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()

        cursor.execute("SELECT * FROM contact_submissions ORDER BY id DESC")
        contact_rows = cursor.fetchall()

        cursor.execute("SELECT * FROM brief_submissions ORDER BY id DESC")
        brief_rows = cursor.fetchall()

    # ВАЖНО: переменные называются так же, как в шаблоне ниже
    return render_template(
        "submissions.html",
        contact_submissions=contact_rows,
        brief_submissions=brief_rows
    )


if __name__ == "__main__":
    if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
        print("Заявки:   http://127.0.0.1:5000/submissions")
    app.run(debug=True)


