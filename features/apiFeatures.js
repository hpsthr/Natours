class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        let queryDef = {
            ...this.queryString
        };
        //this is used for sorting out querys that are include inside it
        const extractionQue = ["page", "sort", "limit", "fields"];
        extractionQue.forEach(field => delete queryDef[field]);
        //from here queryDef excludes all que from above to process
        let queryData = JSON.stringify(queryDef); // data  is converted form javaScript to JSON
        queryData = queryData.replace(/\b(gte|gt|lte|lt)\b/g, match => "$" + match); // if any of the things are awailabe is going to replace by this
        const parseData = JSON.parse(queryData); // parsing data back to java script to find inside a
        this.query = this.query.find(parseData);
        return this;
    }
    sort() {
        const dataSort = this.queryString.sort;
        if (dataSort) {
            const splitJoin = dataSort.split(',').join(' ')
            console.log(splitJoin);
            this.query = this.query.sort(splitJoin)
        } else {
            this.query = this.query.sort("-createdAt")
        }
        return this;
    }
    fields() {
        const dataField = this.queryString.fields;
        if (dataField) {
            const splitJoin = dataField.split(",").join(" ")
            this.query = this.query.select(splitJoin)
        } else {
            this.query = this.query.select("-__v")
        }
        return this;
    }

    paginate() {
        const page = (this.queryString.page * 1 || 1)
        const limit = (this.queryString.limit * 1 || 100)
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }

    duration() {

        return this
    }
}
module.exports = APIFeatures