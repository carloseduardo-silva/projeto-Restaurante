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
            //finish of the limit => page 1 finish on 10
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
                    
                    this.data = results[0] // datas came from database
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

    getQueryString(params){

        let queryString = [];

        for(let name in params){

            queryString.push(`${name}=${params[name]}`)

        }

        return queryString.join('&')

    }


    getNavigation(params){

        let limitPagesNav = 5;
        let links = [];
        let nrstart = 0
        let nrend = limitPagesNav

        //in case of the total of pages is lower than the limit of pages on the nav
        if(this.getTotalPages() < limitPagesNav){
            limitPagesNav = this.getTotalPages()
        }

        //if we are in first pages
        if(this.getCurrentPage() - parseInt(limitPagesNav/2) < 1){ 
            nrstart = 1;
            nrend = limitPagesNav
        }
        //if we are in the last pages
        else if(this.currentPage + parseInt(limitPagesNav/2) > this.getTotalPages() ){
            nrstart = this.getTotalPages() - limitPagesNav;
            nrend = this.getTotalPages()

        }
        else{
            nrstart = this.getCurrentPage() - parseInt(limitPagesNav/2);
            nrend = this.getCurrentPage() + parseInt(limitPagesNav/2);

        }

        if(this.getCurrentPage() > 1) {
            links.push({
                text:'«',
                href: '?' + this.getQueryString(Object.assign({}, params, {page: this.getCurrentPage()-1} ))
            
            })
        }

        //repeating while the nrstart < nrend 
        for(let x = nrstart; x <= nrend; x++){

            links.push({
                text:x,
                href:`?${this.getQueryString(Object.assign({}, params, {page:x} ))}`,
                active: (x === this.getCurrentPage())
            })

        }

        if(this.getCurrentPage() < this.getTotalPages()){

            links.push({
                text:'»',
                href: '?' + this.getQueryString(Object.assign({}, params, {page: this.getCurrentPage() +1} ))

            })

        }


       
       
       
        return links;
    }

 
    

}

module.exports = Pagination