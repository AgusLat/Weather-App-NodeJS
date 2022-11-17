import fs from 'fs'
import axios from "axios";

export class Busquedas {
  historial = [];
  dbPath = './db/database.json'

  constructor() {
    //TODO Leer DB si existe
    this.leerDB()
  }

  //METODOS

  //GUARDAMOS LOS PARAMETROS DEL INSTANCE EN UN GETTER
  get paramsMapBox() {
    return {
      language: "es",
      access_token: process.env.MAPBOX_KEY,
    };
  }

  get paramsOpenWeater() {
    return {
      lang: "es",
      units: "metric",
      appid: process.env.OPENWEATHER_KEY,
    };
  }

  get historialCapitalizado(){


    return this.historial.map( lugar => {

        let palabras = lugar.split(' ');
        palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );
        return palabras.join(' ');
    })
  }


  //PETICION HTTP PARA BUSCAR CIUDAD
  async ciudad(lugar = "") {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapBox,
      });

      const resp = await instance.get();
      return  resp.data.features.map((item) =>({ 
        id: item.id, 
        ciudad: item.place_name, 
        lng: item.center[0],
        lat: item.center[1] })
        );
      //console.log(resp); //resp Muestra todo lo que devuelve la API, con el .data (se puede ver este objeto en lo que devuelve resp) vemos especificamente el contenido que nos provee

      
    } catch (error) {
      return [];
    }
  }


  async clima(lat, lng) {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}`,
        params: this.paramsOpenWeater,
      });

      const resp = await instance.get();
     
    return ({
        clima: resp.data.weather[0].description, 
        temperatura: resp.data.main.temp, 
        temp_max: resp.data.main.temp_max,
        temp_min: resp.data.main.temp_min
    });
      
    } catch (error) {
        console.log(error)
      return [];
    }
  }
  

  agregarHistorial( lugar = ''){

    if(this.historial.includes(lugar.toLowerCase())){
        return;
    }

    this.historial = this.historial.splice(0,5);

    this.historial.unshift(lugar.toLowerCase());

    this.guardarDB()
  }

  guardarDB(){

    const payload = {
        historial : this.historial
    }

    fs.writeFileSync(this.dbPath, JSON.stringify(payload))
  }

  leerDB(){

    if(!fs.existsSync( this.dbPath )){
      return null
   
    } else {
        const info = fs.readFileSync(this.dbPath, 'utf-8')
        const data = JSON.parse(info)
        this.historial = data.historial
        
    }

  }


};



