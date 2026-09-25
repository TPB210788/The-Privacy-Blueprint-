# Daybook routines

Three scheduled Claude routines keep the Daybook dashboard up to date.
Dashboard: https://claude.ai/artifact/MGr9BYuXF3CzkK2gdJfdHq
All times are London time. Each routine wakes the original Claude Code
session that set Daybook up, because that session holds the Gmail, Google
Calendar and Notion connectors. It writes to the dashboard's database with
the ArtifactData tool. Archiving that session stops the routines.

| Routine | When | Writes |
| --- | --- | --- |
| Morning brief | Every day 06:46 | `briefs/{YYYY-MM-DD}`, due Notion tasks into `tasks/`, school sweep into `school/` and the Family calendar |
| Evening check-in | Every day 21:28 | `reviews/{YYYY-MM-DD}` |
| Weekly review | Sunday 18:46 | `weekly/{YYYY-Www}` |

## Database shape

- `briefs/{date}`: `date, generatedAt, headline, summary, priorities[], schedule[{start,end,title,calendar,location,prep}], allDay[], emails[{from,subject,why,action,url}], headsUp[], stats{meetings,freeHours,emailsNeedingReply,tasksDue}`
- `tasks/{id}`: `title, done, due, source ("dashboard" | "notion"), url, createdAt, doneAt`
- `checkins/{date}`: filled in by you on the page: `wentWell, didnt, dayScore (1-5), energy (1-5), tomorrow, savedAt`
- `reviews/{date}`: `date, generatedAt, score (1-10), summary, wins[], misses[], tomorrowFix, stats{meetings,tasksDone,tasksOpen,emailsWaiting}`
- `school/{id}`: `type ("date" | "todo"), child, title, date, time, due, done, note, source ("email" | "app"), url, calendarAdded`
- `schoolinbox/{id}`: messages pasted or screenshotted from the My Child at School app: `text, assetId, assetUrl, createdAt, processed`
- `cycles/current`: the 12 week goal cycle: `name, start, end, weeks, targetScore`
- `goals/{id}`: `area, title, smart, outcome{label,target,current,source}, actions[{id,label,target}], ifThen, woop{wish,outcome,obstacle,plan}, milestones[{label,due,done}]`
- `goalweeks/w{N}`: counts per action as `c_<goal>_<action>`, plus `score, goalScores` after the Sunday review
- `weekly/{week}`: `week, range, generatedAt, summary, averages{dayScore,energy,completion}, whatWorked[], whatDidnt[], patterns[], improvements[{title,why,how}], focus`

The full routine prompts live in the routines themselves (claude.ai, Routines list).
