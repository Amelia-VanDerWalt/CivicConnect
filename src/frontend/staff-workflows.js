/* Completes the existing staff and oversight API journeys. */
(() => {
    let epoch = 0;
    let staff = [];
    let filterValues = {};
    const priorities = ['Low', 'Normal', 'High'];
    const statuses = ['Received', 'Assigned', 'In progress', 'Resolved', 'Closed', 'Rejected'];
    const open = ['Received', 'Assigned', 'In progress'];
    const root = document.createElement('div');
    root.id = 'operations-view';
    root.className = 'view';
    document.body.append(root);
    const css = document.createElement('style');
    css.textContent = `
        #operations-view { overflow-wrap:anywhere; }
        #operations-view .ops-main { padding:24px; max-width:1400px; margin:auto; }
        #operations-view .ops-toolbar { display:flex; gap:12px; flex-wrap:wrap; margin:16px 0; }
        #operations-view .ops-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr)); gap:16px; }
        #operations-view label { display:block; margin:10px 0; font-weight:600; }
        #operations-view input,#operations-view select,#operations-view textarea { display:block; box-sizing:border-box; width:100%; margin-top:6px; font:inherit; padding:9px; }
        #operations-view button { font:inherit; padding:9px 14px; cursor:pointer; }
        #operations-view button:disabled { cursor:wait; }
        #operations-view button[type="submit"] {
            background:#164e9b;
            color:#fff;
            border:1px solid #164e9b;
            border-radius:7px;
            padding:10px 20px;
            min-height:44px;
            font-weight:600;
        }
        #operations-view button[type="submit"]:hover {
            background:#103d7a;
        }
        #operations-view .ops-grid > button[type="submit"] {
            align-self:end;
            justify-self:start;
            margin-bottom:10px;
        }
        #operations-view :focus-visible { outline:3px solid #164e9b; outline-offset:3px; }
        #operations-view .ops-table { overflow:auto; }
        #operations-view table { width:100%; border-collapse:collapse; }
        #operations-view th,#operations-view td { padding:12px; text-align:left; border-bottom:1px solid #ddd; vertical-align:top; }
        #operations-view dd { white-space:pre-wrap; margin:4px 0 12px; }
        #operations-view dt { font-weight:bold; }
        #operations-view .ops-error { color:#991b1b; white-space:pre-wrap; }
        #operations-view .ops-history li { margin:14px 0; padding:12px; border-left:3px solid #94a3b8; }
        #operations-view .ops-history p { white-space:pre-wrap; }
        #operations-view .ops-important { background:#f0fdf4; }
        @media(max-width:700px) { #operations-view .ops-main { padding:12px; } }
    `;
    document.head.append(css);
    function el(tag, text) {
        const node = document.createElement(tag);
        if (text !== undefined) node.textContent = String(text ?? '');
        return node;
    }
    function button(text, action) {
        const node = el('button', text);
        node.type = 'button'; node.className = 'btn-secondary'; node.onclick = action;
        return node;
    }
    function select(options, value = '') {
        const node = el('select');
        for (const [key, text] of options) {
            const option = el('option', text); option.value = key; node.append(option);
        }
        node.value = value; return node;
    }
    function input(type, value = '') {
        const node = el('input'); node.type = type; node.value = value; return node;
    }
    function field(form, text, control, required = false) {
        const label = el('label', text + (required ? ' *' : ''));
        control.required = required; label.append(control); form.append(label); return control;
    }
    function time(value) { return value ? new Date(value).toLocaleString('en-ZA') : 'Not scheduled'; }
    function localDate(value) {
        const d = new Date(value || Date.now() + 86400000);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0,16);
    }
    function table(headers, rows) {
        const wrap = el('div'); wrap.className = 'ops-table';
        wrap.tabIndex = 0; wrap.setAttribute('aria-label', 'Scrollable results table');
        const t = el('table'), head = el('thead'), hr = el('tr'), body = el('tbody');
        for (const h of headers) { const th = el('th', h); th.scope = 'col'; hr.append(th); }
        head.append(hr);
        for (const values of rows) {
            const row = el('tr');
            for (const value of values) {
                const cell = el('td');
                if (value instanceof Node) cell.append(value); else cell.textContent = String(value ?? '');
                row.append(cell);
            }
            body.append(row);
        }
        t.append(head, body); wrap.append(t); return wrap;
    }
    function page(title) {
        const user = currentUser;
        if (!user || !['Staff','Oversight'].includes(user.role)) throw new Error('Sign in with an authorised role.');
        const ticket = ++epoch;
        root.replaceChildren(); showView(root.id);
        const banner = el('header'); banner.className = 'banner';
        banner.append(el('h2', 'CivicConnect'), el('span', `${user.name} (${user.role})`));
        banner.append(button('Logout', () => logout()));
        const main = el('main'); main.className = 'ops-main';
        const toolbar = el('nav'); toolbar.className = 'ops-toolbar';
        toolbar.append(button(user.role === 'Staff' ? 'Request queue' : 'All requests', () => queue()));
        if (user.role === 'Oversight') toolbar.append(button('Reports', () => reports()));
        const h = el('h2', title); h.tabIndex = -1;
        const error = el('p'); error.className = 'ops-error'; error.setAttribute('role','alert');
        main.append(toolbar, h, error); root.append(banner, main); h.focus();
        return { main, error, user, valid: () => epoch === ticket && currentUser === user };
    }
    function query(form) {
        return new URLSearchParams([...new FormData(form)].filter(([,v]) => v !== '')).toString();
    }
    function ownerName(id) { return id ? staff.find(s => s.id === id)?.name || `Staff ID ${id}` : 'Unassigned'; }
    function activityLabel(a) {
        if (a.kind === 'status') return a.status || a.new_values?.status || 'Status updated';
        return ({assign:'Assignment updated',schedule:'Priority or due date updated',note:'Work note'})[a.kind] || a.kind;
    }
    async function queue() {
        const p = page('Request queue');
        const form = el('form'); form.className = 'card ops-grid';
        p.main.append(form);
        const results = el('section'); results.setAttribute('aria-live','polite'); p.main.append(results);
        try {
            const [all, people] = await Promise.all([apiCall('/requests'), p.user.role === 'Staff' ? apiCall('/staff') : Promise.resolve([])]);
            if (!p.valid()) return;
            staff = people;
            const cats = [...new Map(all.map(r => [String(r.category_id),r.category_label])).entries()];
            const owners = p.user.role === 'Staff' ? [...new Map(people.map(s => [String(s.id),s.name])).entries()] :
                [...new Set(all.filter(r => r.owner_id).map(r => r.owner_id))].map(id => [String(id), `Staff ID ${id}`]);
            const controls = [
                ['q','Reference or title',input('search')],
                ['status','Status',select([['','All statuses'],...statuses.map(s => [s,s])])],
                ['category','Category',select([['','All categories'],...cats])],
                ['owner','Owner',select([['','All owners'],...owners])],
                ['priority','Priority',select([['','All priorities'],...priorities.map(s => [s,s])])],
                ['from','Created from (UTC date)',input('date')],['to','Created to (UTC date)',input('date')],
                ['sort','Sort by',select([['created_at','Creation date'],['due_at','Due date']],'created_at')],
                ['direction','Order',select([['desc','Descending'],['asc','Ascending']],'desc')]
            ];
            for (const [name,label,node] of controls) {
                node.name = name; if (filterValues[name] !== undefined) node.value = filterValues[name]; field(form,label,node);
            }
            const submit = el('button','Apply filters'); submit.type = 'submit'; form.append(submit);
            form.append(button('Reset filters', () => { filterValues = {}; queue(); }));
            let requestNumber = 0;
            async function load() {
                const number = ++requestNumber;
                p.error.textContent = ''; results.replaceChildren(el('p','Loading…'));
                filterValues = Object.fromEntries(new FormData(form));
                try {
                    const rows = await apiCall('/requests?' + query(form));
                    if (!p.valid() || number !== requestNumber) return;
                    results.replaceChildren(el('p', `${rows.length} matching requests`));
                    if (!rows.length) { results.append(el('p','No results found.')); return; }
                    results.append(table(['Reference','Title','Category','Status','Owner','Priority','Created','Due','Details'], rows.map(r =>
                        [r.reference,r.title,r.category_label,r.status,ownerName(r.owner_id),r.priority,time(r.created_at),time(r.due_at),button('View',()=>detail(r.id))])));
                } catch (e) { if (p.valid() && number === requestNumber) { results.replaceChildren(); p.error.textContent = e.message; } }
            }
            form.onsubmit = e => { e.preventDefault(); load(); };
            await load();
        } catch (e) { if (p.valid()) p.error.textContent = e.message; }
    }
    async function detail(id, success = '') {
        const p = page('Request details');
        p.main.append(button('Refresh details', () => detail(id)));
        if (success) { const message = el('p',success); message.setAttribute('role','status'); p.main.append(message); }
        try {
            const [r, people] = await Promise.all([apiCall(`/requests/${id}`),p.user.role === 'Staff' ? apiCall('/staff') : Promise.resolve([])]);
            if (!p.valid()) return;
            staff = people;
            const card = el('section'); card.className = 'card'; const fields = el('dl');
            for (const [label,value] of [['Reference',r.reference],['Title',r.title],['Requester ID',r.requester_id],['Category',r.category_label],['Location',r.location || 'Not supplied'],['Description',r.description],['Status',r.status],['Owner',ownerName(r.owner_id)],['Priority',r.priority],['Due',time(r.due_at)],['Created',time(r.created_at)],['Resolved',r.resolved_at ? time(r.resolved_at) : 'Not resolved'],['Version',r.version]]) fields.append(el('dt',label),el('dd',value));
            card.append(fields); p.main.append(card);
            const list = el('ol'); list.className = 'ops-history';
            for (const a of r.activities || []) {
                const item = el('li'), label = activityLabel(a);
                if (['Resolved','Closed','Rejected'].includes(label)) item.className = 'ops-important';
                item.append(el('strong',label),el('div',`${time(a.created_at)} — ${a.actor_name || a.actor_id} — ${a.visibility}`),el('p',a.note));
                if (a.old_values && a.new_values) {
                    const changes = [];
                    for (const key of ['owner_id','priority','due_at','status']) if (a.old_values[key] !== a.new_values[key]) changes.push(`${key}: ${a.old_values[key] ?? 'None'} → ${a.new_values[key] ?? 'None'}`);
                    if (changes.length) item.append(el('p',changes.join('\n')));
                }
                list.append(item);
            }
            p.main.append(el('h3','Work history'),list);
            if (p.user.role !== 'Staff') return;
            const grid = el('div'); grid.className = 'ops-grid'; p.main.append(grid);
            let saving = false;
            function operation(title, kind, build, payload) {
                const form = el('form'); form.className = 'card'; form.append(el('h3',title));
                const controls = build(form);
                const error = el('p'); error.className = 'ops-error'; error.setAttribute('role','alert');
                const save = el('button','Save'); save.type = 'submit'; form.append(error,save); grid.append(form);
                form.onsubmit = async e => {
                    e.preventDefault(); if (saving || !p.valid()) return;
                    error.textContent = '';
                    try {
                        const body = {version:r.version,...payload(controls)};
                        if ('note' in body && ['assign','schedule','note'].includes(kind) && !body.note.trim()) throw new Error('Enter a meaningful note or reason.');
                        if (kind === 'status' && ['Resolved','Rejected'].includes(body.status) && !body.note.trim()) throw new Error('Enter a resolution summary or rejection reason.');
                        saving = true; grid.querySelectorAll('button').forEach(b => b.disabled = true);
                        await apiCall(`/requests/${id}/${kind}`,'POST',body);
                        if (p.valid()) await detail(id,'Saved successfully.');
                    } catch (e) {
                        if (p.valid()) error.textContent = e.status === 409 ? 'This record changed. Use Refresh details, review the latest values and retry.' : e.message;
                    } finally { saving = false; if (p.valid()) grid.querySelectorAll('button').forEach(b => b.disabled = false); }
                };
            }
            const note = (f,label='Reason') => { const n = el('textarea'); n.rows = 3; n.maxLength = 2000; return field(f,label,n,true); };
            function planning(f) {
                return {
                    priority:field(f,'Priority',select(priorities.map(s=>[s,s]),r.priority),true),
                    due:field(f,'Due date and time (your local time)',input('datetime-local',localDate(r.due_at)),true),
                    note:note(f)
                };
            }
            const planningBody = c => ({priority:c.priority.value,due_at:new Date(c.due.value).toISOString(),note:c.note.value.trim()});
            if (open.includes(r.status)) {
                operation('Assign or reassign','assign',f => {
                    const eligible = people.filter(s=>s.category_id === r.category_id);
                    const options = [...new Map(eligible.map(s=>[String(s.id),s.name])).entries()];
                    const owner = field(f,'Eligible owner',select([['','Select an owner'],...options],r.owner_id ? String(r.owner_id) : ''),true);
                    return {owner,...planning(f)};
                },c=>({owner_id:Number(c.owner.value),...planningBody(c)}));
                operation('Change priority or due date','schedule',planning,planningBody);
            }
            const next = {Received:['Rejected'],Assigned:['In progress'],'In progress':['Resolved'],Resolved:['Closed']}[r.status] || [];
            if (next.length) operation('Update status','status',f=> {
                const status = field(f,'Next status',select(next.map(s=>[s,s])),true);
                const n = note(f,'Reason / resolution summary');
                n.required = next.some(s=>['Resolved','Rejected'].includes(s));
                return {status,note:n};
            },c=>({status:c.status.value,note:c.note.value.trim()}));
            operation('Add work note','note',f=>({
                visibility:field(f,'Who can see this note?',select([['','Select visibility'],['Public','Requester-visible'],['Internal','Internal staff only']]),true),
                note:note(f,'Work note')
            }),c=>({visibility:c.visibility.value,note:c.note.value.trim()}));
        } catch (e) { if (p.valid()) p.error.textContent = e.message; }
    }
    async function reports() {
        if (currentUser?.role !== 'Oversight') return;
        const p = page('Management reports');
        const form = el('form'); form.className = 'card ops-grid';
        const from = field(form,'Created from (UTC date)',input('date')); from.name = 'from';
        const to = field(form,'Created to (UTC date)',input('date')); to.name = 'to';
        const submit = el('button','Generate report'); submit.type = 'submit'; form.append(submit);
        const output = el('section'); output.setAttribute('aria-live','polite');
        p.main.append(el('p','Date filters use request creation dates. MTTR is the mean time from creation to resolution, in hours, for resolved/closed requests only.'),form,output);
        let sequence = 0;
        async function load() {
            const n = ++sequence; p.error.textContent = ''; output.replaceChildren(el('p','Loading…'));
            try {
                const rows = await apiCall('/reports?' + query(form));
                if (!p.valid() || n !== sequence) return;
                output.replaceChildren();
                if (!rows.length) { output.append(el('p','No results found.')); return; }
                output.append(table(['Category','Total','Open','Overdue','Undated open','Resolved','Closed','Rejected','MTTR (hours)'],rows.map(g=>[g.category,g.total,g.open,g.overdue,g.undated,g.resolved,g.closed,g.rejected,g.mttr_hours === null ? 'Not applicable' : Number(g.mttr_hours).toFixed(2)])));
                for (const g of rows) output.append(el('h3',`${g.category} — ownership`),table(['Owner','Requests'],Object.entries(g.owners).map(([id,count])=>[id === 'Unassigned' ? id : `Staff ID ${id}`,count])));
            } catch (e) { if (p.valid() && n === sequence) { output.replaceChildren(); p.error.textContent = e.message; } }
        }
        form.onsubmit = e=>{e.preventDefault();load();}; await load();
    }
    // Capture login here so Oversight no longer reaches the old placeholder.
    document.getElementById('login-form').addEventListener('submit',async e=>{
        e.preventDefault(); e.stopImmediatePropagation();
        const error = document.getElementById('login-error'); error.textContent = '';
        const submit = e.target.querySelector('button[type="submit"]'); submit.disabled = true;
        try {
            const result = await apiCall('/login','POST',{username:document.getElementById('username').value,password:document.getElementById('password').value});
            currentUser = result.user; csrfToken = result.csrf; filterValues = {};
            document.getElementById('password').value = '';
            if (currentUser.role === 'Requester') await loadRequesterDashboard();
            else if (currentUser.role === 'Staff') await queue();
            else if (currentUser.role === 'Oversight') await reports();
            else { await logout(); throw new Error('Unsupported role.'); }
        } catch (e) { error.textContent = e.message || 'Unable to sign in.'; }
        finally { submit.disabled = false; }
    },true);
    loadStaffDashboard = () => queue();
    loadStaffDetail = id => detail(id);
    const previousLogout = logout;
    logout = async function () {
        ++epoch; root.replaceChildren(); filterValues = {}; staff = [];
        await previousLogout();
    };
})();
