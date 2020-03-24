class APIFilters {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        const queryCopy = {...this.queryStr};

        // removing fields from the query
        const removeFields = ['sort','fields'];
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
}

module.exports = APIFilters;