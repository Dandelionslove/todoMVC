(function(){
    var GET='get';
    window.Ajax={
        get:function(url,opt){
            opt=opt||{};
            if(opt.cached){
                url +=(url.indexOf('?')>-1?'&':'?')+new Date().getTime()+'r';
            }
            var request;
            if(window.XMLHttpRequest)
            {
                request=new XMLHttpRequest();
            }
            else
            {
                request=new ActiveXObject('Microsoft.XMLHTTP');
            }
            request.onreadystatechange=function() {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status >= 200 && request.status < 400) {
                        var ret = request.responseText;
                        var contentType = request.getResponseHeader('content-type');
                        if (contentType == 'application/json' || contentType == 'text/json') {
                            try {
                                ret = JSON.parse(ret);
                            } catch (e) {
                                console.error(e);
                                if (opt.onFailure) opt.onFailure(e);
                            }
                        }
                        if (opt.onSuccess) opt.onSuccess(ret);
                    }
                    else {
                        if (opt.onFailure) opt.onFailure();
                    }
                }
            };
            request.open(GET,url,true);
            request.send(null);
        }
    }
})();