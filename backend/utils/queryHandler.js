
const sortQueryHandler = (sortBy)=>{
    switch(sortBy){
    case "popular":
        return {
            $sort:{votes:-1,_id:1}    
        };
    case "controversial":
        return {
            $sort:{votes:1,_id:1}    
        };
    case "oldest":
        return {
            $sort:{created_at:1,_id:1}    
        };
    case "latest":
    default:
        return {
            $sort:{created_at:-1,_id:1}    
        };
        
    }
};

module.exports = {sortQueryHandler};