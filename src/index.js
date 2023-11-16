function openURL(a){
    var dirname = window.location
    dirname = (dirname + "").match(/(.*)[\/\\]/)[1]||'';
    // console.log(dirname);
    window.location.href = dirname + a;
    
}