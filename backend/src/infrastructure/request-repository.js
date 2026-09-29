import { fail } from '../domain/policy.js';
// ADR-P2-001: SQL is kept behind this repository; the service owns transaction scope.
export class RequestRepository {
  constructor(db) { this.db = db; }
  transaction(work) {
    this.db.exec('BEGIN IMMEDIATE');
    try { const result = work(); this.db.exec('COMMIT'); return result; }
    catch (e) { this.db.exec('ROLLBACK'); throw e; }
  }
  get(id) { return this.db.prepare('SELECT * FROM requests WHERE id=?').get(id); }
  scoped(user) {
    if (user.role === 'Requester') return this.db.prepare('SELECT * FROM requests WHERE requester_id=?').all(user.id);
    if (user.role === 'Staff') return this.db.prepare('SELECT * FROM requests WHERE category_id IN (SELECT category_id FROM staff_categories WHERE user_id=?)').all(user.id);
    return this.db.prepare('SELECT * FROM requests').all();
  }
  eligible(userId, categoryId) { return !!this.db.prepare("SELECT 1 FROM staff_categories s JOIN users u ON u.id=s.user_id WHERE user_id=? AND category_id=? AND u.role='Staff' AND u.active=1").get(userId,categoryId); }
  category(id) { return this.db.prepare('SELECT * FROM categories WHERE id=?').get(id); }
  insert(r) {
    const result = this.db.prepare('INSERT INTO requests(reference,requester_id,category_id,category_label,title,description,location,created_at) VALUES(?,?,?,?,?,?,?,?)').run(r.reference,r.requester_id,r.category_id,r.category_label,r.title,r.description,r.location,r.created_at);
    return this.get(Number(result.lastInsertRowid));
  }
  update(r, expectedVersion) {
    const result = this.db.prepare('UPDATE requests SET status=?,priority=?,owner_id=?,due_at=?,resolved_at=?,version=version+1 WHERE id=? AND version=?').run(r.status,r.priority,r.owner_id,r.due_at,r.resolved_at,r.id,expectedVersion);
    fail(result.changes === 1,409,'This request changed. Refresh before trying again.');
    return this.get(r.id);
  }
  activity(before, after, actor, kind, note, visibility, at) {
    this.db.prepare('INSERT INTO activities(request_id,actor_id,kind,note,visibility,old_values,new_values,created_at) VALUES(?,?,?,?,?,?,?,?)').run(after.id,actor.id,kind,note,visibility,JSON.stringify(before),JSON.stringify(after),at);
  }
  history(id, requester) {
    const rows = this.db.prepare(`SELECT a.*,u.name AS actor_name FROM activities a JOIN users u ON u.id=a.actor_id WHERE request_id=? ${requester ? "AND visibility='Public'" : ''} ORDER BY a.id`).all(id);
    // Never include internal audit snapshots in requester responses.
    return rows.map(({ old_values, new_values, ...a }) => requester ? a : {...a,old_values:JSON.parse(old_values),new_values:JSON.parse(new_values)});
  }
}
