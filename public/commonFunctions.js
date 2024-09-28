function getDateString(timestamp){
    console.log("CONVERTING DATE STRING......................")
    const timeDiff = Date.now() - timestamp; 
    let timestring;

    switch(true){
        case timeDiff >=365*60*60*24*1000 : {
            timestring = Math.round(timeDiff/(365*60*60*24*1000)) + " years ago";
            break;}
        case timeDiff >=30*60*60*24*1000 && timeDiff <365*60*60*24*1000: {
        timestring = Math.round(timeDiff/(30*60*60*24*1000)) + " months ago";
        break;}
        case timeDiff >=60*60*24*1000 && timeDiff <30*60*60*24*1000 : {
            timestring = Math.round(timeDiff/(60*60*24*1000)) + " days ago";
            break;}
        case timeDiff>=60*60*1000 && timeDiff <60*60*24*1000: {
            timestring = Math.round(timeDiff/(60*60*1000)) + " hours ago";
            break;}
            
        case timeDiff >=60*1000 && timeDiff <60*60*1000 : {
            timestring = Math.round(timeDiff/(60*1000)) + " mintues ago";
            break;}
            
        default : {
            timestring = "less than a minute ago";}
    }

    return timestring;
}

module.exports = {
    getDateString
}