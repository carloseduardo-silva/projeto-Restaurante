class HcodeFileReader{

    constructor(inputEl, imgEl){

        this.inputEl = inputEl;

        this.imgEl = imgEl;

        this.initInputEvent()


    }   
    initInputEvent(){

        console.log( document.querySelector(this.inputEl))

        document.querySelector(this.inputEl).addEventListener('change', e=>{
           
            this.reader(e.target.files[0]).then(result =>{

                document.querySelector(this.inputEl).src = result

            })

        })

    }

    reader(file){

        return Promise((s, f )=>{
            let reader = new FileReader();

            reader.onload = function(){
                s(reader.result)
            }

            reader.onerror = function(){

                f('Não foi possivel ler a imagem')
            }

            reader.readAsDataURL(file)
    
        })
    }
}