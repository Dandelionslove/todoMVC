(function(){
    var todoController=window.todoController;
    var Ajax=window.Ajax;
    var KEYS=['todoItems','msg','filter'];
    var URL='http://127.0.0.1:3090';
    var MSG='Start server by `node server.js` on project root';

    Object.assign(todoController,{
        init:function(callback){
            Ajax.get(URL+'/init',{
                onSuccess:function(data){
                    console.log('inited',data);
                    KEYS.forEach(function(key){
                        if(key in data)
                        {
                            todoController.data[key]=data[key];
                        }
                    });
                    if(callback)callback();
                },
                onFailure:function(){
                    console.error(MSG);
                }
            });
        },
        flush:function(callback)
        {
            Ajax.get(URL+'/flush?data='+encodeURIComponent(JSON.stringify(todoController.data)),{
                onSuccess:function(){
                    console.log('flushed');
                    if(callback)callback();
                },
                onFailure:function () {
                    console.error(MSG);
                }
            });
        }
    });
})();