HTMLFormElement.prototype.save = function(config){


    //config is the object with the response functions (sucess and failure)
    //assigning the Form selected to the var Form
    let form = this


    form.addEventListener('submit', e =>{

        //cancel the pattern action of send, because we are doing the sent by it self.
        e.preventDefault();
    
        let formData = new FormData(form)
        //fetch requisition (executing in routes-index) that receives a promisse
        fetch(form.action, {
          method: form.method,
          body: formData
        })
        .then(response => response.json())
        .then(json => {

            if(json.error){
               
               if ( typeof config.failure === 'function') config.failure(json.error)
                
            } else{

                if ( typeof config.sucess === 'function') config.sucess(json)

               

            }
            
    
        }).catch(err =>{
            if ( typeof config.failure === 'function') config.failure(err)
        });
        
        });
    



    }


