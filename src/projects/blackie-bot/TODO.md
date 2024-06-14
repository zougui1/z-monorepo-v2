- add all the commands existing from the previous bot
  - music
    - download: TODO

/activity start <name: string> [duration: DurationString]
  - button: end
  - button: cancel
/activity end
/activity cancel

locations:
  - home
  - office
  - outside
contexts:
  - SLEEPING
  - ALONE
  - ON_SCREEN
  - COMMUTE
  - BUSY
  - WEATHER
    - RAIN

reminders:
- drink water: every hour
  - applicable locations: home | office
- screen break: every 30 minutes
  - applicable locations: *
  - applicable contexts: ON_SCREEN
- learn chinese: every day
  - applicable locations: home
  - applicable contexts: !BUSY
- walk: every day
  - applicable locations: home
  - applicable contexts: !BUSY & !WEATHER:RAIN
- clean rooms: every week
  - applicable locations: home
  - applicable contexts: ALONE
- change bed sheets: every week
  - applicable locations: home
  - applicable contexts: ALONE
- split money savings: every month
  - applicable locations: *
  - applicable contexts: !BUSY
