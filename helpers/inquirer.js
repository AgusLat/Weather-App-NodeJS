import inquirer from "inquirer";
import colors from 'colors';






const inquirerMenu = async() =>{

    let preguntas = [{    
        type : 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            }
           
    ]
    }];

        console.clear();
        console.log('========================='.green)
        console.log('  Seleccione una opcion'.white)
        console.log('=========================\n'.green)

        const {opcion} = await inquirer.prompt(preguntas); //DEVUELVE EL VALOR DE LA OPCION MEDIANTE DESESTRUCTIRACION

        return opcion //LO MANDAMOS POR RETURN


}

const pausa = async ()=>{


    let preguntaPausa = [
        {
            type : 'input',
            name: 'Enter',
            message: `PRESIONE ${'ENTER'.green} PARA CONTINUAR`,
            
            
    
    }]
    
    console.log('\n')

    await inquirer.prompt(preguntaPausa);

   

};


const leerInput = async ( message )=>{

    let question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value){
                if(value.length === 0){
                    return 'Por favor ingrese un valor'
                }
                return true

            }

        }
    ]

    const { desc } = await inquirer.prompt(question);
    return desc;
}


const listadoLugares= async ( lugares = [])=> {

    const choices = lugares.map( (lugar, i) => {

        const idx = `${i+1}.`.green

        return {
            value: lugar.id,
            name: `${idx} ${lugar.ciudad}`
        }

    })

    choices.unshift({
        value: '0',
        name: '0. '.green + 'Cancelar'
    });

    const preguntas = [{
        type : 'list',
        name: 'id',
        message: 'Seleccione el lugar: ',
        choices
    }]

    const {id} = await inquirer.prompt(preguntas);
    return id;   
};

const confirmar = async (message)=>{

    const question = [{
        type: 'confirm',
        name: 'ok',
        message
    }];

    const { ok } = await inquirer.prompt(question);
    return ok;
}

const mostrarListadoCheckList = async ( tareas = [])=> {

    const choices = tareas.map( (tarea, i) => {

        const idx = `${i+1}.`.green

        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true: false
        }

    })


    const pregunta = [{
        type : 'checkbox',
        name: 'ids',
        message: 'Selecciones',
        choices
    }]

    const {ids} = await inquirer.prompt(pregunta);
    return ids;   
};


export {
    inquirerMenu,
    pausa,
    leerInput,
    listadoLugares,
    confirmar,
    mostrarListadoCheckList
};