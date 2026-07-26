# FeastFlow

FeastFlow grew out of a familiar community problem: an event is planned, everyone wants to help, but nobody has a clear view of who is coming, what is still needed, or who already promised to bring something.

The application gives churches, community groups and families one shared place to organise meals, events and contributions without turning the process into a spreadsheet chain or a long chat thread.

## What it does

- Create and manage community events
- Coordinate meals, quantities and contributions
- Let participants RSVP and claim items
- Show organisers what is covered and what is still missing
- Separate administrator, contributor and guest permissions
- Support multiple languages through Django localization
- Provide participation and contribution overviews
- Handle uploaded event material

## Roles

| Role | Access |
| --- | --- |
| Administrator | Manages users, events, settings and contributions |
| Contributor | Responds to events and assigns available items |
| Guest / viewer | Reads published event and menu information |

## Local setup

Requirements:

- Python 3.10+
- `pip`
- Git

```bash
git clone https://github.com/mignoncharly/feastflow.git
cd feastflow

python -m venv .venv
source .venv/bin/activate
# Windows: .venv\Scripts\activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Open `http://127.0.0.1:8000`.

## Localization

Translation files live in `locale/`.

```bash
django-admin makemessages -l de
django-admin compilemessages
```

When adding a language, review the full user journey rather than translating isolated labels. Event names and user-generated content remain separate from interface translations.

## Project structure

| Path | Purpose |
| --- | --- |
| `apps` | Users, events, meals and related domain logic |
| `config` | Django settings and URL configuration |
| `templates` | Server-rendered pages |
| `static` | Project CSS, JavaScript and images |
| `locale` | Translation catalogues |
| `media` | User-uploaded development media |

## Production notes

The development database uses SQLite. A production installation should use PostgreSQL, keep secrets outside Git, run behind a production application server, and serve static files through the web server or object storage.

Run migrations and `collectstatic` as part of a controlled release. Review user-upload handling, permissions and backups before accepting real community data.

## Why the project exists

FeastFlow is intentionally practical. Its goal is not to add software to a simple gathering; it is to remove uncertainty so that organisers can focus on hospitality, participation and good stewardship.
