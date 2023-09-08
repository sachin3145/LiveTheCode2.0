
function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Earth's radius in kilometers
  
    // Convert latitude and longitude from degrees to radians
    const lat1Rad = (lat1 * Math.PI) / 180;
    const lon1Rad = (lon1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const lon2Rad = (lon2 * Math.PI) / 180;
  
    // Haversine formula
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c; // Distance in kilometers
  
    return distance;
  }
  
  function isDistanceWithinRange(coords1, coords2, rangeInKm) {
    const lat1 = coords1[0];
    const lon1 = coords1[1];
    const lat2 = coords2[0];
    const lon2 = coords2[1];
  
    const distance = calculateDistance(lat1, lon1, lat2, lon2);
  
    return distance < rangeInKm;
  }
  

  class APIFeatures{
    constructor(Query, queryStr){             //querystr to store req.query
        this.Query = Query;
        this.queryStr = queryStr;
    }


    
    filter(){
    //1A) BASIC FILTERING
    const queryObj = {...this.queryStr};           

    //1B) ADVANCE FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr= queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>`$${match}`);

    //Build Query
    this.Query = this.Query.find(JSON.parse(queryStr))
  
    return this;  // to simply return the whole object so thst it could be used by next method i.e sort in this case
    }

    sort(){
        if(this.queryStr.sort){
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.Query = this.Query.sort(sortBy);
        }
        else{
            this.Query = this.Query.sort('-createdAt')
        }
        return this;
    }

    limitFields(){
        if(this.queryStr.fields){
            const fields = this.queryStr.fields.split(',').join(' ');
            this.Query = this.Query.select(fields);
        }
        else{
            this.Query = this.Query.select('-__v');          // -__v to select all except __v as it is created by mongoose to use it internally and it is of no use to the user
        }
        return this;
    }

    paginate(){
        const Page = this.queryStr.page*1 || 1;

        const Limit = this.queryStr.limit*1 || 100;
        const Skip = (Page-1)*Limit;
        this.Query = this.Query.skip(Skip).limit(Limit); 
        return this;
    }
}

module.exports = {APIFeatures, isDistanceWithinRange, calculateDistance};