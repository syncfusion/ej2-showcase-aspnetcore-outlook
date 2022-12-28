var window;
var x=window.location.href.length-1;
if (window.location.href[x]!='/')
    window.location.href =  window.location.href + "/";
var ajaxHTML = new ej.base.Ajax('Home/Home', 'GET', true);;
ajaxHTML.send().then(function (value) {
    document.getElementById('content-area').innerHTML = value.toString();
    renderControl("content-area");
    window.home();
});
function renderControl(id) {
    var scripts = document.querySelectorAll("#" + id + " script");
    var length = scripts.length;
    for (var i = 0; i < length; i++) {
        eval(scripts[i].text);
    }
}

