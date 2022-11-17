//dotenv Sirve para acceder a PATHS desde el process.env, y asi utilizar de manera directa PATHS desde mi archivo .env
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import { leerInput, inquirerMenu, pausa, listadoLugares } from "./helpers/inquirer.js";
import { Busquedas } from "./models/busquedas.js";


const main = async () => {
  const busquedas = new Busquedas();
  let opt;

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        //MOSTRAR MENSAJE
        const termino = await leerInput('Ciudad: ')

        //BUSCAR LOS LUGARES
        const lugares = await busquedas.ciudad( termino );
        
        //SELECCIONA EL LUGAR
        const id = await listadoLugares(lugares)
        if( id === '0') continue;
        const lugarSel = lugares.find(l => l.id === id)

        //GUARDAR EN DB
        busquedas.agregarHistorial(lugarSel.ciudad)

        //CLIMA
        const infoClima = await busquedas.clima(lugarSel.lat, lugarSel.lng)
        //console.log(infoClima)

        //MOSTRAR RESULTADOS
        console.clear()
        console.log('\nINFORMACION DE LA CIUDAD\n'.green)
        console.log('Ciudad:', lugarSel.ciudad.blue)
        console.log('Lat: ', lugarSel.lat)
        console.log('Long:', lugarSel.lng)
        console.log('Temperatura: ', infoClima.temperatura)
        console.log('Min: ', infoClima.temp_min)
        console.log('Máx: ', infoClima.temp_max)
        console.log('Como está el clima: ', infoClima.clima.blue)
        break;

      case 2:
        //MOSTRAR HISTORIAL
        busquedas.historialCapitalizado.forEach( (lugar, i) =>{
            const idx = `${i + 1}.`.green
            console.log(`${idx} ${lugar}`)
        })
        break;
    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
