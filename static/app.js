

var app = new Vue({
    el:"#app",
    data:{
    
        page: "forum",
        threads_empty: "There are no threads for this category",
        posts_empty: "There are no posts for this thread",
        selected_category:"all",
        categories:[
            "all",
            "clothing",
            "books",
            "cards",
            "coins",
            "movies",
            "music"
        ],

        index: 0,

        postings:[],
        // for a new thread

        new_name: "",
        new_author: "",
        new_description: "",
        new_category: "all",
        new_author: "",
        new_body: "",

        url: "https://cs-forum-app-2021.herokuapp.com",

        threads: [
            
        ]
    },

    created:function(){
        this.getThreads();
    },
    methods:{

        //getThreads
        getThreads: function(){
            fetch(this.url+"/thread").then(function(response){
                response.json().then(function(data){
                    console.log(data);
                    app.threads = data;
                });
            })
        },

        
        createThread: function(){
            // var for a new thread
            var new_thread={
                name: this.new_name,
                author:this.new_author,
                description:this.new_description,
                category:this.new_category,
            };
            //push the new thread to threads list
            fetch(this.url+"/thread",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(new_thread)
            }).then(function(){
                //clear the inputs
                app.getThreads();
                app.new_name="";
                app.new_author="";
                app.new_description = "";
                app.category="all";
                app.page="forum";

            })


        },
        

        
        
       

        deleteThread: function( id ) {
            fetch(this.url +"/thread/"+ id,{
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function(){app.getThreads()});
        },
        
        getPosts: function(thread_id){
            
                fetch(this.url+"/thread/" + thread_id).then(function(response){
                    response.json().then(function(data){
                        console.log(data);
                        app.postings = data;
                    });
                }).then(function(){
                    app.page="posts";
                })
        },
        // get posts
            //change page to posts

        createPost: function(thread_id){
       
        var new_post= { 
            thread_id: thread_id,
            author: this.new_author,
            body: this.new_body,
        };
        fetch(this.url +"/post",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(new_post)
        }).then(function(){
            app.new_author="";
                app.new_body="";
                app.page = "posts";
                app.getPosts(thread_id);
        });
    },
    deletePost: function(post) {
        fetch(this.url +"/post/"+ post.thread_id + "/" + post._id ,{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function(){app.getPosts(post.thread_id)});
    },
    
    },
    computed:{
        sortedThreads: function(){
            // var chosenCategory = this.selected_category;
            if( this.selected_category == "all"){
                return this.threads
            } else {
                var filteredThreads = this.threads.filter(function(thread){
                    return thread.category == app.selected_category;
                });
                return filteredThreads;
            }

        }
    }
})