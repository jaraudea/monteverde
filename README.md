# monteverde
Monteverde

to **Build** execute following commands:
  - npm install
  - gulp

to **Run Server** execute "gulp serverExpress"


to **Back up Database** execute
  - mongodump --db Monteverde --out data/dump

to **Restore Database** execute
  - mongorestore -d Monteverde data/dump/Monteverde
