let conn = require('./db')

class Pagination{

    constructor(
        query,
        params = [],
        itensPerPage = 10

    ){

        this.query = query;
        this.params = params;
        this.itensPerPage = itensPerPage

    }

    getPage(page){
        

        this.currentPage = page -1

        this.params.push(
            // start of the limit => page 1 start on 0
           this.currentPage * this.itensPerPage,
            //finishi of the limit => page 1 finish on 10
            this.itensPerPage
        )

       return new Promise((s, f) =>{

            conn.query( [this.query, 'SELECT FOUND_ROWS() AS FOUND_ROWS'].join(';'), 
                this.params,
                (err, results) =>{
                if(err){
                    f(err)
                }
                else{
                    
                    this.data = results[0] // data came from database
                    this.total = results[1][0].FOUND_ROWS // assync query that brings the column with the total rows found.
                    this.totalPages = Math.ceil(this.total / this.itensPerPage);
                    this.currentPage ++

                    s(this.data)
                }

            })

        })


    }

    getTotal(){
        return this.total
    }

    getCurrentPage(){
        return this.currentPage

    }

    getTotalPages(){
        return this.totalPages

    }

}

module.exports = Pagination