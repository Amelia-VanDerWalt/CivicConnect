/* Requester details and feedback use the existing permission-scoped API. */
(() => {
    let generation = 0;
    const style = document.createElement('style');
    style.textContent = `
        #req-requests-table { table-layout: fixed; width: 100%; }
        #req-requests-table td, #req-requests-table th {
            overflow-wrap: anywhere; white-space: normal;
        }
        .request-reference {
            border: 0; background: none; color: #164e9b;
            text-decoration: underline; cursor: pointer;
            font: inherit; text-align: left; overflow-wrap: anywhere;
        }
        .request-reference:focus-visible,
        #requester-detail-view button:focus-visible {
            outline: 3px solid #164e9b; outline-offset: 3px;
        }
        #requester-detail-view .card { overflow-wrap: anywhere; }
        #requester-detail-view dt { font-weight: bold; margin-top: 12px; }
        #requester-detail-view dd {
            margin: 4px 0 12px; white-space: pre-wrap;
        }
        .request-history { padding-left: 24px; }
        .request-history li {
            margin: 16px 0; padding: 12px; border-left: 3px solid #94a3b8;
        }
        .request-history li.important-update {
            border-left: 5px solid #166534; background: #f0fdf4;
        }
        .request-history p { white-space: pre-wrap; margin-bottom: 0; }
        @media (max-width: 700px) {
            #requester-detail-view .content { padding: 12px; }
            #requester-detail-view .card { padding: 16px; }
        }
    `;
    document.head.append(style);

    const view = document.createElement('div');
    view.id = 'requester-detail-view';
    view.className = 'view';
    view.innerHTML = `
        <header class="banner">
            <h2>CivicConnect</h2>
            <div class="user-controls">
                <span>Requester</span>
                <button type="button" id="history-logout" class="btn-text">
                    Logout
                </button>
            </div>
        </header>
        <main class="content">
            <button type="button" id="history-back" class="btn-secondary">
                Back to My Requests
            </button>
            <div class="card" style="margin-top:20px;">
                <h2 id="history-heading" tabindex="-1">Request details</h2>
                <button type="button" id="history-refresh" class="btn-secondary">
                    Refresh updates
                </button>
                <div id="history-content" aria-live="polite"></div>
            </div>
        </main>`;
    document.body.append(view);

    const content = document.getElementById('history-content');
    const heading = document.getElementById('history-heading');
    const refresh = document.getElementById('history-refresh');

    function element(tag, text) {
        const node = document.createElement(tag);
        if (text !== undefined) node.textContent = String(text ?? '');
        return node;
    }

    function timestamp(value) {
        const date = new Date(value);
        return value && !Number.isNaN(date.getTime())
            ? date.toLocaleString('en-ZA')
            : 'Not recorded';
    }

    function activityLabel(activity) {
        switch (activity.kind) {
            case 'assign': return 'Assignment updated';
            case 'schedule': return 'Priority or due date updated';
            case 'note': return 'Public comment';
            case 'status': return activity.status || 'Status updated';
            default: return activity.kind || 'Request update';
        }
    }

    function publicActivities(request) {
        return (Array.isArray(request.activities) ? request.activities : [])
            .filter(activity => activity.visibility === 'Public')
            .slice()
            .sort((a, b) =>
                String(a.created_at).localeCompare(String(b.created_at)) ||
                Number(a.id) - Number(b.id));
    }

    function isCurrent(ticket, user) {
        return ticket === generation && currentUser === user &&
            currentUser?.role === 'Requester';
    }

    async function openRequest(id) {
        if (currentUser?.role !== 'Requester') return;
        const user = currentUser;
        const ticket = ++generation;

        showView(view.id);
        heading.textContent = 'Request details';
        content.replaceChildren(element('p', 'Loading request…'));
        refresh.disabled = true;
        refresh.onclick = () => openRequest(id);
        heading.focus();

        try {
            const request = await apiCall(`/requests/${id}`);
            if (!isCurrent(ticket, user)) return;

            heading.textContent = `Request ${request.reference}`;
            content.replaceChildren();
            const fields = element('dl');

            const details = [
                ['Title', request.title],
                ['Category', request.category_label],
                ['Location', request.location || 'Not supplied'],
                ['Description', request.description],
                ['Status', request.status],
                ['Priority', request.priority],
                ['Due', request.due_at ? timestamp(request.due_at) : 'Not scheduled'],
                ['Submitted', timestamp(request.created_at)]
            ];

            for (const [label, value] of details) {
                fields.append(element('dt', label), element('dd', value));
            }

            content.append(fields, element('h3', 'Updates and history'));
            const activities = publicActivities(request);

            if (!activities.length) {
                content.append(element('p', 'No public updates yet.'));
            } else {
                const list = element('ol');
                list.className = 'request-history';

                for (const activity of activities) {
                    const item = element('li');
                    if (activity.kind === 'status' && ['Resolved', 'Closed', 'Rejected'].includes(activity.status)) {
                        item.className = 'important-update';
                    }
                    item.append(
                        element('strong', activityLabel(activity)),
                        element('div', timestamp(activity.created_at)),
                        element('div', activity.actor_name || 'Service team'),
                        element('p', activity.note)
                    );
                    list.append(item);
                }
                content.append(list);
            }
        } catch (error) {
            if (isCurrent(ticket, user)) {
                content.replaceChildren(
                    element('p', error.message || 'Unable to load this request.')
                );
            }
        } finally {
            if (isCurrent(ticket, user)) refresh.disabled = false;
        }
    }

    document.getElementById('history-back').onclick =
        () => loadRequesterDashboard();
    document.getElementById('history-logout').onclick = () => logout();

    // Replace the original dashboard while preserving its existing table.
    loadRequesterDashboard = async function () {
        if (currentUser?.role !== 'Requester') return;
        const user = currentUser;
        const ticket = ++generation;

        showView('requester-home-view');
        document.getElementById('req-welcome').textContent =
            `Welcome, ${user.name}`;

        const tbody = document.getElementById('req-requests-tbody');
        const headers = document.querySelectorAll('#req-requests-table th');
        headers[0].textContent = 'Reference / details';
        headers[3].textContent = 'Latest public update';

        function message(text) {
            const row = element('tr');
            const cell = element('td', text);
            cell.colSpan = 4;
            row.append(cell);
            tbody.replaceChildren(row);
        }

        message('Loading requests…');

        try {
            const requests = await apiCall('/requests');
            if (!isCurrent(ticket, user)) return;
            if (!requests.length) {
                message('No requests found.');
                return;
            }
            tbody.replaceChildren();

            // Keep concurrent detail reads bounded while showing each row promptly.
            for (let offset = 0; offset < requests.length; offset += 4) {
                if (!isCurrent(ticket, user)) return;

                const batch = requests.slice(offset, offset + 4).map(request => {
                    const row = element('tr');
                    const referenceCell = element('td');
                    const button = element('button', request.reference);
                    button.type = 'button';
                    button.className = 'request-reference';
                    button.setAttribute('aria-label', `View request ${request.reference}`);
                    button.onclick = () => openRequest(request.id);
                    referenceCell.append(button);

                    const updateCell = element('td', 'Loading update…');
                    row.append(
                        referenceCell,
                        element('td', request.category_label),
                        element('td', request.status),
                        updateCell
                    );
                    tbody.append(row);

                    return (async () => {
                        try {
                            const detail = await apiCall(`/requests/${request.id}`);
                            if (!isCurrent(ticket, user)) return;
                            const activities = publicActivities(detail);
                            const latest = activities[activities.length - 1];

                            updateCell.replaceChildren();
                            if (latest) {
                                updateCell.append(
                                    element('strong', activityLabel(latest)),
                                    element('div', timestamp(latest.created_at)),
                                    element('div', latest.note)
                                );
                            } else {
                                updateCell.textContent =
                                    `Submitted ${timestamp(request.created_at)}`;
                            }
                        } catch {
                            if (isCurrent(ticket, user)) {
                                updateCell.textContent =
                                    'Update unavailable. Open details to retry.';
                            }
                        }
                    })();
                });
                await Promise.all(batch);
            }
        } catch (error) {
            if (isCurrent(ticket, user)) {
                message(error.message || 'Unable to load requests.');
            }
        }
    };

    // Discard pending reads and clear requester data when signing out.
    const previousLogout = logout;
    logout = async function () {
        ++generation;
        heading.textContent = 'Request details';
        content.replaceChildren();
        document.getElementById('req-requests-tbody').replaceChildren();
        await previousLogout();
    };
})();
