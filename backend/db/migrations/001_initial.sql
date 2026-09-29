CREATE TABLE users (
 id INTEGER PRIMARY KEY, username TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
 password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('Requester','Staff','Oversight')),
 active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1))
);
CREATE TABLE categories (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)));
CREATE TABLE staff_categories (user_id INTEGER NOT NULL REFERENCES users(id), category_id INTEGER NOT NULL REFERENCES categories(id), PRIMARY KEY(user_id,category_id));
CREATE TABLE requests (
 id INTEGER PRIMARY KEY, reference TEXT NOT NULL UNIQUE, requester_id INTEGER NOT NULL REFERENCES users(id),
 category_id INTEGER NOT NULL REFERENCES categories(id), category_label TEXT NOT NULL,
 title TEXT NOT NULL CHECK(length(title) BETWEEN 1 AND 120), description TEXT NOT NULL CHECK(length(description) BETWEEN 1 AND 4000), location TEXT NOT NULL DEFAULT '',
 status TEXT NOT NULL DEFAULT 'Received' CHECK(status IN ('Received','Assigned','In progress','Resolved','Closed','Rejected')),
 priority TEXT NOT NULL DEFAULT 'Normal' CHECK(priority IN ('Low','Normal','High')),
 owner_id INTEGER REFERENCES users(id), due_at TEXT, created_at TEXT NOT NULL, resolved_at TEXT,
 version INTEGER NOT NULL DEFAULT 1 CHECK(version>0),
 CHECK(status NOT IN ('Assigned','In progress','Resolved','Closed') OR (owner_id IS NOT NULL AND due_at IS NOT NULL)),
 CHECK(due_at IS NULL OR due_at > created_at)
);
CREATE TABLE activities (
 id INTEGER PRIMARY KEY, request_id INTEGER NOT NULL REFERENCES requests(id), actor_id INTEGER NOT NULL REFERENCES users(id),
 kind TEXT NOT NULL, note TEXT NOT NULL, visibility TEXT NOT NULL CHECK(visibility IN ('Public','Internal')),
 old_values TEXT NOT NULL, new_values TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE TRIGGER activities_no_update BEFORE UPDATE ON activities BEGIN SELECT RAISE(ABORT,'Activities are append only'); END;
CREATE TRIGGER activities_no_delete BEFORE DELETE ON activities BEGIN SELECT RAISE(ABORT,'Activities are append only'); END;
CREATE TABLE sessions (token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), csrf TEXT NOT NULL, expires_at INTEGER NOT NULL);
CREATE INDEX requests_requester_created ON requests(requester_id,created_at);
CREATE INDEX requests_category_status ON requests(category_id,status);
CREATE INDEX requests_due ON requests(due_at);
CREATE INDEX activities_request ON activities(request_id,id);
CREATE INDEX sessions_expiry ON sessions(expires_at);
