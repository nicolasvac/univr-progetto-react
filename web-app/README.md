# JP-Obesity frontend app

## How to run

- `git pull`
- `git checkout firestore-auth`
- `nvm use 16`
- `yarn`
- `yarn start`

## Routes

### public

- Pagina di login: `/login`
- Pagina di registrazione: `/signup`

### private

- Pagina iniziale: lista dei pazienti sotto controllo `/reserved/`
- Piano nutrizionale: `/reserved/nutritional-plan`
- Visualizza/crea/modifica pasti: `/reserved/foods`
- Visualizza/crea/modifica esercizi fisici:`/reserved/workouts`
- Registra paziente: `/reserved/create-patient`
- Visualizza statistiche del paziente: `/reserved/patient-statistics`
- Visualizza lo stato della terapia del paziente: `/reserved/therapy-status`
- Crea notifiche per paziente: `/reserved/notifications`
- Modifica terapia paziente: `/reserved/edit-therapy`
- Assegna esercizi fisici al paziente: `/reserved/physical-exercises`

## How to deploy

### Google firebase hosting

- `sudo npm install -g firebase-tools` install all firebase tools globally
- `firebase login` login your terminal to firebase project
- `firebase init ` already done
- `yarn build` before deploy (!important)
- `firebase deploy --only hosting`
- done!

## Create documentation

### JSDoc

- run `npm run docs`
  You will find the _html_ output in `/docs`.

## .env

### use your environment variables

- `REACT_APP_API_KEY`
- `REACT_APP_AUTH_DOMAIN`
- `REACT_APP_PROJECT_ID`
- `REACT_APP_STORAGE_BUCKET`
- `REACT_APP_MESSAGING_SENDER_ID`
- `REACT_APP_ID`
- `REACT_APP_DATABASE_URL`
- `REACT_APP_MEASUREMENT_ID`
