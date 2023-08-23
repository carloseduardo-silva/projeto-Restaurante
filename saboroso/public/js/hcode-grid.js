class HcodeGrid {

    constructor(configs){

        configs.listeners = Object.assign({

              afterUpdateClick: (e) =>{

               
                  $(this.options.modalUpdate).modal('show')
              
                
              
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
            btnInfo: 'button.btn-info',
            onUpdateLoad: (form, name, data) =>{

              let input = form.querySelector(`[name=${name}]`)
  
                if(input) input.value = data[name]
          
              }
       
    }, configs)

        this.rows = document.querySelectorAll('table tbody tr')

        this.formUpdate = document.querySelector(this.options.formUpdate);

        this.formCreate =  document.querySelector(this.options.formCreate);



       if(this.formCreate && this.formUpdate !== 'null'){

        this.initForms()
       }
      
        this.initButtons()

    }


    fireEvent(name, args){

     

        if(typeof this.options.listeners[name] === 'function'){

            this.options.listeners[name].apply(this, args)

        }
    }
   

    initForms(){

        

        //new method to the prototype plugin for saving the sent datas.
         this.formCreate.save({
          sucess:() =>{
            this.fireEvent('afterFormCreate')
          },
          failure:() =>{
            this.fireEvent('afterFormCreateError')
          }
         })
        
    
        //new method to the prototype plugin for saving the datas edited
      
         this.formUpdate.save({
          sucess:() =>{
            this.fireEvent('afterFormUpdate')
          },
          failure:() =>{
            this.fireEvent('afterFormUpdateError')
          }
         })
        
        
     

    }

 

    getDatarow(e){

        let tr = e.target.closest('[data-row]')
       
        return  JSON.parse(tr.dataset.row)

    }
    
    btnUpdateClick(e){
      
      let data = this.getDatarow(e)

      for(let name in data)  {

        this.options.onUpdateLoad(this.formUpdate, name, data)
      }
      
      this.fireEvent('afterUpdateClick', [e])
      
    }

    btnExcludeClick(e){

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

    }


    initButtons(){


      this.rows.forEach(row => {

        row.querySelectorAll('.btn').forEach( btn =>{

          btn.addEventListener('click', e =>{

            if(btn.classList.contains('btn-update')){

              this.btnUpdateClick(e)
              
            } else if(btn.classList.contains('btn-delete')){
              
              this.btnExcludeClick(e)

            } else{

              this.fireEvent('buttonClick', [e.target, this.getDatarow(e), e])

            }
          })
        })
      })
    }

}