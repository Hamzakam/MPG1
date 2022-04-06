
const sortQueryHandler = (sortBy)=>{
    switch(sortBy){
    case "popular":
        return {votes:-1,_id:1};    
    case "controversial":
        return {votes:1,_id:1};    
    case "oldest":
        return {created_at:1,_id:1};    
    case "latest":
    default:
        return {created_at:-1,_id:1};    
    }
};

module.exports = {sortQueryHandler};