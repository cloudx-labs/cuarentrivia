# Cuarentrivia

Este proyecto esta pensado para crear trivias y jugar en tiempo real con colegas o en comunidades.

## Tecnologias

La aplicacion esta construida (principalmente) y funciona con:

- [NodeJS](https://nodejs.org/)
- [ReactJS](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Nx](https://nx.dev/)

## Que necesito antes de poder usar la aplicacion?

Para crear una nueva instancia de Cuarentrivia es necesario [crear un proyecto de Firebase](https://firebase.google.com/docs/web/setup) (Pasos 1 y 2)
Luego de crear el proyecto de Firebase es necesario _habilitar Autenticacion, Firestore, Functions, Storage y Hosting_ desde la consola de administracion de tu proyecto.

**NO TE OLVIDES DE OBTENER EL OBJETO DE CONFIGURACION DE TU PROYECTO QUE LO VAS A NECESITAR MAS ADELANTE** (Mas info [aca](https://firebase.google.com/docs/web/setup#config-object))

## Como uso la plataforma en desarrollo?

Dado que la aplicacion necesita acceder a la base de datos para poder funcionar es necesario hacer un deployment de algunas partes de la plataforma hacia Firebase.

1- Crea un archivo en el repositorio con el nombre `.env`, abrilo y pone los valores del objeto de configuracion de Firebase.
Los valores son especificos para tu proyecto y los conseguis aca `https://console.firebase.google.com/project/<TU_PROYECTO>/settings/general/web` y yendo a tu app, seccion `Config`

```
FIREBASE_APP_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxx # apiKey
FIREBASE_APP_AUTH_DOMAIN=xxx.firebaseapp.com # authDomain
FIREBASE_APP_DATABASE_URL=https://xxxx.firebaseio.com # databaseUrl
FIREBASE_APP_PROJECT_ID=xxx # projectId
FIREBASE_APP_STORAGE_BUCKET=xxx.appspot.com # storageBucket
FIREBASE_APP_MESSAGING_SENDER_ID=xxx # messagingSenderId
FIREBASE_APP_APP_ID=xxx # appId
FIREBASE_APP_MEASUREMENT_ID=xxx # measurementId

FIREBASE_TOKEN=xxx # Aca va el token para hacer el deployment. Este valor solo necesario si queres deployar con Continous Integration
```

2- Crea otro archivo con el nombre `.firebaserc`, abrilo y pone el contenido en funcion de tu proyecto:

```
{
  "projects": {
    "default": "<aca va el nombre de tu proyecto de firebase para desarrollo>",
    "production": "<aca va el nombre de tu proyecto de firebase para produccion. Si no vas a usarlo en produccion podes no poner esta linea>"
  }
}
```

3- Inicia una terminal y ejecuta los siguientes comandos
4- `npm run firebase -- login` y segui las instrucciones para que tu entorno este conectado a tu cuenta de firebase.
5 `npm install`
6 `npm run deploy`
7 `npm run start`
8 Abri un navegador en [http://localhost:4200] y deberias ver la aplicacion funcionando 🎉

## Como uso la plataforma en produccion?

Para tener la aplicacion productiva necesitas tener un proyecto de firebase que sepas que es el final y vas a realizar lo siguiente:

1- Edita el archivo `.firebase.env` y ponele los datos de tu proyecto de firebase productivo.
2- Asegurate de tener el atributo `production` configurado correctamente en el archivo `.firebaserc`.
3- Habiendo ejecutado los comandos de la seccion anterior, abri una terminal y ejecuta `npm run deploy:prod`
