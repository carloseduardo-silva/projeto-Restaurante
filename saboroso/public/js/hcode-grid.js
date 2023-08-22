class HcodeGrid {

    constructor(configs){

        configs.listeners = Object.assign({

              afterUpdateClick: (e) =>{

                $(this.options.modalUpdate).modal('show')
                console.log('abri o modal')
                
              
            },

            afterDeleteClick: (e) =>{
                
              window.location.reload()
              
            },
            afterFormCreate: (e) =>{
                
                window.location.reload()
                
              },
              afterFormUpdate: (e) =>{
                
                window.location.reload()
                
              },
              afterFormCreateError: (e) =>{
                
               alert('Não foi possivel enviar o formulário')
                
              },
              afterFormUpdateError: (e) =>{
                
                alert('Não foi possivel enviar o formulário')
                
              }
              
        
        }, configs.listeners)

        //object with the especification to the form action and button actions being acessed by the attribute
        this.options = Object.assign({   
            formCreate:'#modal-create form',
            formUpdate:'#modal-update form',
            modalCreate:'#modal-create',
            modalUpdate:'#modal-update',
            btnUpdate: 'button.btn-update',
            btnDelete: 'button.btn-delete',
            btnInfo: 'button.btn-info'
       
    }, configs)

        this.formUpdate = document.querySelector(this.options.formUpdate);

        this.formCreate =  document.querySelector(this.options.formCreate);

        
      
        this.initForms()
        this.initButtons()

    }


    fireEvent(name, args){

        console.log(this.options.listeners[name]) 

        if(typeof this.options.listeners[name] === 'function'){

            this.options.listeners[name].apply(this, args)

        }
    }


    initForms(){

        

        //new method to the prototype plugin for saving the sent datas.
         this.formCreate.save().then(json =>{

          this.fireEvent('afterFormCreate')

         }).catch(err =>{
            this.fireEvent('afterFormCreateError')
         })
        
    
        //new method to the prototype plugin for saving the datas edited
         this.formUpdate.save().then(json =>{

            this.fireEvent('afterFormUpdate')

         }).catch(err =>{
            this.fireEvent('afterFormUpdateError')
         });
        
        
     

    }

 

    getDatarow(e){

        let tr = e.target.closest('[data-row]')
       
        return  JSON.parse(tr.dataset.row)

    }


    initButtons(){

        //update
        document.querySelectorAll(this.options.btnUpdate).forEach(btn =>{

            btn.addEventListener('click', e =>{

              e.preventDefault()
              let data = this.getDatarow(e)

              for(let name in data)  {

                this.options.onUpdateLoad(this.formUpdate, name, data)
              }
              //bug open and closing just with btnUpdates reservation/contacts
              //this.fireEvent('afterUpdateClick', (e))
            });
          
           });

          //exclude
           document.querySelectorAll(this.options.btnDelete).forEach(btn =>{
             btn.addEventListener('click', e =>{
              
              let data = this.getDatarow(e)
          
              if(confirm(eval("`"+ this.options.deleteMsg +"`"))){
          
                fetch(eval("`"+ this.options.deleteURL +"`"), {
                  method:'DELETE'
            
                })
                .then(response => response.json())
                .then(
                  json =>{
                    this.fireEvent('afterDeleteClick')
                  }
                )
          
              }
          
              
            })
           })


    }

}