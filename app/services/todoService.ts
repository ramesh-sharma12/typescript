import {Injectable} from 'angular2/angular2';
import {Firebase} from 'firebase/firebase';

export class TodoService
{    
    dataRef: Firebase

    constructor()
    {  
        this.dataRef = new Firebase('https://ng2do.firebaseio.com/data');
    }

    public getTodos()
    { 
        var list = new Array<Object>();   
          
        return new Promise<Array<Object>>(function (resolve, reject)
       {
             this.dataRef = new Firebase('https://ng2do.firebaseio.com/data'); 

             this.dataRef.on("value", function (snapshot)
             {
                 snapshot.forEach(function (childSnapshot)
                    {                       
                        childSnapshot.forEach(function (rec)
                        {
                            if (rec.key())
                            {
                                list.push({
                                    id: rec.key(),
                                    title: rec.val().title,
                                    description: rec.val().description
                                });
                            }
                        });
                    
                    });

                    resolve(list);
                }, function (errorObject)
                    {
                        reject(list);
                        console.log("The read failed: " + errorObject.code);
                    });
            });
    }

    public addTodo(todo: Object)
    { 
        var todoRef = this.dataRef.child("todo");
        todoRef.push(todo);

        return this.getTodos();
    }

    public removeTodo(id)
    {
        var dataRef = this.dataRef.child("todo").child(id);
        dataRef.remove();
    }

    public getTodoDetail(id)
    {
        var details = Object;

        this.dataRef.on("value", function (snapshot)
        {
            if (snapshot.val().id == id)
            {
                details = snapshot.val();
            }
        }, function (errorObject)
            {
                console.log("The read failed: " + errorObject.code);
            });
    }
}  
