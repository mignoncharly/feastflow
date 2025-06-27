# FeastFlow 🍽️

**A streamlined web app for managing food sharing, meal planning, and event coordination.**

FeastFlow helps communities, churches, and social groups easily coordinate shared meals, track contributions, and simplify event logistics. Designed with clarity and community in mind.

---

## 🚀 Features

* ✅ **User Registration & Authentication**
  Secure sign-up and login system for different user roles (e.g., admin, contributor, guest).

* 🍛 **Meal/Event Management**
  Create, update, and track food events and contributions.

* 📊 **Contribution Dashboard**
  View real-time summaries of who brings what, quantities, and categories.

* 🧑‍🍳 **Role-Based Access Control**
  Admins can manage users, while regular users can view or contribute items.

* 🌍 **Multi-language Support**
  Built-in localization for multilingual audiences.

* 📅 **Calendar & RSVP Integration**
  Easily track upcoming events and participants.

---

## 🧱 Tech Stack

* **Backend**: Django (Python)
* **Frontend**: HTML/CSS, JavaScript, Bootstrap
* **Database**: SQLite in development
* **Authentication**: Django Auth with custom user roles
* **Localization**: JSON-based i18n (e.g., en, fr, de, es)

---

## ⚙️ Installation

### Requirements

* Python 3.10+
* pip
* Git
* Node.js (optional, if using Webpack or JS bundlers)

### Setup

```bash
git clone https://github.com/yourusername/feastflow.git
cd feastflow
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Visit `http://127.0.0.1:8000` to explore the app locally.

---

## 🌐 Localization

Translation files are located in `/locale/` and use Django’s `.po` format. Add new languages via:

```bash
django-admin makemessages -l de  # example for German
django-admin compilemessages
```

---

## 🛡️ Roles & Permissions

| Role        | Capabilities                           |
| ----------- | -------------------------------------- |
| Admin       | Manage users, events, and data         |
| Manager     | Create/edit events, assign roles       |
| Contributor | Add meal contributions, RSVP to events |
| Guest       | View-only access                       |

---

## 📁 Folder Structure

```
feastflow/
├── feastflow_project/   # Django project settings
├── meals/               # App for event/meal management
├── users/               # Custom user management
├── templates/
├── static/
└── locale/              # Translations
```

---

## 🙌 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📜 License

MIT License. See `LICENSE` file for details.

---

## ✝️ Inspired By

FeastFlow is part of a broader vision to serve Christian and community-based groups with tools for connection, stewardship, and generosity.
