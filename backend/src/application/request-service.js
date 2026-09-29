import { randomUUID } from 'node:crypto';
import { fail, positiveId, text, priority, futureDate, transition, openStatuses } from '../domain/policy.js';
// Backend integration boundary centralises authorization and atomic business operations.
export class RequestService {
  constructor(repository, clock = () => new Date().toISOString()) { this.repo=repository; this.clock=clock; }
  authorized(user,id,write=false) {
    positiveId(id); const r=this.repo.get(id);
    const visible=r && (user.role==='Oversight' || (user.role==='Requester' && r.requester_id===user.id) || (user.role==='Staff' && this.repo.eligible(user.id,r.category_id)));
    fail(visible,404,'Request not found');
    if(write) fail(user.role==='Staff',403,'Staff access required');
    return r;
  }
  detail(user,id) { const r=this.authorized(user,id); return {...r,activities:this.repo.history(id,user.role==='Requester')}; }
  create(user,input) {
    fail(user.role==='Requester',403,'Requester access required');
    const title=text(input.title,'Title',120), description=text(input.description,'Description',4000), location=text(input.location??'','Location',200,false);
    positiveId(input.category_id);
    return this.repo.transaction(()=>{
      const category=this.repo.category(input.category_id);
      fail(category?.active===1,400,'Select an active category');
      const at=this.clock();
      const r=this.repo.insert({reference:`CC-${randomUUID()}`,requester_id:user.id,category_id:category.id,category_label:category.name,title,description,location,created_at:at});
      this.repo.activity({},r,user,'Received','Request received','Public',at); return r;
    });
  }
  mutate(user,id,input,kind) {
    positiveId(input.version);
    return this.repo.transaction(()=>{
      const before=this.authorized(user,id,true);
      fail(before.version===input.version,409,'This request changed. Refresh before trying again.');
      const next={...before}, now=this.clock(); let note='', visibility='Public';
      if(kind==='assign') {
        fail(openStatuses.includes(before.status),400,'Only open requests can be assigned');
        positiveId(input.owner_id); fail(this.repo.eligible(input.owner_id,before.category_id),400,'Owner is not eligible for this category');
        next.owner_id=input.owner_id; next.priority=priority(input.priority); next.due_at=futureDate(input.due_at,now);
        if(before.status==='Received') next.status=transition(before.status,'Assigned','');
        note=text(input.note,'Assignment reason',2000);
      } else if(kind==='schedule') {
        fail(openStatuses.includes(before.status),400,'Only open requests can be scheduled');
        next.priority=priority(input.priority); next.due_at=futureDate(input.due_at,now); note=text(input.note,'Change reason',2000);
      } else if(kind==='status') {
        fail(input.status!=='Assigned',400,'Use assignment to set owner and due date');
        note=text(input.note??'','Reason or summary',2000,['Rejected','Resolved'].includes(input.status));
        next.status=transition(before.status,input.status,note);
        if(next.status==='Resolved') next.resolved_at=now;
        note=note || `Status changed to ${next.status}`;
      } else if(kind==='note') {
        note=text(input.note,'Note',2000); fail(['Public','Internal'].includes(input.visibility),400,'Select note visibility'); visibility=input.visibility;
      } else { fail(false,400,'Unknown operation'); }
      const after=this.repo.update(next,input.version);
      this.repo.activity(before,after,user,kind,note,visibility,now); return after;
    });
  }
  list(user,filters={}) {
    let rows=this.repo.scoped(user);
    if(filters.q) { const q=filters.q.toLowerCase(); rows=rows.filter(r=>r.title.toLowerCase().includes(q)||r.reference.toLowerCase().includes(q)); }
    for(const [key,col] of [['status','status'],['category','category_id'],['owner','owner_id'],['priority','priority']]) if(filters[key]) rows=rows.filter(r=>String(r[col])===filters[key]);
    const dates=this.dateRange(filters); rows=rows.filter(r=>(!dates.from || r.created_at>=dates.from)&&(!dates.to || r.created_at<dates.to));
    const key=filters.sort==='due_at'?'due_at':'created_at', dir=filters.direction==='asc'?1:-1;
    rows.sort((a,b)=>a[key]===null?(b[key]===null?a.id-b.id:1):b[key]===null?-1:(a[key].localeCompare(b[key])*dir || a.id-b.id));
    return rows;
  }
  dateRange(filters) {
    const result={};
    for(const k of ['from','to']) if(filters[k]) {
      fail(/^\d{4}-\d{2}-\d{2}$/.test(filters[k]),400,'Use YYYY-MM-DD dates');
      const d=new Date(`${filters[k]}T00:00:00.000Z`); fail(Number.isFinite(+d)&&d.toISOString().slice(0,10)===filters[k],400,'Invalid date');
      if(k==='to') d.setUTCDate(d.getUTCDate()+1); result[k]=d.toISOString();
    }
    fail(!result.from||!result.to||result.from<result.to,400,'End date must not precede start date'); return result;
  }
  report(user,filters) {
    fail(user.role==='Oversight',403,'Oversight access required');
    const rows=this.list(user,{from:filters.from,to:filters.to}), groups=new Map(), now=this.clock();
    for(const r of rows) {
      const key=r.category_id;
      if(!groups.has(key)) groups.set(key,{category:r.category_label,total:0,open:0,overdue:0,undated:0,resolved:0,closed:0,rejected:0,resolution_hours:[],owners:{}});
      const g=groups.get(key); g.total++;
      if(openStatuses.includes(r.status)) { g.open++; if(!r.due_at) g.undated++; else if(r.due_at<now) g.overdue++; }
      if(['Resolved','Closed','Rejected'].includes(r.status)) g[r.status.toLowerCase()]++;
      if(['Resolved','Closed'].includes(r.status)&&r.resolved_at) g.resolution_hours.push((Date.parse(r.resolved_at)-Date.parse(r.created_at))/3600000);
      g.owners[r.owner_id??'Unassigned']=(g.owners[r.owner_id??'Unassigned']??0)+1;
    }
    return [...groups.values()].map(({resolution_hours,...g})=>({...g,mttr_hours:resolution_hours.length?resolution_hours.reduce((a,b)=>a+b,0)/resolution_hours.length:null}));
  }
}
