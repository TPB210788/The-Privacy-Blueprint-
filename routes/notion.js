const { Client } = require('@notionhq/client');

let client = null;

function getClient() {
  if (!client && process.env.NOTION_TOKEN) {
    client = new Client({ auth: process.env.NOTION_TOKEN });
  }
  return client;
}

function getTitle(page) {
  const prop = Object.values(page.properties).find(p => p.type === 'title');
  if (!prop) return 'Untitled';
  return prop.title.map(t => t.plain_text).join('');
}

function getProp(page, ...names) {
  for (const name of names) {
    const p = page.properties[name];
    if (!p) continue;
    switch (p.type) {
      case 'select': return p.select?.name || null;
      case 'multi_select': return p.multi_select?.map(s => s.name).join(', ') || null;
      case 'date': return p.date?.start || null;
      case 'checkbox': return p.checkbox;
      case 'rich_text': return p.rich_text?.map(t => t.plain_text).join('') || null;
      case 'number': return p.number;
      case 'status': return p.status?.name || null;
      case 'url': return p.url || null;
      default: return null;
    }
  }
  return null;
}

async function getNotionData() {
  const c = getClient();
  if (!c) throw new Error('Notion API token not configured');
  if (!process.env.NOTION_DATABASE_ID) throw new Error('Notion database ID not configured');

  const response = await c.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    sorts: [{ timestamp: 'last_edited_time', direction: 'descending' }],
    page_size: 100
  });

  const pages = response.results.map(page => ({
    id: page.id,
    url: page.url,
    title: getTitle(page),
    status: getProp(page, 'Status', 'State', 'Progress'),
    dueDate: getProp(page, 'Due Date', 'Date', 'Deadline', 'Due'),
    priority: getProp(page, 'Priority', 'Importance'),
    type: getProp(page, 'Type', 'Category', 'Area'),
    month: getProp(page, 'Month', 'Time Period', 'Quarter'),
    completed: getProp(page, 'Done', 'Completed', 'Complete'),
    lastEdited: page.last_edited_time
  }));

  return { pages, lastSync: new Date().toISOString() };
}

module.exports = { getNotionData };
