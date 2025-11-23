# 🥘 FeastFlow

**FeastFlow** is a web application designed to streamline the organization of shared meals, events, and contributions—ideal for churches, community groups, or families. It offers role-based access, real-time overviews, and multilingual support to bring people together through hospitality and order.

---

## 📁 Project Structure

```
FeastFlow/
├── apps/               # Django apps (e.g., users, events, meals)
├── config/             # Project-level settings and URLs
├── locale/             # Language files for i18n
├── media/              # Uploaded files (e.g., images, attachments)
├── static/             # Custom static files (CSS, JS, images)
├── staticfiles/        # Collected static files for deployment
├── templates/          # HTML templates
├── .vscode/            # Editor configuration (optional)
├── venv/               # Python virtual environment (excluded from repo)
├── db.sqlite3          # Default SQLite database (development)
├── manage.py           # Django management script
├── requirements.txt    # Python dependencies
├── README.md           # Project documentation
└── .gitattributes      # Git settings
```

---

## 🚀 Key Features

* 🔐 **Role-Based Access**: Admins manage users, events, and settings; contributors can RSVP or bring meals.
* 🍽️ **Meal/Event Coordination**: Plan who brings what, track quantities, and avoid overlaps.
* 🌐 **Localization**: Multilingual interface (powered by Django’s `locale/` and `.po` files).
* 📊 **Real-Time Dashboards**: See contributions and participation at a glance.
* 💾 **File Uploads**: Manage media (menus, images, or resources) via the `media/` folder.

---

## ⚙️ Setup & Installation

### ✅ Requirements

* Python 3.10+
* pip (Python package manager)
* Git
* (Optional) virtualenv or venv

### 🔧 Quickstart

```bash
git clone https://github.com/yourusername/feastflow.git
cd feastflow
python -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

Visit `http://127.0.0.1:8000` in your browser.

---

## 🌍 Localization

FeastFlow supports multiple languages via Django's translation system. To add or compile messages:

```bash
# Create message file for a new language (e.g., German)
django-admin makemessages -l de

# After editing .po files in /locale/
django-admin compilemessages
```

All translation files are located under `/locale/`.

---

## 👥 Roles & Permissions

| Role         | Description                                   |
| ------------ | --------------------------------------------- |
| Admin        | Full access, can create/edit users and events |
| Contributor  | Can RSVP and assign items to themselves       |
| Viewer/Guest | Read-only access to view events and menus     |

Roles are enforced through custom middleware and decorators (typically in your `apps/users/`).

---

## 📦 Deployment Notes

* Use `collectstatic` for production static files.
* You may configure Gunicorn + Nginx or deploy to platforms like **Render**, **Heroku**, or **Docker**.
* Environment variables (e.g., `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`) should be defined securely using `.env` or in deployment settings.

---

## 🛠️ Technologies Used

* Django (Backend Framework)
* HTML/CSS/JavaScript (Frontend)
* Bootstrap (UI Styling)
* SQLite (Dev Database) — PostgreSQL recommended for production
* Django’s built-in Auth System
* Django i18n for Localization

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

---

## 📜 License

This project is open-source under the **MIT License**. See the `LICENSE` file for details.

---

## ✝️ Vision

FeastFlow reflects a vision of shared community, hospitality, and stewardship—especially for Christian fellowships and mission-driven groups.
