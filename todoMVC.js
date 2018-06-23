'use strict';

window.addEventListener('load',initAll);

function initAll()
{
    todoController.init(function(){
        // var viewport=document.createElement('meta');
        // viewport.name='viewport';
        // viewport.content='initial-scale=1,maximum-scale=1,user-scalable=no, width=device-width';

        var data=todoController.data;
        var todoInput=query('.todoInput');
        todoInput.addEventListener('keyup',function(ev){
            data.msg=todoInput.value;
            ev.stopPropagation();
        },false);
        todoInput.addEventListener('keyup',function(ev){
            if(ev.keyCode==13)
            {
                var inputMsg=data.msg;
                if(inputMsg=='')
                {
                    console.log('Empty message!');
                    return;
                }
                data.todoItems.push({msg:data.msg,completed:false});
                // console.log(data);
                data.msg='';
                update();
            }
            ev.stopPropagation();
        },false);
        //电脑点击enter键事件
        // query('.enter').addEventListener('click',function(ev){
        //     var inputMsg=data.msg;
        //     if(inputMsg==''){
        //         console.log('Empty message');
        //         return;}
        //     data.todoItems.push({msg:data.msg,completed:false});
        //     data.msg='';
        //     todoInput.focus();
        //     update();
        //     // ev.stopPropagation();
        // },false);
        //手机触屏事件
        $('.enter').tap(function(){
            console.log('tap');
            var inputMsg=data.msg;
            if(inputMsg==''){
                console.log('Empty message');
                return;}
            data.todoItems.push({msg:data.msg,completed:false});
            data.msg='';
            todoInput.focus();
            update();
            return false;
        });

        var toggleAll=query('.toggleAll');
        toggleAll.addEventListener('change',function(ev){
            var completedState = this.checked;
            data.todoItems.forEach(function(itemData,index)
            {
                itemData.completed=completedState;
            });
            update();
            // ev.stopPropagation();
        },false);

        query('.All').addEventListener('click',function(ev){
            data.filter='All';
            update();
            // ev.stopPropagation();
        },false);

        query('.Active').addEventListener('click',function(ev){
            data.filter='Active';
            update();
            // ev.stopPropagation();
        },false);

        query('.Completed').addEventListener('click',function(ev){
            data.filter='Completed';
            update();
            // ev.stopPropagation();
        },false);

        query('.clearCompleted').addEventListener('click',function(ev){
            data.todoItems.forEach(function(itemData,index){
                if(itemData.completed)
                    data.todoItems.splice(index,1);
            });
            data.todoItems.forEach(function(itemData,index){
                if(itemData.completed)
                    data.todoItems.splice(index,1);
            });
            console.log(data);
            update();
        },false);

        update();
    });
}


var idNum=0;
function update()
{
    todoController.flush();
    var data=todoController.data;
    var todoList=query('.todoList');
    todoList.innerHTML='';
    query('.todoInput').value=data.msg;
    var activeCount=0;
    var completedCount=0;

    data.todoItems.forEach(function(itemData,index){
        if(data.filter=='All'||(data.filter=='Active' && !itemData.completed)||(data.filter=='Completed' && itemData.completed))
        {
            var todoItem=document.createElement('div');
            todoItem.classList.add('todoItem');
            todoItem.innerHTML=[
                // '<div class="todoItem">',
                '   <input type="checkbox" class="toggle" >',
                '   <span class="todoContent"></span>',
                '   <button type="button" class="deleteBtn"></button>',
                // '</div>'
            ].join('');
            todoList.insertBefore(todoItem,todoList.firstChild);
            var toggle=todoItem.querySelector('.toggle');
            var todoContent=todoItem.querySelector('.todoContent');
            var contentId='content'+idNum;
            idNum++;
            todoContent.setAttribute('id',contentId);
            var deleteBtn=todoItem.querySelector('.deleteBtn');
            toggle.checked=itemData.completed;
            if(itemData.completed)
            {
                // todoContent.classList.add('completedItem');
                todoItem.classList.add('completedItem')
                completedCount++;
            }
            else
            {
                activeCount++;
            }
            toggle.addEventListener('change',function(){
                itemData.completed=!itemData.completed;
                update();
            });
            todoContent.innerHTML=itemData.msg;
            var editContent=function()
            {
                todoContent.classList.add('editable');
                var editing=document.createElement('input');
                editing.setAttribute('type','text');
                editing.setAttribute('value',itemData.msg);
                todoItem.appendChild(editing);
                editing.focus();
                editing.classList.add('editing');

                editing.addEventListener('keydown',function(ev){
                    if(ev.keyCode==13) //enter
                    {
                        todoContent.classList.remove('editable');
                        itemData.msg=editing.value;
                        update();
                    }
                    else if(ev.keyCode==27) //esc
                    {
                        todoContent.classList.remove('editable');
                        update();
                    }
                },false);
                editing.addEventListener('blur',function(ev) {
                    todoContent.classList.remove('editable');
                    update();
                },false);
            };

            todoContent.addEventListener('dblclick',function()
            {
                console.log('dbclick');
                editContent();
            },false);
            //手机触屏时间：手机屏幕双击，使用Zepto解决延迟问题
            $('#'+contentId).doubleTap(function(){
                console.log('double tap');
                editContent();
                return false;
            });
            $('#'+contentId).longTap(function () {
               console.log('Long tap');
               editContent();
               return false;
            });

            deleteBtn.addEventListener('click',function(){
                data.todoItems.splice(index,1);
                update();
            },false);
        }
    });

    query('.countShow').innerHTML=activeCount==0?'No item left':activeCount+(activeCount==1?' item':' items')+' left';
    query('.clearCompleted').style.visibility=completedCount>0?'visible':'hidden';
}

function query(selectMsg)
{
    return document.querySelector(selectMsg);
}
