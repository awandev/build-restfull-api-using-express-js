class APIFilters {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        const queryCopy = {...this.queryStr};

        // removing fields from the query
        const removeFields = ['sort','fields','q','limit','page'];             
        removeFields.forEach(el => delete queryCopy[el]);

        console.log(queryCopy);


        // advanced filter using lt, lte, gt, gte
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

        console.log(queryStr);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if(this.queryStr.sort) {
            // if in search have many arguement, so split it with comma
            // example jobs?sort=salary,jobType
            // sort by salary and jobTYpe
            const sortBy = this.queryStr.sort.split(',').join(' ');
            console.log(sortBy);
            this.query = this.query.sort(this.queryStr.sort);
        }
        else {
            // if no sort option, sort it by postingDate (by default)
            this.query = this.query.sort('-postingDate');
        }
        return this;
    }

    limitFields() {
        if(this.queryStr.fields) { 
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }
    

    searchByQuery() {
        if(this.queryStr.q) {
            const qu = this.queryStr.q.split('-').join(' ');
            this.query = this.query.find({$text: {$search: "\"" + qu + "\""}});
            
            console.log(this.query);
        }
        return this;
    } 


    pagination() {
        const page = parseInt(this.queryStr.page, 10) || 1;
        const limit = parseInt(this.queryStr.limit, 10) || 10;
        const skipResults = (page - 1) * limit;

        this.query = this.query.skip(skipResults).limit(limit);
        return this;
    }
}

module.exports = APIFilters;