# Daybook routines

Three scheduled Claude routines keep the Daybook dashboard up to date.
Dashboard: https://claude.ai/artifact/MGr9BYuXF3CzkK2gdJfdHq
All times are London time. Each routine starts a fresh session with the
Gmail, Google Calendar and Notion connectors, and writes to the dashboard's
database with the ArtifactData tool.

| Routine | When | Writes |
| --- | --- | --- |
| Morning brief | Every day 06:46 | `briefs/{YYYY-MM-DD}`, due Notion tasks into `tasks/` |
| Evening check-in | Every day 21:28 | `reviews/{YYYY-MM-DD}` |
| Weekly review | Sunday 18:46 | `weekly/{YYYY-Www}` |

## Database shape

- `briefs/{date}`: `date, generatedAt, headline, summary, priorities[], schedule[{start,end,title,calendar,location,prep}], allDay[], emails[{from,subject,why,action,url}], headsUp[], stats{meetings,freeHours,emailsNeedingReply,tasksDue}`
- `tasks/{id}`: `title, done, due, source ("dashboard" | "notion"), url, createdAt, doneAt`
- `checkins/{date}`: filled in by you on the page: `wentWell, didnt, dayScore (1-5), energy (1-5), tomorrow, savedAt`
- `reviews/{date}`: `date, generatedAt, score (1-10), summary, wins[], misses[], tomorrowFix, stats{meetings,tasksDone,tasksOpen,emailsWaiting}`
- `weekly/{week}`: `week, range, generatedAt, summary, averages{dayScore,energy,completion}, whatWorked[], whatDidnt[], patterns[], improvements[{title,why,how}], focus`

The full routine prompts live in the routines themselves (claude.ai, Routines list).
