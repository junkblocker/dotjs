$.ajax({
  url: 'https://localhost:3131/'+location.hostname.replace(/^www\./,'')+'.js',
  dataType: 'text',
  success: function(d){
    try {
    $(function(){ eval(d) })
    } catch (e) {
        console.log("Uncaught exception caught by dotjs.js", e);
    }
  },
  error: function(){
    console.log('no dotjs server found at localhost:3131')
  }
})
